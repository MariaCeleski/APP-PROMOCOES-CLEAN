import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { registerSchema, type RegisterFormData } from '@/utils/validators'
import { signUp } from '@/services/auth'
import { useAuth } from '@/contexts/AuthContext'
import { formatCPF, cleanCPF } from '@/utils/formatters'

export default function Register() {
  const navigate = useNavigate()
  const { setAuthData } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'user' },
  })

  const cpfValue = watch('cpf', '')
  const roleValue = watch('role', 'user')

  function handleCpfChange(value: string) {
    const digits = cleanCPF(value)
    setValue('cpf', formatCPF(digits), { shouldValidate: false })
  }

  async function onSubmit(data: RegisterFormData) {
    try {
      setAuthError(null)
      const result = await signUp(
        data.name,
        data.email,
        cleanCPF(data.cpf),
        data.password,
        data.role,
      )
      setAuthData(result.user, result.profile)
      navigate('/')
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Erro ao criar conta')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            🔥 <span className="text-primary">App</span>Promoções
          </h1>
          <p className="text-muted text-sm mt-2">Crie sua conta</p>
        </div>

        <Card className="p-6">
          {/* Erro de autenticação */}
          {authError && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-sm mb-4" role="alert">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {/* Tipo de conta */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Tipo de conta</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'user', label: '👤 Consumidor' },
                  { value: 'establishment', label: '🏪 Estabelecimento' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('role', opt.value as 'user' | 'establishment')}
                    className={[
                      'py-2.5 px-3 rounded-lg text-sm font-medium border transition-all',
                      roleValue === opt.value
                        ? 'bg-primary border-primary text-white'
                        : 'bg-surface border-border text-muted hover:text-foreground hover:border-slate-400',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-xs text-danger mt-1">{errors.role.message}</p>
              )}
            </div>

            <Input
              label="Nome completo"
              placeholder="Seu nome"
              error={errors.name?.message}
              {...register('name')}
              onChange={(v) => setValue('name', v)}
            />

            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              autoComplete="email"
              {...register('email')}
              onChange={(v) => setValue('email', v)}
            />

            <Input
              label="CPF"
              placeholder="000.000.000-00"
              value={cpfValue}
              onChange={handleCpfChange}
              error={errors.cpf?.message}
              inputMode="numeric"
              maxLength={14}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              error={errors.password?.message}
              autoComplete="new-password"
              {...register('password')}
              onChange={(v) => setValue('password', v)}
            />

            <Input
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              {...register('confirmPassword')}
              onChange={(v) => setValue('confirmPassword', v)}
            />

            <Button
              type="submit"
              title="Criar conta"
              loading={isSubmitting}
              className="w-full mt-2"
            />
          </form>
        </Card>

        <p className="text-center text-muted text-sm mt-4">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
