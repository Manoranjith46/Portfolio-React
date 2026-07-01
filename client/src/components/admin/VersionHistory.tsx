import { useState } from 'react'
import { SlidePanel } from '@/components/shared/Modal'
import { useVersions, useRollbackVersion } from '@/api/versions'
import Loader from '@/components/shared/Loader'
import { useToast } from '@/components/shared/Toast'
import DiffViewer from './DiffViewer'
import { formatDateTime } from '@/utils/formatters'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface VersionHistoryProps {
  isOpen: boolean
  onClose: () => void
}

export default function VersionHistory({ isOpen, onClose }: VersionHistoryProps) {
  const { data: versions, isLoading } = useVersions()
  const rollback = useRollbackVersion()
  const { showToast } = useToast()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmRollback, setConfirmRollback] = useState<string | null>(null)

  const handleRollback = async (id: string) => {
    try {
      await rollback.mutateAsync(id)
      showToast('Rollback draft created — preview and publish', 'success')
      onClose()
    } catch {
      showToast('Rollback failed', 'error')
    }
  }

  return (
    <>
      <SlidePanel isOpen={isOpen} onClose={onClose} title="Version History">
        <div className="admin-panel">
          {isLoading ? <Loader /> : (
            (versions ?? []).map((v) => (
              <div key={v.id} className="activity-item">
                <div style={{ flex: 1 }}>
                  <strong>v{v.number}</strong> — {v.label}
                  <p className="text__muted" style={{ fontSize: 12 }}>{formatDateTime(v.createdAt)}</p>
                </div>
                <button type="button" className="btn" style={{ fontSize: 12 }} onClick={() => setSelectedId(v.id)}>
                  Preview
                </button>
                <button type="button" className="btn" style={{ fontSize: 12, marginLeft: 4 }} onClick={() => setConfirmRollback(v.id)}>
                  Rollback
                </button>
              </div>
            ))
          )}
          {(versions ?? []).length === 0 && !isLoading && (
            <p className="text__muted">No versions yet.</p>
          )}
        </div>
      </SlidePanel>
      <DiffViewer versionId={selectedId} onClose={() => setSelectedId(null)} />
      <ConfirmDialog
        isOpen={!!confirmRollback}
        onClose={() => setConfirmRollback(null)}
        onConfirm={() => { if (confirmRollback) void handleRollback(confirmRollback) }}
        title="Rollback Version"
        message="This will create a draft from the selected version. You must preview and publish to apply."
        confirmLabel="Rollback"
      />
    </>
  )
}
