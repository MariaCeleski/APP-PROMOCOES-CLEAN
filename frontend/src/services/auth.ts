import api, { TOKEN_KEY } from './api'
import type { LoginResponse, RegisterPayload, UserRole } from '@/types/auth'

const USER_KEY = '@app-promocoes:user'

// ─── Error mapping ───────────────────────────────────────────────────────────

const ERROR_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: 'Usuário não encontrado',
  WRONG_PASSWORD: 'Email/CPF ou senha incorretos',
  EMAIL_ALREADY_EXISTS: 'Este email já está cadastrado',
  CPF_ALREADY_EXISTS: 'Este CPF já está cadastrado',
  CPF_NOT_FOUND: 'CPF não encontrado',
  EMAIL_NOT_CONFIRMED: 'Confirme seu email antes de entrar',
  TOO_MANY_REQUESTS: 'Muitas tentativas. Aguarde alguns minutos',
  MISSING_FIELDS: 'Preencha todos os campos obrigatórios',
}

function getErrorMessage(error: unknown): string {
  if (axios_isAxiosError(error)) {
    const code = error.response?.data?.code as string
    const serverMessage = error.response?.data?.error as string
    return ERROR_MESSAGES[code] || serverMessage || 'Erro inesperado. Tente novamente'
  }
  return 'Erro de conexão. Verifique sua internet'
}

function axios_isAxiosError(error: unknown): error is { response?: { data?: { code?: string; error?: string }; status?: number } } {
  return typeof error === 'object' && error !== null && 'response' in error
}

// ─── signIn ──────────────────────────────────────────────────────────────────

export async function signIn(
  identifier: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const { data } = await api.post<LoginResponse>('/api/auth/login', {
      identifier,
      password,
    })

    // Persistir token e user no localStorage
    localStorage.setItem(TOKEN_KEY, data.session.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))

    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ─── signUp ──────────────────────────────────────────────────────────────────

export async function signUp(
  name: string,
  email: string,
  cpf: string,
  password: string,
  role: UserRole,
): Promise<LoginResponse> {
  try {
    const payload: RegisterPayload = { name, email, cpf, password, role }
    const { data } = await api.post<LoginResponse>('/api/auth/register', payload)

    localStorage.setItem(TOKEN_KEY, data.session.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))

    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

// ─── signOut ─────────────────────────────────────────────────────────────────

export function signOut(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// ─── getSession ──────────────────────────────────────────────────────────────

export function getSession(): { token: string | null; user: { id: string; email: string } | null } {
  const token = localStorage.getItem(TOKEN_KEY)
  const userRaw = localStorage.getItem(USER_KEY)
  const user = userRaw ? JSON.parse(userRaw) : null
  return { token, user }
}
