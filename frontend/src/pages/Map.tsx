import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getPromotionsWithLocation } from '@/services/promotions'
import { formatCurrency, capitalize } from '@/utils/formatters'
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

  useEffect(() => {
    async function load() {
      try {
        const data = await getPromotionsWithLocation()
        const validPromotions = data.filter(p => p.latitude && p.longitude)
        setPromotions(validPromotions)
      } catch (err) {
        console.error('Erro ao carregar promoções:', err)
        setPromotions([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Centro padrão (Brasília) ou primeira promoção
  const center: [number, number] = promotions.length > 0
    ? [promotions[0].latitude!, promotions[0].longitude!]
    : [-15.7801, -47.9292]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header do mapa */}
      <div className="flex-shrink-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-border">
        <div>
          <h1 className="text-foreground font-bold text-base sm:text-lg">Mapa de Promoções</h1>
          {!loading && (
            <p className="text-muted text-[10px] sm:text-xs mt-0.5">
              {promotions.length} {promotions.length === 1 ? 'promoção' : 'promoções'}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Voltar
        </button>
      </div>

      {/* Mapa — ocupa todo o espaço restante */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
            <span className="text-muted text-sm">Carregando mapa...</span>
          </div>
        ) : (
          <MapContainer
            center={center}
            zoom={promotions.length > 0 ? 13 : 4}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {promotions.map((p) => (
              <Marker key={p.id} position={[p.latitude!, p.longitude!]}>
                <Popup>
                  <div className="min-w-[180px]">
                    <p className="font-semibold text-sm text-gray-900">{capitalize(p.title)}</p>
                    <p className="text-orange-600 font-bold">{p.price ? formatCurrency(p.price) : 'Consulte'}</p>
                    <p className="text-gray-600 text-xs">{capitalize(p.store)}</p>
                    <p className="text-gray-500 text-xs">{p.category}</p>
                    <button
                      onClick={() => navigate(`/promotions/${p.id}`)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ver detalhes →
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  )
}
