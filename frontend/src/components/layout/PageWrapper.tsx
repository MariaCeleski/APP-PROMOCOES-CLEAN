import type { ReactNode } from 'react'
import Header from './Header'

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={['max-w-5xl mx-auto px-4 py-6', className].join(' ')}>
        {children}
      </main>
    </div>
  )
}
