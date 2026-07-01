export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    version?: string
    cachedAt?: string
  }
}

export interface ApiError {
  success: false
  code: string
  message: string
  details?: Record<string, unknown>
}
