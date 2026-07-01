import { useState } from 'react'
import { SlidePanel } from '@/components/shared/Modal'
import { useAuditLogs } from '@/api/audit'
import Loader from '@/components/shared/Loader'
import { formatRelativeTime } from '@/utils/formatters'
import type { AuditSource } from '@/types/audit'

interface ActivityCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function ActivityCenter({ isOpen, onClose }: ActivityCenterProps) {
  const { data: logs, isLoading } = useAuditLogs()
  const [sourceFilter, setSourceFilter] = useState<AuditSource | 'all'>('all')

  const filtered = (logs ?? []).filter(
    (log) => sourceFilter === 'all' || log.source === sourceFilter,
  )

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Activity Center">
      <div className="admin-panel">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {(['all', 'admin', 'system', 'github', 'ai'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`btn ${sourceFilter === s ? 'btn__primary' : ''}`}
              style={{ fontSize: 12 }}
              onClick={() => setSourceFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        {isLoading ? <Loader /> : filtered.map((log) => (
          <div key={log.id} className="activity-item">
            <div>
              <strong>{log.action}</strong>
              <p className="text__muted" style={{ fontSize: 12 }}>
                {log.source} · {formatRelativeTime(log.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !isLoading && <p className="text__muted">No activity yet.</p>}
      </div>
    </SlidePanel>
  )
}
