export type DiffChangeType = 'added' | 'changed' | 'removed'

export interface DiffEntry {
  field: string
  changeType: DiffChangeType
  oldValue?: unknown
  newValue?: unknown
  path?: string
}

export interface ResumeSkill {
  name: string
  category: string
}

export interface ResumeExperience {
  company: string
  role: string
  startDate: string
  endDate?: string
  description: string
}

export interface ResumeEducation {
  institution: string
  degree: string
  field: string
  year: string
}

export interface ResumeCertification {
  name: string
  issuer: string
  year: string
}

export interface ResumeLinks {
  github?: string
  linkedin?: string
  portfolio?: string
}

export interface ResumeData {
  name: string
  email: string
  phone?: string
  summary: string
  skills: ResumeSkill[]
  experience: ResumeExperience[]
  education: ResumeEducation[]
  certifications?: ResumeCertification[]
  links?: ResumeLinks
}

export interface ResumeDiffResult {
  added: DiffEntry[]
  changed: DiffEntry[]
  removed: DiffEntry[]
}

export type ResumeProcessingStatus =
  | 'uploading'
  | 'parsing'
  | 'analyzing'
  | 'ready'
  | 'failed'
