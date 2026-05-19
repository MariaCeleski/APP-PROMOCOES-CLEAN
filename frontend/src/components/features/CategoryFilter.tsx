import { useRef } from 'react'
import { categories } from '@/constants/categories'

interface CategoryFilterProps {
  selected: string
  onSelect: (category: string) => void
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      role="list"
      aria-label="Filtro por categoria"
    >
      {categories.map((cat) => {
        const isSelected = selected === cat.name
        return (
          <button
            key={cat.name}
            role="listitem"
            onClick={() => onSelect(cat.name)}
            aria-pressed={isSelected}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
              'whitespace-nowrap transition-all duration-150 flex-shrink-0',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background',
              isSelected
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-surface/80 text-muted hover:text-foreground hover:bg-surface border border-border',
            ].join(' ')}
          >
            <span aria-hidden="true">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        )
      })}
    </div>
  )
}
