import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={[
        'bg-surface rounded-xl shadow-md border border-border/50',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
