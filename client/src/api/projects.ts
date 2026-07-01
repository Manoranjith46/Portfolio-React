import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { FALLBACK_PROJECTS } from '@/constants/fallbackData'
import type { ApiResponse } from '@/types/api'
import type { Project, ProjectAdmin } from '@/types/project'

export async function getProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<ApiResponse<Project[]>>('/projects')
  return data.data
}

export async function updateProject(id: string, updates: Partial<ProjectAdmin>): Promise<Project> {
  const { data } = await apiClient.patch<ApiResponse<Project>>(`/admin/projects/${id}`, updates)
  return data.data
}

export async function reorderProjects(order: string[]): Promise<void> {
  await apiClient.put('/admin/projects/reorder', { order })
}

export function useProjects() {
  return useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: getProjects,
    initialData: FALLBACK_PROJECTS,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ProjectAdmin> }) =>
      updateProject(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects }),
  })
}
