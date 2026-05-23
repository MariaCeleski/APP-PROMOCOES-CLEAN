import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { loginSchema, type LoginFormData } from '@/utils/validators'
import { signIn, resetPassword } from '@/services/auth'
import { useAuth } from '@/contexts/AuthContext'
import { formatCPF } from '@/utils/formatters'

export default function Login() {
  const navigate = useNavigate()
  const { setAuthData } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [resetError, setResetError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const identifierValue = watch('identifier', '')

  function handleIdentifierChange(value: string) {
    const onlyDigits = value.replace(/\D/g, '')
    if (onlyDigits.length <= 11 && /^\d+$/.test(value.replace(/[.\-]/g, ''))) {
      setValue('identifier', formatCPF(onlyDigits), { shouldValidate: false })
    } else {
      setValue('identifier', value, { shouldValidate: false })
    }
  }

  async function onSubmit(data: LoginFormData) {
    try {
      setAuthError(null)
      const result = await signIn(data.identifier, data.password)
      setAuthData(result.user, result.profile)
      navigate('/')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao fazer login'
      setAuthError(msg)
      // Se erro de credenciais, mostrar opção de recuperar senha
      if (msg.includes('incorretos') || msg.includes('inválid')) {
        setShowReset(true)
      }
    }
  }

  async function handleResetPassword() {
    if (!resetEmail || !resetEmail.includes('@')) {
      setResetError('Informe um email válido')
      return
    }
    try {
      setResetStatus('loading')
      setResetError(null)
      await resetPassword(resetEmail)
      setResetStatus('sent')
    } catch (err) {
      setResetStatus('error')
      setResetError(err instanceof Error ? err.message : 'Erro ao enviar email')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-3 sm:px-4 py-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            🔥 <span className="text-primary">App</span>Promoções
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-2">Acesse sua conta</p>
        </div>

        <Card className="p-4 sm:p-6">
          {/* Erro de autenticação */}
          {authError && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-sm mb-4" role="alert">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email ou CPF"
              placeholder="seu@email.com ou 000.000.000-00"
              value={identifierValue}
              onChange={handleIdentifierChange}
              error={errors.identifier?.message}
              autoComplete="username"
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Sua senha"
              error={errors.password?.message}
              autoComplete="current-password"
              {...register('password')}
              onChange={(v) => setValue('password', v)}
            />

            <Button
              type="submit"
              title="Entrar"
              loading={isSubmitting}
              className="w-full mt-2"
            />
          </form>

          {/* Esqueceu a senha */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowReset(!showReset)}
              className="text-xs sm:text-sm text-primary hover:underline"
            >
              Esqueceu sua senha?
            </button>
          </div>

          {/* Formulário de recuperação */}
          {showReset && (
            <div className="mt-4 pt-4 border-t border-border">
              {resetStatus === 'sent' ? (
                <div className="bg-success/10 border border-success/30 text-success rounded-lg p-3 text-sm text-center">
                  ✅ Email enviado! Verifique sua caixa de entrada para redefinir a senha.
                </div>
              ) : (
                <>
                  <p className="text-muted text-xs sm:text-sm mb-3">
                    Informe seu email cadastrado para receber o link de recuperação:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="flex-1 px-3 py-2 rounded-lg text-sm text-foreground bg-surface border border-border placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
                    />
                    <Button
                      type="button"
                      title="Enviar"
                      loading={resetStatus === 'loading'}
                      onClick={handleResetPassword}
                      className="text-xs px-3"
                    />
                  </div>
                  {resetError && (
                    <p className="text-xs text-danger mt-2">{resetError}</p>
                  )}
                </>
              )}
            </div>
          )}
        </Card>

        <p className="text-center text-muted text-sm mt-4">
          Não tem conta?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
