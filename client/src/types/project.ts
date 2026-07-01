export interface Project {
  id: string | number
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
  displayOrder?: number
}

export interface ProjectGitHub {
  repoName: string
  description: string
  topics: string[]
  languages: string[]
  stars: number
  forks: number
  lastUpdated: string
  repoUrl: string
  liveUrl?: string
  license?: string
  readme?: string
}

export interface ProjectAdmin extends Project {
  adminDescription?: string
  featuredImage?: string
  archived?: boolean
}

export interface ProjectSummary {
  overview: string
  features: string[]
  techStack: string[]
  challenges: string
  learningOutcomes: string
}
