import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  loading?: boolean
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary hover:bg-blue-700 active:bg-blue-800 text-white',
  secondary:
    'bg-surface hover:bg-slate-600 active:bg-slate-700 text-foreground border border-border',
  danger:
    'bg-danger hover:bg-red-600 active:bg-red-700 text-white',
}

export default function Button({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={[
        'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm',
        'transition-transform duration-150 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Aguarde...</span>
        </>
      ) : (
        title
      )}
    </button>
  )
}
