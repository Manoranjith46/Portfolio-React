import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNotifications } from '@/api/notifications'
import NotificationsPanel from './NotificationsPanel'

export default function NotificationBell() {
  const { isAuthenticated } = useAuthStore()
  const { data: notifications } = useNotifications()
  const [open, setOpen] = useState(false)

  if (!isAuthenticated) return null

  const unreadCount = (notifications ?? []).filter((n) => !n.read).length

  return (
    <>
      <div className="notification-bell icon__container" onClick={() => setOpen(!open)} style={{ marginRight: 8 }}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>
      <NotificationsPanel isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
