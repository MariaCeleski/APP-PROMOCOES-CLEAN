import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'
import { signOut as authSignOut, getSession } from '@/services/auth'
import type { AuthContextType, AuthUser, UserProfile, UserRole } from '@/types/auth'

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const role: UserRole | null = profile?.role ?? null
  const isEstablishment = role === 'establishment'

  // ─── Carregar sessão ao montar ──────────────────────────────────────────

  useEffect(() => {
    async function loadSession() {
      try {
        const { token, user: storedUser } = getSession()

        if (!token || !storedUser) {
          setLoading(false)
          return
        }

        setUser(storedUser)

        // Buscar perfil atualizado do servidor
        const { data } = await api.get<{ profile: UserProfile }>('/api/auth/me')
        setProfile(data.profile)
      } catch {
        // Token inválido ou expirado — limpar estado
        authSignOut()
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  // ─── signOut ────────────────────────────────────────────────────────────

  const signOut = useCallback(() => {
    authSignOut()
    setUser(null)
    setProfile(null)
    navigate('/')
  }, [navigate])

  // ─── Método para atualizar estado após login/registro ───────────────────

  const value: AuthContextType & {
    setAuthData: (user: AuthUser, profile: UserProfile) => void
  } = {
    user,
    profile,
    role,
    loading,
    isEstablishment,
    signOut,
    setAuthData: (newUser: AuthUser, newProfile: UserProfile) => {
      setUser(newUser)
      setProfile(newProfile)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }
  return context as AuthContextType & {
    setAuthData: (user: AuthUser, profile: UserProfile) => void
  }
}
