import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-foreground font-bold text-lg tracking-tight">
          🔥 <span className="text-primary">App</span>Promoções
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-3">
          <Link
            to="/map"
            className="text-muted hover:text-foreground text-sm transition-colors"
          >
            Mapa
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-muted text-sm hidden sm:block truncate max-w-[120px]">
                {profile?.name || user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-danger hover:text-red-400 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm bg-primary hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
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
