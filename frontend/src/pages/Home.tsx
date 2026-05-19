import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import HeroBanner from '@/components/features/HeroBanner'
import StoriesBar from '@/components/features/StoriesBar'
import CategoryFilter from '@/components/features/CategoryFilter'
import PromotionCard from '@/components/features/PromotionCard'
import { usePromotions } from '@/hooks/usePromotions'
import { useAuth } from '@/contexts/AuthContext'
import { deletePromotion } from '@/services/promotions'

export default function Home() {
  const navigate = useNavigate()
  const { isEstablishment } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { promotions, loading, error, refetch } = usePromotions()

  // ─── Derivações ──────────────────────────────────────────────────────────

  const filtered =
    selectedCategory === 'Todos'
      ? promotions
      : promotions.filter((p) => p.category === selectedCategory)

  const recommended = [...promotions]
    .filter((p) => p.image_url)
    .sort((a, b) => b.price - a.price)
    .slice(0, 10)

  // ─── Delete ──────────────────────────────────────────────────────────────

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir esta promoção?')) return
    try {
      setDeletingId(id)
      await deletePromotion(id)
      refetch()
    } catch {
      alert('Erro ao excluir promoção. Tente novamente.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <PageWrapper>
      {/* Cabeçalho da página */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-foreground font-bold text-xl">Promoções</h1>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            className="text-muted hover:text-foreground text-sm transition-colors flex items-center gap-1"
            aria-label="Recarregar promoções"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>
          <button
            onClick={() => navigate('/map')}
            className="text-sm bg-surface hover:bg-slate-600 text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            🗺️ Ver no mapa
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-4 mb-4 text-sm">
          {error}
          <button onClick={refetch} className="ml-2 underline">Tentar novamente</button>
        </div>
      )}

      {/* Hero Banner */}
      <section className="mb-6">
        <HeroBanner promotion={promotions[0] ?? null} loading={loading} />
      </section>

      {/* Stories */}
      <section className="mb-6">
        <h2 className="text-foreground font-semibold text-sm mb-3">Lojas em destaque</h2>
        <StoriesBar promotions={promotions.slice(0, 12)} loading={loading} />
      </section>

      {/* Recomendados — estilo Netflix */}
      {(loading || recommended.length > 0) && (
        <section className="mb-6">
          <h2 className="text-foreground font-semibold text-sm mb-3">⭐ Recomendados</h2>
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-44">
                    <PromotionCard promotion={{} as never} loading />
                  </div>
                ))
              : recommended.map((p) => (
                  <div key={p.id} className="flex-shrink-0 w-44">
                    <PromotionCard promotion={p} onDelete={handleDelete} />
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* Filtro de categorias */}
      <section className="mb-4">
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </section>

      {/* Lista principal */}
      <section>
        <h2 className="text-foreground font-semibold text-sm mb-3">
          {selectedCategory === 'Todos' ? 'Todas as promoções' : selectedCategory}
          {!loading && (
            <span className="text-muted font-normal ml-2">({filtered.length})</span>
          )}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <PromotionCard key={i} promotion={{} as never} loading />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">Nenhuma promoção encontrada</p>
            <p className="text-sm mt-1">Tente outra categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((p) => (
              <PromotionCard
                key={p.id}
                promotion={p}
                onDelete={handleDelete}
                loading={deletingId === p.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAB — apenas para establishment */}
      {isEstablishment && (
        <button
          onClick={() => navigate('/promotions/new')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-blue-700 text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          aria-label="Criar nova promoção"
        >
          +
        </button>
      )}
    </PageWrapper>
  )
}
