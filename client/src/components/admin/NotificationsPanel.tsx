import { SlidePanel } from '@/components/shared/Modal'
import { useNotifications, useMarkNotificationRead } from '@/api/notifications'
import Loader from '@/components/shared/Loader'
import { formatRelativeTime } from '@/utils/formatters'

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { data: notifications, isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Notifications">
      <div className="admin-panel">
        {isLoading ? <Loader /> : (notifications ?? []).map((n) => (
          <div key={n.id} className="activity-item">
            <div style={{ flex: 1 }}>
              <p>{n.message}</p>
              <span className="text__muted" style={{ fontSize: 12 }}>{formatRelativeTime(n.createdAt)}</span>
            </div>
            {!n.read && (
              <button type="button" className="btn" style={{ fontSize: 11 }} onClick={() => { void markRead.mutateAsync(n.id) }}>
                Mark Read
              </button>
            )}
          </div>
        ))}
        {(notifications ?? []).length === 0 && !isLoading && (
          <p className="text__muted">No notifications.</p>
        )}
      </div>
    </SlidePanel>
  )
}
