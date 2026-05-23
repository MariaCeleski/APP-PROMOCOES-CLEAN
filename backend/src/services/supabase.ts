import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client padrão — respeita RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    transport: ws as unknown as Parameters<typeof createClient>[2] extends { realtime?: { transport?: infer T } } ? T : never,
  },
})

// Client admin — bypass de RLS (usar apenas no backend)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    transport: ws as unknown as Parameters<typeof createClient>[2] extends { realtime?: { transport?: infer T } } ? T : never,
  },
})
