import {
  getDocument,
  setDocument,
  getAllDocuments,
  createBatch,
  commitBatch,
  docRef,
  collectionRef,
  FieldValue,
  queryDocuments,
} from '../../utils/firestoreService.js';
import { Collections, DocIds } from '../../types/collections.js';
import { PortfolioDraftDoc } from '../../types/firestore.js';
import { publicCache } from '../../utils/cache.js';
import { createPatch } from '../../utils/diffEngine.js';
import { classifyVersionChange } from '../ai/aiService.js';
import { auditLog } from '../../utils/auditLog.js';

/**
 * Deep merge draft changes supporting dot-notation paths.
 */
export function mergeChanges(content: any, changes: Record<string, any>): any {
  const merged = JSON.parse(JSON.stringify(content));
  for (const [path, value] of Object.entries(changes)) {
    const parts = path.split('.');
    let current = merged;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || current[part] === null || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
  }
  return merged;
}

export async function getOrCreateDraft(adminId: string): Promise<any> {
  const draft = await getDocument<PortfolioDraftDoc>(Collections.PORTFOLIO_DRAFTS, adminId);
  if (draft) {
    return draft.content;
  }

  // Create default draft from seed/published state
  const profile = (await getDocument(Collections.PORTFOLIO_PUBLISHED, DocIds.PORTFOLIO_MAIN)) || {};
  const skills = await getAllDocuments(Collections.SKILLS);
  const experience = await getAllDocuments(Collections.EXPERIENCE);
  const education = await getAllDocuments(Collections.EDUCATION);
  const projects = await getAllDocuments(Collections.PROJECTS);
  const services = await getAllDocuments(Collections.SERVICES);
  const settings = (await getDocument(Collections.SETTINGS, DocIds.SETTINGS_GLOBAL)) || {};

  const defaultContent = {
    profile,
    skills,
    experience,
    education,
    projects,
    services,
    settings,
  };

  await setDocument(Collections.PORTFOLIO_DRAFTS, adminId, {
    adminId,
    content: defaultContent,
    status: 'draft',
  });

  return defaultContent;
}

export async function updateDraft(adminId: string, changes: Record<string, any>): Promise<any> {
  const currentContent = await getOrCreateDraft(adminId);
  const updatedContent = mergeChanges(currentContent, changes);

  await setDocument(Collections.PORTFOLIO_DRAFTS, adminId, {
    adminId,
    content: updatedContent,
    status: 'draft',
  });

  return updatedContent;
}

export async function publishDraft(adminId: string): Promise<void> {
  const draft = await getDocument<PortfolioDraftDoc>(Collections.PORTFOLIO_DRAFTS, adminId);
  if (!draft) return;

  const content = draft.content as any;

  // Retrieve current published database state (beforeState)
  const beforeProfile = (await getDocument(Collections.PORTFOLIO_PUBLISHED, DocIds.PORTFOLIO_MAIN)) || {};
  const beforeSkills = (await getAllDocuments(Collections.SKILLS)) || [];
  const beforeExperience = (await getAllDocuments(Collections.EXPERIENCE)) || [];
  const beforeEducation = (await getAllDocuments(Collections.EDUCATION)) || [];
  const beforeProjects = (await getAllDocuments(Collections.PROJECTS)) || [];
  const beforeServices = (await getAllDocuments(Collections.SERVICES)) || [];
  const beforeSettings = (await getDocument(Collections.SETTINGS, DocIds.SETTINGS_GLOBAL)) || {};

  const beforeState = {
    profile: beforeProfile,
    skills: beforeSkills,
    experience: beforeExperience,
    education: beforeEducation,
    projects: beforeProjects,
    services: beforeServices,
    settings: beforeSettings,
  };

  const batch = createBatch();

  // 1. Publish profile
  if (content.profile) {
    const nextVersion = (content.profile.version || 1) + 1;
    content.profile.version = nextVersion;

    batch.set(docRef(Collections.PORTFOLIO_PUBLISHED, DocIds.PORTFOLIO_MAIN), {
      ...content.profile,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  // 2. Publish settings
  if (content.settings) {
    batch.set(docRef(Collections.SETTINGS, DocIds.SETTINGS_GLOBAL), {
      ...content.settings,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  // Helper function to clear and set a subcollection in the batch
  const publishCollection = async (collectionName: any, items: any[]) => {
    const currentDocs = await collectionRef(collectionName).get();
    currentDocs.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    items.forEach((item, index) => {
      const id = item.id || `${collectionName.slice(0, -1)}-${index}`;
      const docData = { ...item };
      delete docData.id;
      docData.createdAt = docData.createdAt || FieldValue.serverTimestamp();
      docData.updatedAt = FieldValue.serverTimestamp();
      batch.set(docRef(collectionName, id), docData);
    });
  };

  // Publish subcollections
  if (Array.isArray(content.skills)) await publishCollection(Collections.SKILLS, content.skills);
  if (Array.isArray(content.experience)) await publishCollection(Collections.EXPERIENCE, content.experience);
  if (Array.isArray(content.education)) await publishCollection(Collections.EDUCATION, content.education);
  if (Array.isArray(content.projects)) await publishCollection(Collections.PROJECTS, content.projects);
  if (Array.isArray(content.services)) await publishCollection(Collections.SERVICES, content.services);

  // Commit batch
  await commitBatch(batch);

  // Classify changes and create a major version if needed
  const changeClassification = await classifyVersionChange(beforeState, content);
  if (changeClassification === 'major') {
    const patch = createPatch(beforeState, content);
    const existingVersions = await queryDocuments<any>(
      Collections.VERSIONS,
      [],
      'number',
      'desc',
      1,
    );
    const nextNum = existingVersions.length > 0 ? (existingVersions[0].number || 0) + 1 : 1;

    await setDocument(Collections.VERSIONS, `ver-${nextNum}`, {
      number: nextNum,
      label: `Publish Version ${nextNum}`,
      patch,
      snapshot: content,
    });

    await auditLog(
      'VERSION_CREATED',
      { versionNumber: nextNum, label: `Publish Version ${nextNum}` },
      'system',
      adminId,
    );
  }

  // Log draft publish event
  await auditLog(
    'DRAFT_PUBLISHED',
    { version: content.profile?.version || 1 },
    'admin',
    adminId,
  );

  // Update draft status to published
  await setDocument(Collections.PORTFOLIO_DRAFTS, adminId, {
    adminId,
    content,
    status: 'published',
  });

  // Invalidate public cache
  publicCache.clear();
}
