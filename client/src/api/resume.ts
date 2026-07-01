import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { ResumeData, ResumeDiffResult, ResumeProcessingStatus } from '@/types/resume'

export async function uploadResume(file: File): Promise<{ jobId: string }> {
  const formData = new FormData()
  formData.append('resume', file)
  const { data } = await apiClient.post<ApiResponse<{ jobId: string }>>('/admin/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export async function getResumeDiff(): Promise<ResumeDiffResult> {
  const { data } = await apiClient.get<ApiResponse<ResumeDiffResult>>('/admin/resume/diff')
  return data.data
}

export async function approveResume(fields: string[]): Promise<void> {
  await apiClient.post('/admin/resume/approve', { fields })
}

export async function getResumeStatus(jobId: string): Promise<{ status: ResumeProcessingStatus }> {
  const { data } = await apiClient.get<ApiResponse<{ status: ResumeProcessingStatus }>>(
    `/admin/resume/status/${jobId}`,
  )
  return data.data
}

export function useResumeDiff() {
  return useQuery({
    queryKey: QUERY_KEYS.resumeDiff,
    queryFn: getResumeDiff,
    enabled: false,
    retry: false,
  })
}

export function useUploadResume() {
  return useMutation({ mutationFn: uploadResume })
}

export function useApproveResume() {
  return useMutation({ mutationFn: approveResume })
}

export type { ResumeData }
