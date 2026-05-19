import { useState, useEffect, useCallback } from 'react'
import { getPromotions } from '@/services/promotions'
import type { Promotion, PromotionFilters } from '@/types/promotion'

interface UsePromotionsReturn {
  promotions: Promotion[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePromotions(filters?: PromotionFilters): UsePromotionsReturn {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPromotions(filters)
      setPromotions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar promoções')
    } finally {
      setLoading(false)
    }
  }, [filters?.category, filters?.city]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPromotions()
  }, [fetchPromotions])

  return { promotions, loading, error, refetch: fetchPromotions }
}
