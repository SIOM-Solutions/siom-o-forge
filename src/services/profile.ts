import { supabase } from '../lib/supabase'

export interface UserProfileLite {
  id: string
  alias: string | null
  full_name: string | null
}

export async function fetchUserAlias(userId: string): Promise<UserProfileLite | null> {
  try {
    const { data: p } = await supabase
      .from('profiles')
      .select('id, alias, full_name')
      .eq('id', userId)
      .maybeSingle()

    if (p) {
      return {
        id: (p as any).id,
        alias: (p as any).alias ?? null,
        full_name: (p as any).full_name ?? null,
      }
    }
  } catch {}

  try {
    const { data: p2 } = await supabase
      .from('users_profile')
      .select('id, alias, full_name')
      .eq('id', userId)
      .maybeSingle()

    if (p2) {
      return {
        id: (p2 as any).id,
        alias: (p2 as any).alias ?? null,
        full_name: (p2 as any).full_name ?? null,
      }
    }
  } catch {}

  return null
}


