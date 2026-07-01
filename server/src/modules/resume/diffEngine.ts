import { Resume } from '../ai/aiService.js';

export interface DiffEntry {
  field: string;
  changeType: 'added' | 'changed' | 'removed';
  oldValue?: any;
  newValue?: any;
  path: string; // The dot-notation path in the draft snapshot (e.g., 'profile.summary', 'skills', 'skills.2')
}

export interface ResumeDiffResult {
  added: DiffEntry[];
  changed: DiffEntry[];
  removed: DiffEntry[];
}

/**
 * Normalizes text for comparison.
 */
export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Compare extracted resume JSON vs current database portfolio data.
 * Outputs flat lists matching the frontend DiffEntry and ResumeDiffResult interfaces.
 */
export function diffResume(extracted: Resume, current: {
  profile: any;
  skills: any[];
  experience: any[];
  education: any[];
}): ResumeDiffResult {
  const added: DiffEntry[] = [];
  const changed: DiffEntry[] = [];
  const removed: DiffEntry[] = [];

  const addEntry = (entry: DiffEntry) => {
    if (entry.changeType === 'added') added.push(entry);
    else if (entry.changeType === 'changed') changed.push(entry);
    else if (entry.changeType === 'removed') removed.push(entry);
  };

  // 1. Profile fields
  if (extracted.summary && extracted.summary !== current.profile?.summary) {
    addEntry({
      field: 'Profile Summary',
      changeType: current.profile?.summary ? 'changed' : 'added',
      oldValue: current.profile?.summary,
      newValue: extracted.summary,
      path: 'profile.summary',
    });
  }
  if (extracted.name && extracted.name !== current.profile?.name) {
    addEntry({
      field: 'Profile Name',
      changeType: current.profile?.name ? 'changed' : 'added',
      oldValue: current.profile?.name,
      newValue: extracted.name,
      path: 'profile.name',
    });
  }

  // 2. Skills
  const currentSkillsSlugMap = new Map(current.skills.map((s, idx) => [slugify(s.name), { skill: s, idx }]));

  extracted.skills.forEach((skill) => {
    const slug = slugify(skill.name);
    if (!currentSkillsSlugMap.has(slug)) {
      addEntry({
        field: `Skill: ${skill.name} (${skill.category})`,
        changeType: 'added',
        newValue: {
          name: skill.name,
          category: skill.category,
          displayOrder: current.skills.length + added.filter(e => e.path === 'skills').length,
        },
        path: 'skills',
      });
    } else {
      const match = currentSkillsSlugMap.get(slug)!;
      if (match.skill.category !== skill.category) {
        addEntry({
          field: `Skill Category: ${skill.name}`,
          changeType: 'changed',
          oldValue: match.skill.category,
          newValue: skill.category,
          path: `skills.${match.idx}.category`,
        });
      }
    }
  });

  current.skills.forEach((skill, idx) => {
    const slug = slugify(skill.name);
    const extractedSkillsSlugMap = new Set(extracted.skills.map((s) => slugify(s.name)));
    if (!extractedSkillsSlugMap.has(slug)) {
      addEntry({
        field: `Remove Skill: ${skill.name}`,
        changeType: 'removed',
        oldValue: skill,
        path: `skills.${idx}`,
      });
    }
  });

  // 3. Experience
  const currentExpKeyMap = new Map(
    current.experience.map((exp, idx) => [slugify(exp.company) + '_' + slugify(exp.role), { exp, idx }]),
  );

  extracted.experience.forEach((exp) => {
    const key = slugify(exp.company) + '_' + slugify(exp.role);
    const normalizedExp = {
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description,
      displayOrder: current.experience.length + added.filter(e => e.path === 'experience').length,
    };

    if (!currentExpKeyMap.has(key)) {
      addEntry({
        field: `Experience: ${exp.company} - ${exp.role}`,
        changeType: 'added',
        newValue: normalizedExp,
        path: 'experience',
      });
    } else {
      const match = currentExpKeyMap.get(key)!;
      const descDiff = match.exp.description !== exp.description;
      const startDiff = match.exp.startDate !== exp.startDate;
      const endDiff = (match.exp.endDate || '') !== (exp.endDate || '');

      if (descDiff || startDiff || endDiff) {
        addEntry({
          field: `Update Experience: ${exp.company} - ${exp.role}`,
          changeType: 'changed',
          oldValue: match.exp,
          newValue: { ...match.exp, ...normalizedExp },
          path: `experience.${match.idx}`,
        });
      }
    }
  });

  current.experience.forEach((exp, idx) => {
    const key = slugify(exp.company) + '_' + slugify(exp.role);
    const extractedKeys = new Set(extracted.experience.map((e) => slugify(e.company) + '_' + slugify(e.role)));
    if (!extractedKeys.has(key)) {
      addEntry({
        field: `Remove Experience: ${exp.company} - ${exp.role}`,
        changeType: 'removed',
        oldValue: exp,
        path: `experience.${idx}`,
      });
    }
  });

  // 4. Education
  const getEduKey = (e: any) => {
    const inst = e.institution || e.institute || '';
    const deg = e.degree || e.title || '';
    return slugify(inst) + '_' + slugify(deg);
  };
  const currentEduKeyMap = new Map(current.education.map((edu, idx) => [getEduKey(edu), { edu, idx }]));

  extracted.education.forEach((edu) => {
    const key = getEduKey(edu);
    const normalizedEdu = {
      title: edu.degree,
      institute: edu.institution,
      yearOfPassing: edu.year,
      field: edu.field,
      displayOrder: current.education.length + added.filter(e => e.path === 'education').length,
    };

    if (!currentEduKeyMap.has(key)) {
      addEntry({
        field: `Education: ${edu.institution} - ${edu.degree}`,
        changeType: 'added',
        newValue: normalizedEdu,
        path: 'education',
      });
    } else {
      const match = currentEduKeyMap.get(key)!;
      const yearDiff = (match.edu.yearOfPassing || match.edu.year || '') !== (edu.year || '');
      const fieldDiff = (match.edu.field || '') !== (edu.field || '');
      if (yearDiff || fieldDiff) {
        addEntry({
          field: `Update Education: ${edu.institution} - ${edu.degree}`,
          changeType: 'changed',
          oldValue: match.edu,
          newValue: { ...match.edu, ...normalizedEdu },
          path: `education.${match.idx}`,
        });
      }
    }
  });

  current.education.forEach((edu, idx) => {
    const key = getEduKey(edu);
    const extractedKeys = new Set(extracted.education.map((e) => getEduKey(e)));
    if (!extractedKeys.has(key)) {
      addEntry({
        field: `Remove Education: ${edu.institute || edu.institution} - ${edu.title || edu.degree}`,
        changeType: 'removed',
        oldValue: edu,
        path: `education.${idx}`,
      });
    }
  });

  return { added, changed, removed };
}
