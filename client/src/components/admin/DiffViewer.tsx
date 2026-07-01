import Modal from '@/components/shared/Modal'
import { useVersions } from '@/api/versions'
import Loader from '@/components/shared/Loader'

interface DiffViewerProps {
  versionId: string | null
  onClose: () => void
}

export default function DiffViewer({ versionId, onClose }: DiffViewerProps) {
  const { data: versions, isLoading } = useVersions()
  const version = versions?.find((v) => v.id === versionId)

  return (
    <Modal isOpen={!!versionId} onClose={onClose} title={version ? `Version ${version.number} Changes` : 'Diff Viewer'}>
      {isLoading ? <Loader /> : version ? (
        <div>
          <p style={{ marginBottom: 12 }}>{version.label}</p>
          {version.patch.map((op, i) => (
            <div key={i} className="diff-entry diff-changed">
              <code>{op.op}</code> {op.path}
              {op.value !== undefined && <pre style={{ fontSize: 12, marginTop: 4 }}>{JSON.stringify(op.value, null, 2)}</pre>}
            </div>
          ))}
          {version.patch.length === 0 && <p className="text__muted">No patch data.</p>}
        </div>
      ) : (
        <p className="text__muted">Version not found.</p>
      )}
    </Modal>
  )
}
