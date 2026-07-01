import { SlidePanel } from '@/components/shared/Modal'
import { useHealth } from '@/api/settings'
import Loader from '@/components/shared/Loader'

interface HealthDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export default function HealthDashboard({ isOpen, onClose }: HealthDashboardProps) {
  const { data, isLoading, refetch } = useHealth()

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Health Dashboard">
      <div className="admin-panel">
        <button type="button" className="btn btn__primary" style={{ marginBottom: 16 }} onClick={() => { void refetch() }}>
          Refresh Status
        </button>
        {isLoading ? <Loader /> : (
          <div className="health-grid">
            {(data?.services ?? []).map((service) => (
              <div key={service.name} className={`health-card ${service.status}`}>
                <div>
                  <strong>{service.name}</strong>
                  <p className="text__muted" style={{ fontSize: 12 }}>
                    {service.status === 'ok' ? '✓ Connected' : '✗ Unavailable'}
                    {service.latencyMs !== undefined && ` · ${service.latencyMs}ms`}
                  </p>
                </div>
              </div>
            ))}
            {(data?.services ?? []).length === 0 && (
              <p className="text__muted">Run health check to see service status.</p>
            )}
          </div>
        )}
      </div>
    </SlidePanel>
  )
}
