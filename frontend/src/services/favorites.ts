import api from './api'
import type { Promotion } from '@/types/promotion'

// ─── getFavorites ────────────────────────────────────────────────────────────

export async function getFavorites(): Promise<string[]> {
  const { data } = await api.get<{ favoriteIds: string[] }>('/api/favorites')
  return data.favoriteIds
}

// ─── getFavoritePromotions ───────────────────────────────────────────────────

export async function getFavoritePromotions(): Promise<Promotion[]> {
  const { data } = await api.get<{ promotions: Promotion[] }>('/api/favorites/promotions')
  return data.promotions
}

// ─── addFavorite ─────────────────────────────────────────────────────────────

export async function addFavorite(promotionId: string): Promise<void> {
  await api.post(`/api/favorites/${promotionId}`)
}

// ─── removeFavorite ──────────────────────────────────────────────────────────

export async function removeFavorite(promotionId: string): Promise<void> {
  await api.delete(`/api/favorites/${promotionId}`)
}
