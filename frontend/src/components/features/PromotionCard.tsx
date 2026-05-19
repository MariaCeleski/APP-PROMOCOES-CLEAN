import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { formatCurrency } from '@/utils/formatters'
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
        <Skeleton height="h-44" rounded="lg" className="rounded-b-none" />
        <div className="p-3 flex flex-col gap-2">
          <Skeleton height="h-4" width="w-3/4" />
          <Skeleton height="h-3" width="w-1/2" />
          <Skeleton height="h-3" width="w-1/3" />
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors duration-200 group"
      onClick={() => navigate(`/promotions/${promotion.id}`)}
    >
      {/* Imagem */}
      <div className="relative h-44 overflow-hidden bg-slate-800">
        <img
          src={imgError || !promotion.image_url ? FALLBACK_IMAGE : promotion.image_url}
          alt={promotion.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge categoria */}
        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-foreground text-xs px-2 py-0.5 rounded-full">
          {promotion.category}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="p-3">
        <h3 className="text-foreground font-semibold text-sm line-clamp-2 leading-snug">
          {promotion.title}
        </h3>
        <p className="text-accent font-bold text-base mt-1">
          {formatCurrency(promotion.price)}
        </p>
        <p className="text-muted text-xs mt-0.5 truncate">{promotion.store}</p>

        {/* Ações do dono */}
        {canEdit && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/promotions/${promotion.id}/edit`)
              }}
              className="flex-1 text-xs text-primary hover:text-blue-400 font-medium transition-colors"
            >
              Editar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(promotion.id)
              }}
              className="flex-1 text-xs text-danger hover:text-red-400 font-medium transition-colors"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
