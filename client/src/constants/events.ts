export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  RESUME_DOWNLOAD: 'resume_download',
  GITHUB_CLICK: 'github_click',
  LINKEDIN_CLICK: 'linkedin_click',
  PROJECT_CLICK: 'project_click',
  CONTACT_SUBMIT: 'contact_submit',
  WHATSAPP_CLICK: 'whatsapp_click',
} as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]
