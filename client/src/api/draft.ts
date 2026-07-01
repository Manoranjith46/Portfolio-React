import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { PortfolioDraft, DraftChanges } from '@/types/editor'

export async function getDraft(): Promise<PortfolioDraft | null> {
  const { data } = await apiClient.get<ApiResponse<PortfolioDraft | null>>('/admin/draft')
  return data.data
}

export async function saveDraft(changes: DraftChanges): Promise<PortfolioDraft> {
  const { data } = await apiClient.patch<ApiResponse<PortfolioDraft>>('/admin/draft', { changes })
  return data.data
}

export async function publishDraft(): Promise<void> {
  await apiClient.post('/admin/draft/publish')
}

export function useDraft() {
  return useQuery({
    queryKey: QUERY_KEYS.draft,
    queryFn: getDraft,
    enabled: false,
    retry: false,
  })
}

export function useSaveDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveDraft,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.draft }),
  })
}

export function usePublishDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: publishDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.draft })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile })
    },
  })
}
