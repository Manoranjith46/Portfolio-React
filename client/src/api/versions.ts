import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { Version } from '@/types/version'

export async function getVersions(): Promise<Version[]> {
  const { data } = await apiClient.get<ApiResponse<Version[]>>('/admin/versions')
  return data.data
}

export async function rollbackVersion(versionId: string): Promise<void> {
  await apiClient.post(`/admin/versions/${versionId}/rollback`)
}

export function useVersions() {
  return useQuery({
    queryKey: QUERY_KEYS.versions,
    queryFn: getVersions,
    enabled: false,
    retry: false,
  })
}

export function useRollbackVersion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rollbackVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.draft })
    },
  })
}
