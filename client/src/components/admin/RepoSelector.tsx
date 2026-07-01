import { SlidePanel } from '@/components/shared/Modal'
import { useGitHubRepos, useSyncGitHub, useUpdateRepoSettings } from '@/api/github'
import Loader from '@/components/shared/Loader'
import { useToast } from '@/components/shared/Toast'
import ProjectCardAdmin from './ProjectCardAdmin'

interface RepoSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export default function RepoSelector({ isOpen, onClose }: RepoSelectorProps) {
  const { data: repos, isLoading, refetch } = useGitHubRepos()
  const syncGitHub = useSyncGitHub()
  const updateSettings = useUpdateRepoSettings()
  const { showToast } = useToast()

  const handleSync = async () => {
    try {
      await syncGitHub.mutateAsync()
      await refetch()
      showToast('GitHub sync started', 'success')
    } catch {
      showToast('GitHub sync failed', 'error')
    }
  }

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="GitHub Sync">
      <div className="admin-panel">
        <button type="button" className="btn btn__primary" onClick={() => { void handleSync() }} disabled={syncGitHub.isPending}>
          Sync GitHub
        </button>
        {isLoading ? <Loader /> : (
          <div className="admin-grid" style={{ marginTop: 16 }}>
            {(repos ?? []).map((repo) => (
              <ProjectCardAdmin
                key={repo.repoName}
                repo={repo}
                onTogglePublish={(published) => {
                  void updateSettings.mutateAsync({ repoName: repo.repoName, settings: { published } })
                }}
              />
            ))}
            {(repos ?? []).length === 0 && <p className="text__muted">No repos synced yet.</p>}
          </div>
        )}
      </div>
    </SlidePanel>
  )
}
