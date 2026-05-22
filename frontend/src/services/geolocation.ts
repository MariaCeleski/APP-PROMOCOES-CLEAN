/**
 * Serviço de Geolocalização
 * Usa ViaCEP para buscar por CEP e Nominatim (OpenStreetMap) para reverse geocoding
 * Totalmente gratuito, sem dependência de chaves de API
 */

export interface LocationData {
  address: string
  city: string
  state: string
  cep: string
  latitude?: number
  longitude?: number
}

/**
 * Busca endereço pelo CEP usando ViaCEP
 */
export async function searchByCEP(cep: string): Promise<LocationData> {
  const cleanCep = cep.replace(/\D/g, '')
  
  if (cleanCep.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos')
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
  const data = await response.json()

  if (data.erro) {
    throw new Error('CEP não encontrado')
  }

  return {
    address: data.logradouro || '',
    city: data.localidade || '',
    state: data.uf || '',
    cep: cleanCep,
  }
}

/**
 * Busca coordenadas usando Nominatim (OpenStreetMap)
 * Converte endereço em latitude/longitude
 */
export async function geocodeAddress(address: string, city: string, state: string): Promise<{ latitude: number; longitude: number }> {
  const query = `${address}, ${city}, ${state}, Brasil`
  
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
    { headers: { 'Accept-Language': 'pt-BR' } }
  )
  const data = await response.json()

  if (!data.length) {
    throw new Error('Endereço não encontrado')
  }

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  }
}

/**
 * Busca endereço a partir de coordenadas (reverse geocoding)
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationData> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
    { headers: { 'Accept-Language': 'pt-BR' } }
  )
  const data = await response.json()
  const addr = data.address || {}

  return {
    address: [addr.road, addr.house_number].filter(Boolean).join(', '),
    city: addr.city || addr.town || addr.village || addr.municipality || '',
    state: addr.state_code || addr.state?.slice(0, 2).toUpperCase() || '',
    cep: (addr.postcode || '').replace(/\D/g, '').slice(0, 8),
    latitude,
    longitude,
  }
}

/**
 * Obtém localização atual do navegador
 */
export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada neste navegador'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('Permissão de geolocalização negada'))
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('Localização não disponível'))
        } else {
          reject(new Error('Erro ao obter localização'))
        }
      },
      { timeout: 10000 }
    )
  })
}
