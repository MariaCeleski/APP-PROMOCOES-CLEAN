import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { loginSchema, type LoginFormData } from '@/utils/validators'
import { signIn } from '@/services/auth'
import { useAuth } from '@/contexts/AuthContext'
import { formatCPF } from '@/utils/formatters'

export default function Login() {
  const navigate = useNavigate()
  const { setAuthData } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)

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

  // Aplicar máscara de CPF se for numérico
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
      setAuthError(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            🔥 <span className="text-primary">App</span>Promoções
          </h1>
          <p className="text-muted text-sm mt-2">Acesse sua conta</p>
        </div>

        <Card className="p-6">
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
