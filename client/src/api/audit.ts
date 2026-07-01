import { useQuery } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { AuditLog } from '@/types/audit'

export async function getAuditLogs(limit = 200): Promise<AuditLog[]> {
  const { data } = await apiClient.get<ApiResponse<AuditLog[]>>(`/admin/audit?limit=${limit}`)
  return data.data
}

export function useAuditLogs() {
  return useQuery({
    queryKey: QUERY_KEYS.audit,
    queryFn: () => getAuditLogs(),
    enabled: false,
    retry: false,
  })
}
