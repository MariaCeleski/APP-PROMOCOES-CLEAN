export interface Promotion {
  id: string
  title: string
  price: number | null
  store: string
  category: string
  image_url: string | null
  image_urls: string[] | null
  address: string | null
  city: string | null
  state: string | null
  cep: string | null
  latitude: number | null
  longitude: number | null
  expires_at: string | null
  user_id: string
  created_at: string
}

export interface CreatePromotionPayload {
  title: string
  price?: number | null
  store: string
  category: string
  image_url?: string
  image_urls?: string[]
  address?: string
  city?: string
  state?: string
  cep?: string
  latitude?: number
  longitude?: number
  expires_at?: string | null
}

export type UpdatePromotionPayload = Partial<CreatePromotionPayload>

export interface PromotionFilters {
  category?: string
  city?: string
}
