import apiClient from './client'
import type { ApiResponse } from '@/types/api'
import type { LoginCredentials, LoginResponse } from '@/types/auth'

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
  return data.data
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function refresh(): Promise<{ accessToken: string }> {
  const { data } = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh')
  return data.data
}

export function getGoogleAuthUrl(): string {
  return `${apiClient.defaults.baseURL}/auth/google`
}

export function getGitHubAuthUrl(): string {
  return `${apiClient.defaults.baseURL}/auth/github`
}
