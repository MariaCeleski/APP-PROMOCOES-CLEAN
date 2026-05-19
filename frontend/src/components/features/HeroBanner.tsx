import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { formatCurrency } from '@/utils/formatters'
import type { Promotion } from '@/types/promotion'

const FALLBACK_IMAGE = 'https://placehold.co/1200x500/1E293B/94A3B8?text=App+Promoções'

interface HeroBannerProps {
  promotion: Promotion | null
  loading?: boolean
}

export default function HeroBanner({ promotion, loading = false }: HeroBannerProps) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  if (loading) {
    return (
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-slate-800 animate-pulse" />
    )
  }

  if (!promotion) return null

  const imageUrl = imgError || !promotion.image_url ? FALLBACK_IMAGE : promotion.image_url

  return (
    <div
      className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/promotions/${promotion.id}`)}
      role="banner"
      aria-label={`Promoção em destaque: ${promotion.title}`}
    >
      {/* Imagem de fundo */}
      <img
        src={imageUrl}
        alt={promotion.title}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Conteúdo sobreposto */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="text-xs text-accent font-semibold uppercase tracking-wider">
          🔥 Destaque
        </span>
        <h2 className="text-foreground font-bold text-xl md:text-2xl mt-1 line-clamp-2 leading-tight">
          {promotion.title}
        </h2>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-muted text-xs">{promotion.store}</p>
            <p className="text-accent font-bold text-lg">
              {formatCurrency(promotion.price)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/promotions/${promotion.id}`)
            }}
            className="bg-primary hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Ver promoção
          </button>
        </div>
      </div>
    </div>
  )
}
