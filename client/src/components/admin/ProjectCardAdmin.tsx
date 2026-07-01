import type { ProjectGitHub } from '@/types/project'

interface ProjectCardAdminProps {
  repo: ProjectGitHub
  onTogglePublish: (published: boolean) => void
}

export default function ProjectCardAdmin({ repo, onTogglePublish }: ProjectCardAdminProps) {
  return (
    <div className="admin-card">
      <h4 style={{ fontSize: 14, marginBottom: 8 }}>{repo.repoName}</h4>
      <p className="text__muted" style={{ fontSize: 12, marginBottom: 8 }}>
        {repo.description.slice(0, 80)}...
      </p>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <button type="button" className="btn" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => onTogglePublish(true)}>
          Publish
        </button>
        <button type="button" className="btn" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => onTogglePublish(false)}>
          Hide
        </button>
      </div>
    </div>
  )
}
