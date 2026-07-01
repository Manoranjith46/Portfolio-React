import { getDocument, queryDocuments } from '../../utils/firestoreService.js';
import { Collections, DocIds } from '../../types/collections.js';
import {
  PortfolioPublishedDoc,
  SkillDoc,
  ExperienceDoc,
  EducationDoc,
  ProjectDoc,
} from '../../types/firestore.js';
import { publicCache } from '../../utils/cache.js';
import { getOrCreateDraft } from '../draft/draftService.js';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getPublicProfile(adminId?: string): Promise<Partial<PortfolioPublishedDoc>> {
  if (adminId) {
    const draft = await getOrCreateDraft(adminId);
    if (draft.profile) {
      const { email, phone, ...publicProfile } = draft.profile;
      return publicProfile;
    }
  }

  const cacheKey = 'public:profile';
  const cached = publicCache.get<Partial<PortfolioPublishedDoc>>(cacheKey);
  if (cached) return cached;

  const profile = await getDocument<PortfolioPublishedDoc>(
    Collections.PORTFOLIO_PUBLISHED,
    DocIds.PORTFOLIO_MAIN,
  );
  if (!profile) {
    throw new Error('Profile not found');
  }

  // Strip private fields
  const { email, phone, ...publicProfile } = profile;

  publicCache.set(cacheKey, publicProfile, CACHE_TTL);
  return publicProfile;
}

export async function getPublicSkills(adminId?: string): Promise<SkillDoc[]> {
  if (adminId) {
    const draft = await getOrCreateDraft(adminId);
    if (Array.isArray(draft.skills)) {
      return draft.skills;
    }
  }

  const cacheKey = 'public:skills';
  const cached = publicCache.get<SkillDoc[]>(cacheKey);
  if (cached) return cached;

  const skills = await queryDocuments<SkillDoc>(
    Collections.SKILLS,
    [],
    'displayOrder',
    'asc',
  );
  publicCache.set(cacheKey, skills, CACHE_TTL);
  return skills;
}

export async function getPublicExperience(adminId?: string): Promise<ExperienceDoc[]> {
  if (adminId) {
    const draft = await getOrCreateDraft(adminId);
    if (Array.isArray(draft.experience)) {
      return draft.experience;
    }
  }

  const cacheKey = 'public:experience';
  const cached = publicCache.get<ExperienceDoc[]>(cacheKey);
  if (cached) return cached;

  const experience = await queryDocuments<ExperienceDoc>(
    Collections.EXPERIENCE,
    [],
    'displayOrder',
    'asc',
  );
  publicCache.set(cacheKey, experience, CACHE_TTL);
  return experience;
}

export async function getPublicEducation(adminId?: string): Promise<EducationDoc[]> {
  if (adminId) {
    const draft = await getOrCreateDraft(adminId);
    if (Array.isArray(draft.education)) {
      return draft.education;
    }
  }

  const cacheKey = 'public:education';
  const cached = publicCache.get<EducationDoc[]>(cacheKey);
  if (cached) return cached;

  const education = await queryDocuments<EducationDoc>(
    Collections.EDUCATION,
    [],
    'displayOrder',
    'asc',
  );
  publicCache.set(cacheKey, education, CACHE_TTL);
  return education;
}

export async function getPublicProjects(adminId?: string): Promise<ProjectDoc[]> {
  if (adminId) {
    const draft = await getOrCreateDraft(adminId);
    if (Array.isArray(draft.projects)) {
      // In preview, we also filter out hidden projects for consistency with visitor experience
      return draft.projects.filter((p: any) => p.hidden !== true);
    }
  }

  const cacheKey = 'public:projects';
  const cached = publicCache.get<ProjectDoc[]>(cacheKey);
  if (cached) return cached;

  const projects = await queryDocuments<ProjectDoc>(
    Collections.PROJECTS,
    [],
    'displayOrder',
    'asc',
  );
  // Filter out hidden projects in memory to avoid Firestore composite index errors
  const filtered = projects.filter((p) => p.hidden !== true);

  publicCache.set(cacheKey, filtered, CACHE_TTL);
  return filtered;
}
