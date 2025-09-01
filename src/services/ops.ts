import { supabase } from '../lib/supabase'

export type OpsPolicy = {
  agent_id: string
  name?: string
  channel?: string
  access_start_at?: string | null
  access_end_at?: string | null
  monthly_seconds_cap?: number | null
  monthly_token_cap?: number | null
}

export async function loadOpsPolicies(userId: string): Promise<OpsPolicy[]> {
  const { data, error } = await (supabase as any)
    .from('ai_user_policy')
    .select('agent_id, access_start_at, access_end_at, monthly_seconds_cap, monthly_token_cap, enabled, scope')
    .eq('user_id', userId)
    .eq('scope', 'ops')
    .eq('enabled', true)
  if (error) throw error
  return (data || [])
}

export function mapAgentToArea(agentId: string): 'negociacion' | 'analisis' | 'nucleos' | 'estrategia' | 'otro' {
  if (!agentId) return 'otro'
  const id = agentId.toLowerCase()
  if (id.startsWith('janus_')) return 'negociacion'
  if (id.startsWith('argos_')) return 'analisis'
  if (id.startsWith('arachne_')) return 'nucleos'
  if (id.startsWith('pallas_')) return 'estrategia'
  return 'otro'
}

export function aggregateAreaAvailability(policies: OpsPolicy[]) {
  const areas: Record<string, { enabled: boolean; seconds?: number | null; tokens?: number | null }> = {
    negociacion: { enabled: false, seconds: null, tokens: null },
    analisis: { enabled: false, seconds: null, tokens: null },
    nucleos: { enabled: false, seconds: null, tokens: null },
    estrategia: { enabled: false, seconds: null, tokens: null },
  }
  policies.forEach((p) => {
    const area = mapAgentToArea(p.agent_id)
    if (area === 'otro') return
    areas[area].enabled = true
    if (p.monthly_seconds_cap != null) {
      areas[area].seconds = Math.max(areas[area].seconds ?? 0, p.monthly_seconds_cap)
    }
    if (p.monthly_token_cap != null) {
      areas[area].tokens = Math.max(areas[area].tokens ?? 0, p.monthly_token_cap)
    }
  })
  return areas
}


