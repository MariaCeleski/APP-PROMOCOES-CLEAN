export interface Category {
  name: string
  icon: string
}

export const categories: Category[] = [
  { name: 'Todos', icon: '🔥' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Hambúrguer', icon: '🍔' },
  { name: 'Carnes', icon: '🥩' },
  { name: 'Frango', icon: '🍗' },
  { name: 'Frutos do Mar', icon: '🦐' },
  { name: 'Sushi', icon: '🍣' },
  { name: 'Hortifruti', icon: '🥦' },
  { name: 'Padaria', icon: '🥖' },
  { name: 'Supermercado', icon: '🛒' },
  { name: 'Farmácia', icon: '💊' },
  { name: 'Restaurante', icon: '🍽️' },
  { name: 'Lanchonete', icon: '🥪' },
  { name: 'Sorveteria', icon: '🍦' },
  { name: 'Cafeteria', icon: '☕' },
  { name: 'Bebidas', icon: '🍺' },
  { name: 'Eletrônicos', icon: '📱' },
  { name: 'Loja', icon: '🛍️' },
  { name: 'Conveniência', icon: '🏪' },
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
