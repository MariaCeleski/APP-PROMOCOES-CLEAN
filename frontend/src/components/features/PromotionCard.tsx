import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { formatCurrency, capitalize } from '@/utils/formatters'
import { useAuth } from '@/contexts/AuthContext'
import type { Promotion } from '@/types/promotion'

const FALLBACK_IMAGE = 'https://placehold.co/400x300/1E293B/94A3B8?text=Sem+imagem'

interface PromotionCardProps {
  promotion: Promotion
  loading?: boolean
  onDelete?: (id: string) => void
}

export default function PromotionCard({
  promotion,
  loading = false,
  onDelete,
}: PromotionCardProps) {
  const navigate = useNavigate()
  const { user, isEstablishment } = useAuth()
  const [imgError, setImgError] = useState(false)

  const isOwner = user?.id === promotion.user_id
  const canEdit = isOwner && isEstablishment

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <Skeleton height="h-28 xs:h-32 sm:h-36 md:h-40 lg:h-44" rounded="lg" className="rounded-b-none" />
        <div className="p-2 xs:p-2.5 sm:p-3 flex flex-col gap-1.5 sm:gap-2">
          <Skeleton height="h-3 sm:h-4" width="w-3/4" />
          <Skeleton height="h-3" width="w-1/2" />
          <Skeleton height="h-2.5 sm:h-3" width="w-1/3" />
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors duration-200 group flex flex-col h-full"
      onClick={() => navigate(`/promotions/${promotion.id}`)}
    >
      {/* Imagem — altura responsiva com aspect-ratio como fallback */}
      <div className="relative aspect-[4/3] sm:aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-slate-800 flex-shrink-0">
        <img
          src={imgError || !promotion.image_url ? FALLBACK_IMAGE : promotion.image_url}
          alt={promotion.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badge categoria */}
        <span className="absolute top-1 left-1 xs:top-1.5 xs:left-1.5 sm:top-2 sm:left-2 bg-black/60 backdrop-blur-sm text-foreground text-[9px] xs:text-[10px] sm:text-xs px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full leading-tight">
          {promotion.category}
        </span>
        {/* Badge validade */}
        {promotion.expires_at && (() => {
          const now = new Date()
          const exp = new Date(promotion.expires_at)
          const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays < 0) return <span className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-2 sm:right-2 bg-danger/90 text-white text-[8px] xs:text-[9px] sm:text-[10px] px-1 xs:px-1.5 py-0.5 rounded-full leading-tight">Expirada</span>
          if (diffDays === 0) return <span className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-2 sm:right-2 bg-accent/90 text-white text-[8px] xs:text-[9px] sm:text-[10px] px-1 xs:px-1.5 py-0.5 rounded-full leading-tight">Último dia!</span>
          if (diffDays <= 3) return <span className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-2 sm:right-2 bg-accent/80 text-white text-[8px] xs:text-[9px] sm:text-[10px] px-1 xs:px-1.5 py-0.5 rounded-full leading-tight">{diffDays}d restantes</span>
          return null
        })()}
      </div>

      {/* Conteúdo */}
      <div className="p-1.5 xs:p-2 sm:p-3 flex flex-col flex-grow min-h-0">
        <h3 className="text-foreground font-semibold text-[11px] xs:text-xs sm:text-sm line-clamp-2 leading-snug">
          {capitalize(promotion.title)}
        </h3>
        <p className="text-accent font-bold text-xs xs:text-sm sm:text-base mt-0.5">
          {promotion.price ? formatCurrency(promotion.price) : 'Consulte'}
        </p>
        <p className="text-muted text-[9px] xs:text-[10px] sm:text-xs mt-0.5 truncate">
          {capitalize(promotion.store)}
        </p>

        {/* Data de validade — evidente */}
        {promotion.expires_at && (() => {
          const now = new Date()
          const exp = new Date(promotion.expires_at)
          const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          const dateStr = exp.toLocaleDateString('pt-BR')
          const isExpired = diffDays < 0
          const isUrgent = diffDays >= 0 && diffDays <= 3

          return (
            <div className={[
              'mt-1.5 flex items-center gap-1 px-1.5 py-1 rounded-md text-[9px] xs:text-[10px] sm:text-xs font-medium',
              isExpired ? 'bg-danger/15 text-danger' :
              isUrgent ? 'bg-accent/15 text-accent' :
              'bg-primary/10 text-primary',
            ].join(' ')}>
              <span>📅</span>
              <span>
                {isExpired ? `Expirou ${dateStr}` :
                 diffDays === 0 ? `Último dia! ${dateStr}` :
                 `Até ${dateStr}`}
              </span>
            </div>
          )
        })()}

        <div className="flex-grow" />

        {/* Ações do dono */}
        {canEdit && (
          <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/promotions/${promotion.id}/edit`)
              }}
              className="flex-1 text-[10px] sm:text-xs text-primary hover:text-blue-400 font-medium transition-colors"
            >
              Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(promotion.id)
              }}
              className="flex-1 text-[10px] sm:text-xs text-danger hover:text-red-400 font-medium transition-colors"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
