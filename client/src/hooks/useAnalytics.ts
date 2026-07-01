import { useEffect } from 'react'
import { trackPageview, trackEvent } from '@/api/analytics'
import type { AnalyticsEventType } from '@/types/analytics'

export function useAnalytics() {
  useEffect(() => {
    void trackPageview(window.location.pathname)
  }, [])

  const track = (event: AnalyticsEventType, metadata?: Record<string, unknown>) => {
    void trackEvent(event, metadata)
  }

  return { track }
}

export function useTrackClick(event: AnalyticsEventType) {
  return () => {
    void trackEvent(event)
  }
}
