import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { SiteSettings, HealthDashboardData, ThemeConfig } from '@/types/settings'

export async function getSettings(): Promise<SiteSettings> {
  const { data } = await apiClient.get<ApiResponse<SiteSettings>>('/admin/settings')
  return data.data
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const { data } = await apiClient.patch<ApiResponse<SiteSettings>>('/admin/settings', updates)
  return data.data
}

export async function getHealth(): Promise<HealthDashboardData> {
  const { data } = await apiClient.get<ApiResponse<HealthDashboardData>>('/admin/health')
  return data.data
}

export async function updateTheme(theme: ThemeConfig): Promise<ThemeConfig> {
  const { data } = await apiClient.patch<ApiResponse<ThemeConfig>>('/admin/settings/theme', theme)
  return data.data
}

export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: getSettings,
    enabled: false,
    retry: false,
  })
}

export function useHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: getHealth,
    enabled: false,
    retry: false,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings }),
  })
}

export function useUpdateTheme() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTheme,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.theme }),
  })
}
