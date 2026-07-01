import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { ProjectGitHub } from '@/types/project'

export async function syncGitHub(): Promise<{ jobId: string }> {
  const { data } = await apiClient.post<ApiResponse<{ jobId: string }>>('/admin/github/sync')
  return data.data
}

export async function getRepos(): Promise<ProjectGitHub[]> {
  const { data } = await apiClient.get<ApiResponse<ProjectGitHub[]>>('/admin/github/repos')
  return data.data
}

export async function updateRepoSettings(
  repoName: string,
  settings: { published?: boolean; hidden?: boolean; pinned?: boolean; featured?: boolean },
): Promise<void> {
  await apiClient.patch(`/admin/github/repos/${repoName}`, settings)
}

export function useGitHubRepos() {
  return useQuery({
    queryKey: QUERY_KEYS.githubRepos,
    queryFn: getRepos,
    enabled: false,
    retry: false,
  })
}

export function useSyncGitHub() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: syncGitHub,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.githubRepos }),
  })
}

export function useUpdateRepoSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ repoName, settings }: { repoName: string; settings: Parameters<typeof updateRepoSettings>[1] }) =>
      updateRepoSettings(repoName, settings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.githubRepos }),
  })
}
