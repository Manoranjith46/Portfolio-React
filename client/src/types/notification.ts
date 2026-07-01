export type NotificationType =
  | 'resume_download'
  | 'contact_submit'
  | 'github_click'
  | 'github_sync'
  | 'resume_ready'
  | 'system'

export interface Notification {
  id: string
  adminId?: string
  type: NotificationType
  message: string
  read: boolean
  createdAt: string
}
