import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { Promotion } from '@/types/promotion'
import Skeleton from '@/components/ui/Skeleton'

const FALLBACK = 'https://placehold.co/80x80/1E293B/94A3B8?text=?'

interface StoriesBarProps {
  promotions: Promotion[]
  loading?: boolean
}

function StoryItem({ promotion }: { promotion: Promotion }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  return (
    <button
      onClick={() => navigate(`/promotions/${promotion.id}`)}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
      aria-label={`Ver promoção de ${promotion.store}`}
    >
      {/* Anel colorido */}
      <div className="p-0.5 rounded-full bg-gradient-to-tr from-accent via-primary to-blue-400 group-hover:from-orange-400 group-hover:to-blue-500 transition-all duration-200">
        <div className="p-0.5 rounded-full bg-background">
          <img
            src={imgError || !promotion.image_url ? FALLBACK : promotion.image_url}
            alt={promotion.store}
            onError={() => setImgError(true)}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover"
          />
        </div>
      </div>
      <span className="text-[10px] sm:text-xs text-muted max-w-[52px] sm:max-w-[64px] truncate text-center">
        {promotion.store}
      </span>
    </button>
  )
}

export default function StoriesBar({ promotions, loading = false }: StoriesBarProps) {
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

  if (!promotions.length) return null

  return (
    <div
      className="flex gap-3 sm:gap-4 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      aria-label="Stories de promoções"
    >
      {promotions.map((promotion) => (
        <StoryItem key={promotion.id} promotion={promotion} />
      ))}
    </div>
  )
}
