import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export interface UserAccess {
  user_id: string
  air: boolean
  forge_performance: boolean
  forge_ops: boolean
  psitac: boolean
}

export interface AirMateria {
  id: number
  slug: string
  name: string
  position: number
  typeform_id: string
}

export interface AirAssignment {
  id: number
  user_id: string
  materia_id: number
  project_id?: string
  cohort?: string
  form_version?: string
  lang: string
  status: 'pending' | 'sent'
  sent_at?: string
}

export interface AirSubmission {
  user_id: string
  assignment_id: number
  materia_slug?: string
  project_id?: string
  cohort?: string
  form_version?: string
  lang: string
  status: 'sent'
  extra?: any
}
