/**
 * Formata um número como moeda brasileira: R$ 1.234,56
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata CPF: 000.000.000-00
 */
export function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/**
 * Formata CEP: 00000-000
 */
export function formatCEP(cep: string): string {
  const digits = cep.replace(/\D/g, '').slice(0, 8)
  return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
}

/**
 * Remove formatação do CPF (retorna apenas dígitos)
 */
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

/**
 * Remove formatação do CEP (retorna apenas dígitos)
 */
export function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, '')
}

/**
 * Formata data para exibição: dd/mm/aaaa
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

/**
 * Formata data e hora: dd/mm/aaaa às hh:mm
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Trunca texto com reticências
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Capitaliza a primeira letra de cada palavra
 */
export function capitalize(text: string): string {
  return text.replace(/(^|\s)\S/g, (char) => char.toUpperCase())
}
