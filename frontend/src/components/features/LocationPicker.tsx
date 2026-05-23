import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix ícone Leaflet com Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface LocationPickerProps {
  latitude: number | null
  longitude: number | null
}

// Centraliza o mapa quando as coordenadas mudam
function MapCenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 16, { animate: true })
  }, [lat, lng, map])
  return null
}

export default function LocationPicker({ latitude, longitude }: LocationPickerProps) {
  const hasLocation = latitude !== null && longitude !== null

  if (!hasLocation) {
    return (
      <div className="rounded-xl border border-border h-[180px] sm:h-[200px] bg-slate-800/50 flex items-center justify-center">
        <p className="text-muted text-xs sm:text-sm text-center px-4">
          📍 O mapa aparecerá quando o endereço for preenchido via CEP
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border h-[180px] sm:h-[200px]">
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenterUpdater lat={latitude} lng={longitude} />
        <Marker position={[latitude, longitude]} />
      </MapContainer>
    </div>
  )
}
