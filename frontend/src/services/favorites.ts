import api from './api'

// ─── getFavorites ────────────────────────────────────────────────────────────

export async function getFavorites(): Promise<string[]> {
  const { data } = await api.get<{ favoriteIds: string[] }>('/api/favorites')
  return data.favoriteIds
}

// ─── addFavorite ─────────────────────────────────────────────────────────────

export async function addFavorite(promotionId: string): Promise<void> {
  await api.post(`/api/favorites/${promotionId}`)
}

// ─── removeFavorite ──────────────────────────────────────────────────────────

export async function removeFavorite(promotionId: string): Promise<void> {
  await api.delete(`/api/favorites/${promotionId}`)
}
