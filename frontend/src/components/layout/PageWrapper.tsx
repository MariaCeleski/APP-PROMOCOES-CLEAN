import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface PageWrapperProps {
  children: ReactNode
  className?: string
  noFooter?: boolean
}

export default function PageWrapper({ children, className = '', noFooter = false }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className={['flex-1 w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6', className].join(' ')}>
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  )
}
