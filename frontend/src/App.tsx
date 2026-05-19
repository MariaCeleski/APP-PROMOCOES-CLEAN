import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import PromotionDetail from '@/pages/PromotionDetail'
import CreatePromotion from '@/pages/CreatePromotion'
import Map from '@/pages/Map'

// ─── Rota exclusiva para establishment ──────────────────────────────────────

function EstablishmentRoute({ children }: { children: React.ReactNode }) {
  const { user, isEstablishment, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isEstablishment) return <Navigate to="/" replace />
  return <>{children}</>
}

// ─── App ─────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/promotions/:id" element={<PromotionDetail />} />
      <Route path="/map" element={<Map />} />
      {/* CreatePromotion */}
      <Route
        path="/promotions/new"
        element={
          <EstablishmentRoute>
            <CreatePromotion />
          </EstablishmentRoute>
        }
      />
      <Route
        path="/promotions/:id/edit"
        element={
          <EstablishmentRoute>
            <CreatePromotion />
          </EstablishmentRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
