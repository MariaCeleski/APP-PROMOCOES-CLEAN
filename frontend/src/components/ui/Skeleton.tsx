interface SkeletonProps {
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

export default function Skeleton({
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={[
        'animate-pulse bg-slate-700',
        width,
        height,
        roundedClasses[rounded],
        className,
      ].join(' ')}
      aria-hidden="true"
    />
  )
}
