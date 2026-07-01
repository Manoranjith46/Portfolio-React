export const Collections = {
  USERS: 'users',
  PORTFOLIO_PUBLISHED: 'portfolioPublished',
  PORTFOLIO_DRAFTS: 'portfolioDrafts',
  SKILLS: 'skills',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  PROJECTS: 'projects',
  SERVICES: 'services',
  MEDIA: 'media',
  RESUME_JOBS: 'resumeJobs',
  RESUME_DIFFS: 'resumeDiffs',
  GITHUB_REPOS: 'githubRepos',
  VERSIONS: 'versions',
  AUDIT_LOGS: 'auditLogs',
  ANALYTICS_EVENTS: 'analyticsEvents',
  PAGEVIEWS: 'pageviews',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
  JOBS: 'jobs',
} as const

export const DocIds = {
  ADMIN: 'admin',
  PORTFOLIO_MAIN: 'main',
  SETTINGS_GLOBAL: 'global',
} as const

export type CollectionName = (typeof Collections)[keyof typeof Collections]
