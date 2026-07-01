export interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  whatsapp?: string
  email?: string
  resumeUrl?: string
}

export interface PortfolioProfile {
  id?: string
  name: string
  title: string
  subtitle?: string
  description: string
  summary?: string
  avatarUrl?: string
  heroImageUrl?: string
  yearsOfExperience?: number
  completedProjects?: number
  socialLinks: SocialLinks
  location?: string
  phone?: string
  email?: string
}

export interface Skill {
  id?: string
  name: string
  category: string
  icon?: string
  iconType?: 'svg' | 'png'
  displayOrder?: number
}

export interface Experience {
  id?: string
  company: string
  role: string
  startDate: string
  endDate?: string
  description: string
  current?: boolean
}

export interface Education {
  id?: string
  title: string
  institute: string
  percent?: string
  gradeType?: 'CGPA' | 'Percentage'
  yearOfPassing: string
}

export interface Service {
  id?: string
  name: string
  description: string
  icon?: string
}
