import { categories } from '@/constants/categories'

interface CategoryFilterProps {
  selected: string
  onSelect: (category: string) => void
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-1.5 sm:gap-2"
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
              'flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full',
              'text-[11px] xs:text-xs sm:text-xs md:text-sm font-medium',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
              isSelected
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-surface/80 text-muted hover:text-foreground hover:bg-surface border border-border',
            ].join(' ')}
          >
            <span aria-hidden="true" className="text-xs sm:text-sm md:text-base">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        )
      })}
    </div>
  )
}
