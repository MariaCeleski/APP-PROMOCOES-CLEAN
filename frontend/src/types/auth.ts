export type UserRole = 'user' | 'establishment'

export interface UserProfile {
  id: string
  name: string
  email: string
  cpf: string
  role: UserRole
  created_at: string
}

export interface AuthUser {
  id: string
  email: string
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at?: number
}

export interface AuthContextType {
  user: AuthUser | null
  profile: UserProfile | null
  role: UserRole | null
  loading: boolean
  isEstablishment: boolean
  signOut: () => void
}

export interface LoginResponse {
  user: AuthUser
  session: AuthSession
  profile: UserProfile
}

export interface RegisterPayload {
  name: string
  email: string
  cpf: string
  password: string
  role: UserRole
}
