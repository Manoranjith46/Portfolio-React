export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  avatarUrl?: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
}
