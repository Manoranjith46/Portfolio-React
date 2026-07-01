import { useQuery } from '@tanstack/react-query'
import apiClient from './client'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { FALLBACK_PROFILE, FALLBACK_SKILLS, FALLBACK_EDUCATION, FALLBACK_EXPERIENCE } from '@/constants/fallbackData'
import type { ApiResponse } from '@/types/api'
import type { PortfolioProfile, Skill, Experience, Education } from '@/types/portfolio'

export async function getProfile(): Promise<PortfolioProfile> {
  const { data } = await apiClient.get<ApiResponse<PortfolioProfile>>('/profile')
  return data.data
}

export async function getSkills(): Promise<Skill[]> {
  const { data } = await apiClient.get<ApiResponse<Skill[]>>('/skills')
  return data.data
}

export async function getExperience(): Promise<Experience[]> {
  const { data } = await apiClient.get<ApiResponse<Experience[]>>('/experience')
  return data.data
}

export async function getEducation(): Promise<Education[]> {
  const { data } = await apiClient.get<ApiResponse<Education[]>>('/education')
  return data.data
}

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: getProfile,
    initialData: FALLBACK_PROFILE,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useSkills() {
  return useQuery({
    queryKey: QUERY_KEYS.skills,
    queryFn: getSkills,
    initialData: FALLBACK_SKILLS,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useExperience() {
  return useQuery({
    queryKey: QUERY_KEYS.experience,
    queryFn: getExperience,
    initialData: FALLBACK_EXPERIENCE,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useEducation() {
  return useQuery({
    queryKey: QUERY_KEYS.education,
    queryFn: getEducation,
    initialData: FALLBACK_EDUCATION,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
