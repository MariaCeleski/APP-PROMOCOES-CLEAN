import { Router, Request, Response, NextFunction } from 'express'
import { supabase, supabaseAdmin } from '../services/supabase'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapAuthError(message: string): { code: string; status: number; friendly: string } {
  if (message.includes('Invalid login credentials')) {
    return { code: 'WRONG_PASSWORD', status: 401, friendly: 'Email/CPF ou senha incorretos' }
  }
  if (message.includes('Email not confirmed')) {
    return { code: 'EMAIL_NOT_CONFIRMED', status: 401, friendly: 'Confirme seu email antes de entrar' }
  }
  if (message.includes('Too many requests')) {
    return { code: 'TOO_MANY_REQUESTS', status: 429, friendly: 'Muitas tentativas. Aguarde alguns minutos' }
  }
  if (message.includes('User already registered') || message.includes('already been registered')) {
    return { code: 'EMAIL_ALREADY_EXISTS', status: 409, friendly: 'Este email já está cadastrado' }
  }
  return { code: 'AUTH_ERROR', status: 500, friendly: 'Erro de autenticação. Tente novamente' }
}

// ─── POST /api/auth/login ────────────────────────────────────────────────────

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      res.status(400).json({ error: 'Informe o email/CPF e a senha', code: 'MISSING_FIELDS' })
      return
    }

    let email = identifier

    // Se for CPF (apenas dígitos, 11 chars), buscar o email na tabela profiles
    const cleanIdentifier = identifier.replace(/\D/g, '')
    if (cleanIdentifier.length === 11) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('cpf', cleanIdentifier)
        .single()

      if (profileError || !profile) {
        res.status(404).json({ error: 'CPF não encontrado', code: 'CPF_NOT_FOUND' })
        return
      }

      email = profile.email
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      const mapped = mapAuthError(error.message)
      res.status(mapped.status).json({ error: mapped.friendly, code: mapped.code })
      return
    }

    if (!data.user) {
      res.status(404).json({ error: 'Usuário não encontrado', code: 'USER_NOT_FOUND' })
      return
    }

    // Buscar perfil completo
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    res.json({
      user: { id: data.user.id, email: data.user.email },
      session: data.session,
      profile,
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/auth/register ─────────────────────────────────────────────────

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, cpf, password, role } = req.body

    if (!name || !email || !cpf || !password || !role) {
      res.status(400).json({ error: 'Todos os campos são obrigatórios', code: 'MISSING_FIELDS' })
      return
    }

    const cleanCpf = cpf.replace(/\D/g, '')

    // Verificar se CPF já existe
    const { data: existingCpf } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('cpf', cleanCpf)
      .single()

    if (existingCpf) {
      res.status(409).json({ error: 'Este CPF já está cadastrado', code: 'CPF_ALREADY_EXISTS' })
      return
    }

    // Criar usuário no Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // confirmar email automaticamente
    })

    if (error) {
      const mapped = mapAuthError(error.message)
      res.status(mapped.status).json({ error: mapped.friendly, code: mapped.code })
      return
    }

    if (!data.user) {
      res.status(500).json({ error: 'Erro ao criar usuário', code: 'CREATE_USER_ERROR' })
      return
    }

    // Inserir perfil na tabela profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: data.user.id,
        name,
        email,
        cpf: cleanCpf,
        role: role || 'user',
      })
      .select()
      .single()

    if (profileError) {
      // Rollback: deletar usuário criado
      await supabaseAdmin.auth.admin.deleteUser(data.user.id)
      res.status(500).json({ error: 'Erro ao criar perfil', code: 'CREATE_PROFILE_ERROR' })
      return
    }

    // Fazer login automático após registro
    const { data: sessionData } = await supabase.auth.signInWithPassword({ email, password })

    res.status(201).json({
      user: { id: data.user.id, email: data.user.email },
      session: sessionData?.session || null,
      profile,
    })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/auth/me ────────────────────────────────────────────────────────

router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user!.id)
      .single()

    if (error || !profile) {
      res.status(404).json({ error: 'Perfil não encontrado', code: 'PROFILE_NOT_FOUND' })
      return
    }

    res.json({ profile })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/auth/reset-password ───────────────────────────────────────────

router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    if (!email) {
      res.status(400).json({ error: 'Informe o email', code: 'MISSING_FIELDS' })
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
    })

    if (error) {
      // Não revelar se o email existe ou não (segurança)
      console.error('Reset password error:', error.message)
    }

    // Sempre retornar sucesso (não revelar se email existe)
    res.json({ message: 'Se o email estiver cadastrado, você receberá um link de recuperação' })
  } catch (err) {
    next(err)
  }
})

export default router
