export interface FeatureFlags {
  showBlog: boolean
  showCertifications: boolean
  showAnalytics: boolean
  enableContactForm: boolean
  showResumeDownload: boolean
  showTestimonials: boolean
  maintenanceMode: boolean
}

export interface SeoSettings {
  pageTitle: string
  metaDescription: string
  ogImage?: string
  canonicalUrl?: string
}

export interface ContactSettings {
  email: string
  phone: string
  location: string
  enableContactForm: boolean
}

export interface ThemeConfig {
  primaryColor: string
  accentColor: string
  fontFamily: string
  borderRadius: string
  animationSpeed: string
  mode: 'light' | 'dark'
}

export interface ThemeSlot extends ThemeConfig {
  id: string
  name: string
}

export interface SiteSettings {
  seo: SeoSettings
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
    resumeUrl?: string
  }
  contact: ContactSettings
  featureFlags: FeatureFlags
  theme: ThemeConfig
  analyticsEnabled: boolean
}

export interface HealthServiceStatus {
  name: string
  status: 'ok' | 'error' | 'unknown'
  latencyMs?: number
  message?: string
}

export interface HealthDashboardData {
  services: HealthServiceStatus[]
  checkedAt: string
}

export interface MediaItem {
  id: string
  url: string
  thumbnailUrl?: string
  blurPlaceholder?: string
  folder: string
  filename: string
  mimeType: string
  size: number
  createdAt: string
}
