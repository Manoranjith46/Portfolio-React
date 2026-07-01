import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { MediaItem } from '@/types/settings'

export async function uploadMedia(file: File, folder = 'media-library'): Promise<MediaItem> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)
  const { data } = await apiClient.post<ApiResponse<MediaItem>>('/admin/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function listMedia(): Promise<MediaItem[]> {
  const { data } = await apiClient.get<ApiResponse<MediaItem[]>>('/admin/media')
  return data.data
}

export async function deleteMedia(id: string): Promise<void> {
  await apiClient.delete(`/admin/media/${id}`)
}

export function useMedia() {
  return useQuery({
    queryKey: QUERY_KEYS.media,
    queryFn: listMedia,
    enabled: false,
    retry: false,
  })
}

export function useUploadMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) => uploadMedia(file, folder),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.media }),
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.media }),
  })
}
