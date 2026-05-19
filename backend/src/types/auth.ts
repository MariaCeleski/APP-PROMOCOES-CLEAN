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
  email?: string
}

// Extensão do Request do Express para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
      profile?: UserProfile
    }
  }
}
