import { useRef, useState } from 'react'
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
  const [searchQuery, setSearchQuery] = useState('')
  const recommendedRef = useRef<HTMLDivElement>(null)

  const { promotions, loading, error, refetch } = usePromotions()

  // ─── Scroll dos recomendados ─────────────────────────────────────────────

  function scrollRecommended(direction: 'left' | 'right') {
    if (!recommendedRef.current) return
    const scrollAmount = 300
    recommendedRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    })
  }

  // ─── Derivações ──────────────────────────────────────────────────────────

  const filtered =
    selectedCategory === 'Todos'
      ? promotions
      : promotions.filter((p) => p.category === selectedCategory)

  const searchFiltered = searchQuery.trim()
    ? filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filtered

  const recommended = [...promotions]
    .filter((p) => p.image_url)
    .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-foreground font-bold text-xl">Promoções</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={refetch}
            className="text-muted hover:text-foreground text-sm transition-colors flex items-center gap-1 flex-1 sm:flex-none justify-center"
            aria-label="Recarregar promoções"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Atualizar
          </button>
          <button
            onClick={() => navigate('/map')}
            className="text-sm bg-surface hover:bg-slate-600 text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 flex-1 sm:flex-none justify-center"
          >
            🗺️ Mapa
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

      {/* Busca */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm z-10">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar promoção, loja ou cidade..."
          className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm text-foreground bg-surface border border-border placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-sm z-10"
            aria-label="Limpar busca"
          >
            ✕
          </button>
        )}

        {/* Sugestões de busca */}
        {searchQuery.trim().length >= 2 && searchFiltered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {searchFiltered.slice(0, 5).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSearchQuery('')
                  navigate(`/promotions/${p.id}`)
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-background/50 transition-colors text-left border-b border-border/50 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">{p.title}</p>
                  <p className="text-muted text-xs truncate">
                    {p.store}{p.city ? ` · ${p.city}` : ''}{p.state ? `, ${p.state}` : ''}
                  </p>
                </div>
                <span className="text-muted text-lg ml-2 flex-shrink-0">→</span>
              </button>
            ))}
          </div>
        )}
      </div>

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
        <section className="mb-6 relative group/row">
          <h2 className="text-foreground font-semibold text-sm mb-3">⭐ Recomendados</h2>
          <div className="relative">
            <div
              ref={recommendedRef}
              className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 -mx-3 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0 scroll-smooth scrollbar-hide"
            >
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-36 sm:w-40 md:w-44">
                      <PromotionCard promotion={{} as never} loading />
                    </div>
                  ))
                : recommended.map((p) => (
                    <div key={p.id} className="flex-shrink-0 w-36 sm:w-40 md:w-44">
                      <PromotionCard promotion={p} onDelete={handleDelete} />
                    </div>
                  ))}
            </div>

            {/* Seta esquerda — visível apenas em desktop no hover */}
            <button
              onClick={() => scrollRecommended('left')}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-surface/90 border border-border shadow-lg text-foreground hover:bg-primary hover:text-white transition-all opacity-0 group-hover/row:opacity-100"
              aria-label="Rolar para esquerda"
            >
              ‹
            </button>

            {/* Seta direita — visível apenas em desktop no hover */}
            <button
              onClick={() => scrollRecommended('right')}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-surface/90 border border-border shadow-lg text-foreground hover:bg-primary hover:text-white transition-all opacity-0 group-hover/row:opacity-100"
              aria-label="Rolar para direita"
            >
              ›
            </button>
          </div>
        </section>
      )}

      {/* Filtro de categorias */}
      <section className="mb-4 mt-6">
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </section>

      {/* Lista principal */}
      <section>
        <h2 className="text-foreground font-semibold text-sm mb-3">
          {selectedCategory === 'Todos' ? 'Todas as promoções' : selectedCategory}
          {!loading && (
            <span className="text-muted font-normal ml-2">({searchFiltered.length})</span>
          )}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <PromotionCard key={i} promotion={{} as never} loading />
            ))}
          </div>
        ) : searchFiltered.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-muted">
            <p className="text-3xl sm:text-4xl mb-3">🔍</p>
            <p className="font-medium text-sm sm:text-base">Nenhuma promoção encontrada</p>
            <p className="text-xs sm:text-sm mt-1">Tente outra categoria ou busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {searchFiltered.map((p) => (
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
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary hover:bg-blue-700 text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background font-medium text-xs sm:text-sm z-40"
          aria-label="Criar nova promoção"
        >
          📝 <span className="hidden xs:inline">Cadastrar</span> <span className="hidden sm:inline">promoções</span>
        </button>
      )}
    </PageWrapper>
  )
}
