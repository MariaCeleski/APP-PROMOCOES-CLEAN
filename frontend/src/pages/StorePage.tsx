import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import PromotionCard from '@/components/features/PromotionCard'
import { getPromotions } from '@/services/promotions'
import type { Promotion } from '@/types/promotion'

export default function StorePage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [storeName, setStoreName] = useState('')

  useEffect(() => {
    if (!userId) return

    async function load() {
      try {
        const all = await getPromotions()
        const storePromotions = all.filter((p) => p.user_id === userId)
        setPromotions(storePromotions)
        if (storePromotions.length > 0) {
          setStoreName(storePromotions[0].store)
        }
      } catch (err) {
        console.error('Erro ao carregar loja:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground font-bold text-lg sm:text-xl">
            🏪 {storeName || 'Loja'}
          </h1>
          {!loading && (
            <p className="text-muted text-xs sm:text-sm mt-0.5">
              {promotions.length} {promotions.length === 1 ? 'promoção' : 'promoções'}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <PromotionCard key={i} promotion={{} as never} loading />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-3">🏪</p>
          <p className="font-medium text-foreground">Nenhuma promoção encontrada</p>
          <p className="text-xs sm:text-sm mt-1">Esta loja ainda não publicou promoções</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {promotions.map((p) => (
            <PromotionCard key={p.id} promotion={p} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
