export interface AnalyticsOverview {
  totalVisitors: number
  uniqueVisitors: number
  avgSessionDuration: number
  bounceRate: number
}

export interface EngagementMetrics {
  resumeDownloads: number
  contactSubmissions: number
  githubClicks: number
  linkedinClicks: number
}

export interface ProjectAnalytics {
  projectId: string
  projectName: string
  views: number
  clicks: number
}

export interface TrafficData {
  countries: { country: string; count: number }[]
  devices: { device: string; count: number }[]
  referrers: { referrer: string; count: number }[]
}

export interface TimelineDataPoint {
  date: string
  visitors: number
}

export interface AnalyticsData {
  overview: AnalyticsOverview
  engagement: EngagementMetrics
  projects: ProjectAnalytics[]
  traffic: TrafficData
  timeline: TimelineDataPoint[]
}

export type AnalyticsRange = '7d' | '30d' | '90d'

export type AnalyticsEventType =
  | 'resume_download'
  | 'github_click'
  | 'linkedin_click'
  | 'project_click'
  | 'contact_submit'
