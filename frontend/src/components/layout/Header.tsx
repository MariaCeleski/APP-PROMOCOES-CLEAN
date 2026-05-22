import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const firstName = profile?.name?.split(' ')[0] || ''

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 h-12 sm:h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-foreground font-bold text-sm sm:text-base md:text-lg tracking-tight flex-shrink-0">
          🔥 <span className="text-primary hidden xs:inline">App</span>Promoções
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 sm:gap-1.5 md:gap-2.5">
          {/* Bem-vindo — aparece antes dos links quando logado */}
          {user && firstName && (
            <span className="text-[10px] sm:text-xs text-muted italic mr-1 sm:mr-2 hidden xs:inline">
              Bem-vindo, <span className="text-foreground font-medium not-italic">{firstName}</span> 👋
            </span>
          )}

          <Link
            to="/map"
            className="text-muted hover:text-foreground text-xs sm:text-sm transition-colors px-1.5 sm:px-2 py-1"
          >
            🗺️ <span className="hidden sm:inline">Mapa</span>
          </Link>

          <Link
            to="/favorites"
            className="text-muted hover:text-foreground text-xs sm:text-sm transition-colors px-1.5 sm:px-2 py-1"
          >
            ❤️ <span className="hidden sm:inline">Favoritos</span>
          </Link>

          {user ? (
            <button
              onClick={signOut}
              className="text-xs sm:text-sm text-danger hover:text-red-400 transition-colors px-1.5 sm:px-2 py-1"
            >
              Sair
            </button>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors px-1.5 sm:px-2 py-1"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-xs sm:text-sm bg-primary hover:bg-blue-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors"
              >
                Cadastrar
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
