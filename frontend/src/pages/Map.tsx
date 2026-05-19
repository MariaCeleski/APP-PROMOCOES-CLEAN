import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import PageWrapper from '@/components/layout/PageWrapper'
import { getPromotionsWithLocation } from '@/services/promotions'
import { formatCurrency } from '@/utils/formatters'
import type { Promotion } from '@/types/promotion'

// Fix ícone padrão do Leaflet com Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function Map() {
  const navigate = useNavigate()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // ─── Carregar promoções com localização ──────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const data = await getPromotionsWithLocation()
        setPromotions(data)
      } catch {
        setError('Erro ao carregar promoções no mapa')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ─── Localização do usuário ──────────────────────────────────────────────

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {}, // silencioso se negado
      )
    }
  }, [])

  // ─── Centro do mapa ──────────────────────────────────────────────────────

  const center: [number, number] = (() => {
    if (userLocation) return userLocation
    if (promotions.length > 0) {
      const avgLat = promotions.reduce((s, p) => s + p.latitude!, 0) / promotions.length
      const avgLng = promotions.reduce((s, p) => s + p.longitude!, 0) / promotions.length
      return [avgLat, avgLng]
    }
    return [-15.7801, -47.9292] // Brasília como fallback
  })()

  return (
    <PageWrapper className="p-0">
      <div className="px-4 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-foreground font-bold text-xl">Mapa de Promoções</h1>
          {!loading && (
            <p className="text-muted text-sm mt-0.5">
              {promotions.length} promoção{promotions.length !== 1 ? 'ões' : ''} com localização
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {error && (
        <div className="mx-4 mb-3 bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mx-4 h-[calc(100vh-200px)] rounded-xl bg-slate-800 animate-pulse" />
      ) : (
        <div className="mx-4 rounded-xl overflow-hidden border border-border" style={{ height: 'calc(100vh - 200px)' }}>
          <MapContainer
            center={center}
            zoom={userLocation ? 13 : 11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {promotions.map((p) => (
              <Marker key={p.id} position={[p.latitude!, p.longitude!]}>
                <Popup>
                  <div className="min-w-[160px]">
                    <p className="font-semibold text-sm">{p.title}</p>
                    <p className="text-orange-500 font-bold">{formatCurrency(p.price)}</p>
                    <p className="text-gray-500 text-xs">{p.store}</p>
                    <button
                      onClick={() => navigate(`/promotions/${p.id}`)}
                      className="mt-2 text-xs text-blue-600 hover:underline"
                    >
                      Ver detalhes →
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </PageWrapper>
  )
}
