import type { Timestamp } from 'firebase-admin/firestore'

export interface FirestoreTimestamps {
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface SocialLinksDoc {
  github?: string
  linkedin?: string
  twitter?: string
  whatsapp?: string
  email?: string
  resumeUrl?: string
}

export interface PortfolioProfileDoc {
  name: string
  title: string
  subtitle?: string
  description: string
  summary?: string
  avatarUrl?: string
  heroImageUrl?: string
  yearsOfExperience?: number
  completedProjects?: number
  socialLinks: SocialLinksDoc
  location?: string
  phone?: string
  email?: string
  footerDescription?: string
}

export interface SkillDoc {
  name: string
  category: string
  icon?: string
  iconType?: 'svg' | 'png'
  displayOrder: number
}

export interface ExperienceDoc {
  company: string
  role: string
  startDate: string
  endDate?: string
  description: string
  current?: boolean
  displayOrder: number
}

export interface EducationDoc {
  title: string
  institute: string
  percent?: string
  gradeType?: 'CGPA' | 'Percentage'
  yearOfPassing: string
  displayOrder: number
}

export interface ServiceDoc {
  name: string
  description: string
  icon?: string
  displayOrder: number
}

export interface ProjectDoc {
  title: string
  description: string
  image: string
  link: string
  repoUrl?: string
  liveUrl?: string
  topics?: string[]
  languages?: string[]
  stars?: number
  pinned?: boolean
  hidden?: boolean
  featured?: boolean
  displayOrder: number
  adminDescription?: string
  featuredImage?: string
  archived?: boolean
}

export interface UserDoc {
  email: string
  name: string
  role: 'admin' | 'user'
  passwordHash: string
  avatarUrl?: string
}

export interface FeatureFlagsDoc {
  showBlog: boolean
  showCertifications: boolean
  showAnalytics: boolean
  enableContactForm: boolean
  showResumeDownload: boolean
  showTestimonials: boolean
  maintenanceMode: boolean
}

export interface SeoSettingsDoc {
  pageTitle: string
  metaDescription: string
  ogImage?: string
  canonicalUrl?: string
}

export interface ContactSettingsDoc {
  email: string
  phone: string
  location: string
  enableContactForm: boolean
}

export interface ThemeConfigDoc {
  primaryColor: string
  accentColor: string
  fontFamily: string
  borderRadius: string
  animationSpeed: string
  mode: 'light' | 'dark'
}

export interface SiteSettingsDoc {
  seo: SeoSettingsDoc
  socialLinks: SocialLinksDoc
  contact: ContactSettingsDoc
  featureFlags: FeatureFlagsDoc
  theme: ThemeConfigDoc
  analyticsEnabled: boolean
}

export interface PortfolioPublishedDoc extends PortfolioProfileDoc, FirestoreTimestamps {
  version: number
}

export interface PortfolioDraftDoc {
  adminId: string
  content: Record<string, unknown>
  status: 'draft' | 'published'
  createdAt: Timestamp
  updatedAt: Timestamp
}
