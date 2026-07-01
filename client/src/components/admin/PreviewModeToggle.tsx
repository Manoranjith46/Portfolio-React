import { useAuthStore } from '@/stores/authStore'
import { useEditorStore } from '@/stores/editorStore'
import AdminMenu from './AdminMenu'
import '@/css/admin.css'

interface PreviewModeToggleProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

export default function PreviewModeToggle({ menuOpen, setMenuOpen }: PreviewModeToggleProps) {
  const { isAuthenticated } = useAuthStore()
  const { mode, setMode } = useEditorStore()

  if (!isAuthenticated) return null

  return (
    <div className="admin-fab">
      {menuOpen && <AdminMenu onClose={() => setMenuOpen(false)} />}
      <button type="button" onClick={() => setMenuOpen(!menuOpen)}>
        Admin Menu
      </button>
      {mode === 'view' && (
        <button type="button" onClick={() => setMode('edit')}>
          Edit
        </button>
      )}
      {mode === 'preview' && (
        <button type="button" onClick={() => setMode('edit')}>
          Back to Edit
        </button>
      )}
    </div>
  )
}
