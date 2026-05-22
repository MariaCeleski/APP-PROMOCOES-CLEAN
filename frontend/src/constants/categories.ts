export interface Category {
  name: string
  icon: string
}

export const categories: Category[] = [
  { name: 'Todos', icon: '🔥' },
  { name: 'Restaurantes', icon: '🍽️' },
  { name: 'Supermercados', icon: '🛒' },
  { name: 'Lojas', icon: '🛍️' },
  { name: 'Petshop', icon: '🐾' },
  { name: 'Farmácias', icon: '💊' },
  { name: 'Serviços', icon: '🔧' },
  { name: 'Turismo', icon: '✈️' },
  { name: 'Lazer', icon: '🎮' },
  { name: 'Outros', icon: '📦' },
]

// Sem "Todos" — para uso em formulários
export const categoriesForForm: Category[] = categories.filter(
  (c) => c.name !== 'Todos',
)

// Apenas os nomes — para uso em enums Zod
export const categoryNames = categoriesForForm.map((c) => c.name) as [
  string,
  ...string[],
]
