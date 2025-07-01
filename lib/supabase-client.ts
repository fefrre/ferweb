import { createClient } from '@supabase/supabase-js'

// Solución para Windows y Turbopack
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`
  Missing Supabase configuration!
  Asegúrate de tener estas variables en tu .env.local:
  NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
  NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_anonima
  `)
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key),
    }
  }
})