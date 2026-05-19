import { z } from 'zod'
import { categoryNames } from '@/constants/categories'

// ─── Helpers ────────────────────────────────────────────────────────────────

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false // todos iguais

  const calcDigit = (slice: string, factor: number): number => {
    const sum = slice
      .split('')
      .reduce((acc, d, i) => acc + parseInt(d) * (factor - i), 0)
    const remainder = (sum * 10) % 11
    return remainder >= 10 ? 0 : remainder
  }

  const first = calcDigit(digits.slice(0, 9), 10)
  if (first !== parseInt(digits[9])) return false

  const second = calcDigit(digits.slice(0, 10), 11)
  if (second !== parseInt(digits[10])) return false

  return true
}

function isCPF(value: string): boolean {
  return /^\d{11}$/.test(value.replace(/\D/g, ''))
}

// ─── Schemas ────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Informe seu email ou CPF')
    .refine(
      (val) => {
        const clean = val.replace(/\D/g, '')
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
        const isCpf = clean.length === 11
        return isEmail || isCpf
      },
      { message: 'Informe um email válido ou CPF com 11 dígitos' },
    ),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export const registerSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Informe um email válido'),
    cpf: z
      .string()
      .min(1, 'Informe o CPF')
      .refine(
        (val) => isCPF(val),
        { message: 'CPF deve ter 11 dígitos' },
      )
      .refine(
        (val) => isValidCPF(val),
        { message: 'CPF inválido' },
      ),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .refine((val) => /[A-Z]/.test(val), {
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'A senha deve conter pelo menos um número',
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: 'A senha deve conter pelo menos um caractere especial',
      }),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
    role: z.enum(['user', 'establishment'], {
      errorMap: () => ({ message: 'Selecione um tipo de conta' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const promotionSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres'),
  price: z
    .number({ invalid_type_error: 'Informe um preço válido' })
    .positive('O preço deve ser maior que zero'),
  store: z.string().min(2, 'Informe o nome do estabelecimento'),
  category: z.enum(categoryNames, {
    errorMap: () => ({ message: 'Selecione uma categoria válida' }),
  }),
  address: z.string().min(5, 'Informe o endereço').optional().or(z.literal('')),
  city: z.string().min(2, 'Informe a cidade').optional().or(z.literal('')),
  state: z
    .string()
    .length(2, 'O estado deve ter 2 letras')
    .optional()
    .or(z.literal('')),
  cep: z
    .string()
    .regex(/^\d{8}$/, 'CEP deve ter 8 dígitos numéricos')
    .optional()
    .or(z.literal('')),
})

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type PromotionFormData = z.infer<typeof promotionSchema>
