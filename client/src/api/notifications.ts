import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { Notification } from '@/types/notification'

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await apiClient.get<ApiResponse<Notification[]>>('/admin/notifications')
  return data.data
}

export async function markRead(id: string): Promise<void> {
  await apiClient.patch(`/admin/notifications/${id}/read`)
}

export async function markAllRead(): Promise<void> {
  await apiClient.post('/admin/notifications/read-all')
}

export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: getNotifications,
    enabled: false,
    retry: false,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications }),
  })
}
