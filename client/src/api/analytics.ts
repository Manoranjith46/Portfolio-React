import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { AnalyticsData, AnalyticsRange, AnalyticsEventType } from '@/types/analytics'

export async function getAnalytics(range: AnalyticsRange = '30d'): Promise<AnalyticsData> {
  const { data } = await apiClient.get<ApiResponse<AnalyticsData>>(`/admin/analytics?range=${range}`)
  return data.data
}

export async function trackPageview(path: string): Promise<void> {
  await apiClient.post('/analytics/pageview', { path })
}

export async function trackEvent(event: AnalyticsEventType, metadata?: Record<string, unknown>): Promise<void> {
  await apiClient.post('/analytics/event', { event, metadata })
}

export function useAnalytics(range: AnalyticsRange = '30d') {
  return useQuery({
    queryKey: QUERY_KEYS.analytics(range),
    queryFn: () => getAnalytics(range),
    enabled: false,
    retry: false,
  })
}

export function useTrackEvent() {
  return useMutation({ mutationFn: ({ event, metadata }: { event: AnalyticsEventType; metadata?: Record<string, unknown> }) => trackEvent(event, metadata) })
}
