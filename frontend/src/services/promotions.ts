import api from './api'
import type {
  Promotion,
  CreatePromotionPayload,
  UpdatePromotionPayload,
  PromotionFilters,
} from '@/types/promotion'

// ─── getPromotions ───────────────────────────────────────────────────────────

export async function getPromotions(filters?: PromotionFilters): Promise<Promotion[]> {
  const params: Record<string, string> = {}
  if (filters?.category && filters.category !== 'Todos') {
    params.category = filters.category
  }
  if (filters?.city) {
    params.city = filters.city
  }

  const { data } = await api.get<{ promotions: Promotion[] }>('/api/promotions', { params })
  return data.promotions
}

// ─── getPromotionsWithLocation ───────────────────────────────────────────────

export async function getPromotionsWithLocation(): Promise<Promotion[]> {
  const { data } = await api.get<{ promotions: Promotion[] }>('/api/promotions/map')
  return data.promotions
}

// ─── getPromotion ────────────────────────────────────────────────────────────

export async function getPromotion(id: string): Promise<Promotion> {
  const { data } = await api.get<{ promotion: Promotion }>(`/api/promotions/${id}`)
  return data.promotion
}

// ─── createPromotion ─────────────────────────────────────────────────────────

export async function createPromotion(payload: CreatePromotionPayload): Promise<Promotion> {
  const { data } = await api.post<{ promotion: Promotion }>('/api/promotions', payload)
  return data.promotion
}

// ─── updatePromotion ─────────────────────────────────────────────────────────

export async function updatePromotion(
  id: string,
  payload: UpdatePromotionPayload,
): Promise<Promotion> {
  const { data } = await api.put<{ promotion: Promotion }>(`/api/promotions/${id}`, payload)
  return data.promotion
}

// ─── deletePromotion ─────────────────────────────────────────────────────────

export async function deletePromotion(id: string): Promise<void> {
  await api.delete(`/api/promotions/${id}`)
}
