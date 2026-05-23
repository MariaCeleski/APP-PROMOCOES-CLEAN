import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Promotion } from '@/types/promotion'
import Skeleton from '@/components/ui/Skeleton'
import { capitalize } from '@/utils/formatters'

const FALLBACK = 'https://placehold.co/80x80/1E293B/94A3B8?text=?'

interface StoriesBarProps {
  promotions: Promotion[]
  loading?: boolean
}

interface StoreGroup {
  userId: string
  store: string
  imageUrl: string | null
  count: number
  latestPromotion: Promotion
}

function StoryItem({ group }: { group: StoreGroup }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  return (
    <button
      onClick={() => navigate(`/store/${group.userId}`)}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
      aria-label={`Ver promoções de ${group.store}`}
    >
      {/* Anel colorido — mais grosso se tem múltiplas promoções */}
      <div className={[
        'p-0.5 rounded-full transition-all duration-200',
        group.count > 1
          ? 'bg-gradient-to-tr from-accent via-primary to-blue-400 group-hover:from-orange-400 group-hover:to-blue-500'
          : 'bg-gradient-to-tr from-border to-muted/50 group-hover:from-primary group-hover:to-blue-400',
      ].join(' ')}>
        <div className="p-0.5 rounded-full bg-background relative">
          <img
            src={imgError || !group.imageUrl ? FALLBACK : group.imageUrl}
            alt={group.store}
            onError={() => setImgError(true)}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover"
          />
          {/* Badge de quantidade */}
          {group.count > 1 && (
            <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[8px] sm:text-[9px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-sm">
              {group.count}
            </span>
          )}
        </div>
      </div>
      <span className="text-[10px] sm:text-xs text-muted max-w-[52px] sm:max-w-[64px] truncate text-center">
        {capitalize(group.store)}
      </span>
    </button>
  )
}

export default function StoriesBar({ promotions, loading = false }: StoriesBarProps) {
  // Agrupar promoções por estabelecimento (user_id)
  const storeGroups = useMemo(() => {
    const map = new Map<string, StoreGroup>()

    for (const p of promotions) {
      const existing = map.get(p.user_id)
      if (existing) {
        existing.count++
        // Manter a imagem mais recente
        if (new Date(p.created_at) > new Date(existing.latestPromotion.created_at)) {
          existing.imageUrl = p.image_url
          existing.latestPromotion = p
        }
      } else {
        map.set(p.user_id, {
          userId: p.user_id,
          store: p.store,
          imageUrl: p.image_url,
          count: 1,
          latestPromotion: p,
        })
      }
    }

    // Ordenar por mais recente primeiro
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.latestPromotion.created_at).getTime() - new Date(a.latestPromotion.created_at).getTime()
    )
  }, [promotions])

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <Skeleton width="w-12 sm:w-16" height="h-12 sm:h-16" rounded="full" />
            <Skeleton width="w-10 sm:w-12" height="h-2" />
          </div>
        ))}
      </div>
    )
  }

  if (!storeGroups.length) return null

  return (
    <div
      className="flex gap-3 sm:gap-4 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      aria-label="Stories de estabelecimentos"
    >
      {storeGroups.map((group) => (
        <StoryItem key={group.userId} group={group} />
      ))}
    </div>
  )
}
