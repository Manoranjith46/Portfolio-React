import type { ResumeDiffResult } from '@/types/resume'

interface ResumeDiffProps {
  diff: ResumeDiffResult
  onApprove: (fields: string[]) => void
}

export default function ResumeDiff({ diff, onApprove }: ResumeDiffProps) {
  const allFields = [
    ...diff.added.map((d) => d.field),
    ...diff.changed.map((d) => d.field),
    ...diff.removed.map((d) => d.field),
  ]

  return (
    <div>
      <h4 style={{ marginBottom: 12 }}>Review Changes</h4>
      {diff.added.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <h5>Added</h5>
          {diff.added.map((entry) => (
            <div key={entry.field} className="diff-entry diff-added">
              <strong>{entry.field}</strong>
              <p>{String(entry.newValue ?? '')}</p>
            </div>
          ))}
        </section>
      )}
      {diff.changed.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <h5>Changed</h5>
          {diff.changed.map((entry) => (
            <div key={entry.field} className="diff-entry diff-changed">
              <strong>{entry.field}</strong>
              <p><s>{String(entry.oldValue ?? '')}</s> → {String(entry.newValue ?? '')}</p>
            </div>
          ))}
        </section>
      )}
      {diff.removed.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <h5>Removed</h5>
          {diff.removed.map((entry) => (
            <div key={entry.field} className="diff-entry diff-removed">
              <strong>{entry.field}</strong>
              <p>{String(entry.oldValue ?? '')}</p>
            </div>
          ))}
        </section>
      )}
      {allFields.length === 0 && <p className="text__muted">No differences found.</p>}
      {allFields.length > 0 && (
        <button type="button" className="btn btn__primary" onClick={() => onApprove(allFields)}>
          Approve All Changes
        </button>
      )}
    </div>
  )
}
