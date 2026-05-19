import { useState, useEffect, useCallback } from 'react'
import { getFavorites, addFavorite, removeFavorite } from '@/services/favorites'
import { useAuth } from '@/contexts/AuthContext'

interface UseFavoritesReturn {
  favoriteIds: string[]
  loading: boolean
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => Promise<void>
}

export function useFavorites(): UseFavoritesReturn {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds([])
      return
    }
    try {
      setLoading(true)
      const ids = await getFavorites()
      setFavoriteIds(ids)
    } catch {
      // silencioso — favoritos não são críticos
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds],
  )

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!user) return

      const alreadyFavorited = favoriteIds.includes(id)

      // Otimistic update
      setFavoriteIds((prev) =>
        alreadyFavorited ? prev.filter((fid) => fid !== id) : [...prev, id],
      )

      try {
        if (alreadyFavorited) {
          await removeFavorite(id)
        } else {
          await addFavorite(id)
        }
      } catch {
        // Reverter em caso de erro
        setFavoriteIds((prev) =>
          alreadyFavorited ? [...prev, id] : prev.filter((fid) => fid !== id),
        )
      }
    },
    [user, favoriteIds],
  )

  return { favoriteIds, loading, isFavorite, toggleFavorite }
}
