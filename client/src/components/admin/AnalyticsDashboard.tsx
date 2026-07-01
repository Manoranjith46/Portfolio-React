import { useState } from 'react'
import { SlidePanel } from '@/components/shared/Modal'
import { useAnalytics } from '@/api/analytics'
import Loader from '@/components/shared/Loader'
import type { AnalyticsRange } from '@/types/analytics'

interface AnalyticsDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export default function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [range, setRange] = useState<AnalyticsRange>('30d')
  const { data, isLoading, refetch } = useAnalytics(range)

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Analytics Dashboard">
      <div className="admin-panel">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['7d', '30d', '90d'] as AnalyticsRange[]).map((r) => (
            <button
              key={r}
              type="button"
              className={`btn ${range === r ? 'btn__primary' : ''}`}
              onClick={() => { setRange(r); void refetch() }}
            >
              {r}
            </button>
          ))}
        </div>
        {isLoading ? <Loader /> : data ? (
          <>
            <div className="analytics-grid">
              <div className="metric-card">
                <div className="value">{data.overview.totalVisitors}</div>
                <div className="label">Total Visitors</div>
              </div>
              <div className="metric-card">
                <div className="value">{data.overview.uniqueVisitors}</div>
                <div className="label">Unique Visitors</div>
              </div>
              <div className="metric-card">
                <div className="value">{data.engagement.contactSubmissions}</div>
                <div className="label">Contact Submissions</div>
              </div>
              <div className="metric-card">
                <div className="value">{data.engagement.githubClicks}</div>
                <div className="label">GitHub Clicks</div>
              </div>
            </div>
            <h4 style={{ marginBottom: 8 }}>Top Projects</h4>
            {data.projects.map((p) => (
              <div key={p.projectId} className="activity-item">
                <span>{p.projectName}</span>
                <span className="text__muted">{p.views} views · {p.clicks} clicks</span>
              </div>
            ))}
          </>
        ) : (
          <p className="text__muted">No analytics data available.</p>
        )}
      </div>
    </SlidePanel>
  )
}
