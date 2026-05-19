import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import PageWrapper from '@/components/layout/PageWrapper'
import Skeleton from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { getPromotion, deletePromotion } from '@/services/promotions'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/utils/formatters'
import type { Promotion } from '@/types/promotion'

const FALLBACK = 'https://placehold.co/800x500/1E293B/94A3B8?text=Sem+imagem'

export default function PromotionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isEstablishment } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const isOwner = user?.id === promotion?.user_id
  const canEdit = isOwner && isEstablishment

  // ─── Carregar promoção ───────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        setLoading(true)
        const data = await getPromotion(id!)
        setPromotion(data)
      } catch {
        setError('Promoção não encontrada')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // ─── Delete ──────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!promotion) return
    if (!window.confirm('Tem certeza que deseja excluir esta promoção?')) return
    try {
      setDeleting(true)
      await deletePromotion(promotion.id)
      navigate('/')
    } catch {
      alert('Erro ao excluir. Tente novamente.')
      setDeleting(false)
    }
  }

  // ─── Loading ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <PageWrapper>
        <Skeleton height="h-72" rounded="xl" className="mb-4" />
        <Skeleton height="h-6" width="w-2/3" className="mb-2" />
        <Skeleton height="h-8" width="w-1/3" className="mb-4" />
        <Skeleton height="h-4" width="w-1/2" className="mb-2" />
        <Skeleton height="h-4" width="w-1/3" />
      </PageWrapper>
    )
  }

  if (error || !promotion) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-muted">
          <p className="text-5xl mb-4">😕</p>
          <p className="font-medium text-foreground">{error || 'Promoção não encontrada'}</p>
          <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline text-sm">
            Voltar ao início
          </button>
        </div>
      </PageWrapper>
    )
  }

  const images =
    promotion.image_urls && promotion.image_urls.length > 0
      ? promotion.image_urls
      : promotion.image_url
      ? [promotion.image_url]
      : [FALLBACK]

  const hasLocation =
    promotion.latitude !== null && promotion.longitude !== null

  return (
    <PageWrapper>
      {/* Botão voltar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-muted hover:text-foreground text-sm mb-4 transition-colors"
      >
        ← Voltar
      </button>

      {/* Galeria de imagens */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-800 mb-6">
        <img
          src={images[currentImage] || FALLBACK}
          alt={promotion.title}
          className="w-full h-72 md:h-96 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
        />

        {/* Navegação da galeria */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage((i) => Math.max(0, i - 1))}
              disabled={currentImage === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors"
              aria-label="Imagem anterior"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentImage((i) => Math.min(images.length - 1, i + 1))}
              disabled={currentImage === images.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors"
              aria-label="Próxima imagem"
            >
              ›
            </button>
            {/* Indicadores */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? 'bg-white' : 'bg-white/40'}`}
                  aria-label={`Ir para imagem ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col gap-4">
        {/* Título e ações */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
              {promotion.category}
            </span>
            <h1 className="text-foreground font-bold text-2xl mt-2 leading-tight">
              {promotion.title}
            </h1>
            <p className="text-accent font-bold text-3xl mt-1">
              {formatCurrency(promotion.price)}
            </p>
            <p className="text-muted text-sm mt-1">{promotion.store}</p>
          </div>

          {/* Botão favoritar */}
          {user && (
            <button
              onClick={() => toggleFavorite(promotion.id)}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:border-danger transition-colors"
              aria-label={isFavorite(promotion.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <span className="text-xl">
                {isFavorite(promotion.id) ? '❤️' : '🤍'}
              </span>
            </button>
          )}
        </div>

        {/* Endereço */}
        {(promotion.address || promotion.city) && (
          <div className="bg-surface rounded-xl p-4 border border-border">
            <h2 className="text-foreground font-semibold text-sm mb-2">📍 Localização</h2>
            <p className="text-muted text-sm">
              {[promotion.address, promotion.city, promotion.state]
                .filter(Boolean)
                .join(', ')}
              {promotion.cep && ` — CEP ${promotion.cep}`}
            </p>
          </div>
        )}

        {/* Mapa embutido */}
        {hasLocation && (
          <div className="rounded-xl overflow-hidden border border-border h-52">
            <MapContainer
              center={[promotion.latitude!, promotion.longitude!]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[promotion.latitude!, promotion.longitude!]}>
                <Popup>{promotion.title}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Ações do dono */}
        {canEdit && (
          <div className="flex gap-3 pt-2 border-t border-border">
            <Button
              title="Editar promoção"
              variant="secondary"
              className="flex-1"
              onClick={() => navigate(`/promotions/${promotion.id}/edit`)}
            />
            <Button
              title="Excluir"
              variant="danger"
              className="flex-1"
              loading={deleting}
              onClick={handleDelete}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
