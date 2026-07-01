import { useEditorStore } from '@/stores/editorStore'
import ResumeApproval from './ResumeApproval'
import RepoSelector from './RepoSelector'
import MediaLibrary from './MediaLibrary'
import VersionHistory from './VersionHistory'
import ActivityCenter from './ActivityCenter'
import AnalyticsDashboard from './AnalyticsDashboard'
import ThemeBuilder from './ThemeBuilder'
import SettingsPanel from './SettingsPanel'
import HealthDashboard from './HealthDashboard'

interface AdminMenuProps {
  onClose: () => void
}

const PANELS = [
  { id: 'resume', label: 'Resume Pipeline' },
  { id: 'github', label: 'GitHub Sync' },
  { id: 'media', label: 'Media Library' },
  { id: 'versions', label: 'Version History' },
  { id: 'audit', label: 'Activity Center' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'theme', label: 'Theme Builder' },
  { id: 'settings', label: 'Settings' },
  { id: 'health', label: 'Health Dashboard' },
] as const

export default function AdminMenu({ onClose }: AdminMenuProps) {
  const { activePanel, setActivePanel } = useEditorStore()

  const openPanel = (id: string) => {
    setActivePanel(id)
    onClose()
  }

  return (
    <>
      <div className="admin-menu">
        {PANELS.map((panel) => (
          <button key={panel.id} type="button" onClick={() => openPanel(panel.id)}>
            {panel.label}
          </button>
        ))}
      </div>
      <ResumeApproval isOpen={activePanel === 'resume'} onClose={() => setActivePanel(null)} />
      <RepoSelector isOpen={activePanel === 'github'} onClose={() => setActivePanel(null)} />
      <MediaLibrary isOpen={activePanel === 'media'} onClose={() => setActivePanel(null)} />
      <VersionHistory isOpen={activePanel === 'versions'} onClose={() => setActivePanel(null)} />
      <ActivityCenter isOpen={activePanel === 'audit'} onClose={() => setActivePanel(null)} />
      <AnalyticsDashboard isOpen={activePanel === 'analytics'} onClose={() => setActivePanel(null)} />
      <ThemeBuilder isOpen={activePanel === 'theme'} onClose={() => setActivePanel(null)} />
      <SettingsPanel isOpen={activePanel === 'settings'} onClose={() => setActivePanel(null)} />
      <HealthDashboard isOpen={activePanel === 'health'} onClose={() => setActivePanel(null)} />
    </>
  )
}
