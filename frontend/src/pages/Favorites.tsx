import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import PromotionCard from '@/components/features/PromotionCard'
import { getFavoritePromotions } from '@/services/favorites'
import { useAuth } from '@/contexts/AuthContext'
import type { Promotion } from '@/types/promotion'

export default function Favorites() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    async function load() {
      try {
        setLoading(true)
        const data = await getFavoritePromotions()
        setPromotions(data)
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err)
        setError('Erro ao carregar favoritos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  // Remover da lista local ao desfavoritar
  function handleRemove(id: string) {
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }

  if (!user) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-3">🔒</p>
          <p className="font-medium text-foreground">Faça login para ver seus favoritos</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 text-primary hover:underline text-sm"
          >
            Entrar
          </button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground font-bold text-lg sm:text-xl">❤️ Favoritos</h1>
          {!loading && (
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              {promotions.length} {promotions.length === 1 ? 'promoção salva' : 'promoções salvas'}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {/* Erro */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <PromotionCard key={i} promotion={{} as never} loading />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        /* Estado vazio */
        <div className="text-center py-16 sm:py-20 text-muted">
          <p className="text-4xl sm:text-5xl mb-3">🤍</p>
          <p className="font-medium text-foreground text-sm sm:text-base">
            Você ainda não tem promoções favoritas
          </p>
          <p className="text-xs sm:text-sm mt-1">
            Toque no ❤️ nas promoções para salvá-las aqui
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-primary hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Explorar promoções
          </button>
        </div>
      ) : (
        /* Grid de favoritos */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {promotions.map((p) => (
            <PromotionCard
              key={p.id}
              promotion={p}
              onDelete={handleRemove}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
