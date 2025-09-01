import { supabase } from '../lib/supabase'

export type OpsCoverageRow = {
  agent_id: string
  agent_name: string
  area: string
  has_access: boolean
  has_voice: boolean
  has_chat: boolean
  voice_min_mes: number | null
  chat_tokens_mes: number | null
  voice_min_restante: number | null
  chat_tokens_restante: number | null
  access_start_at?: string | null
  access_end_at?: string | null
}

export async function loadOpsCoverage(): Promise<OpsCoverageRow[]> {
  const { data, error } = await (supabase as any).rpc('ops_coverage_by_user')
  if (error) throw error
  return (data || [])
}

export function aggregateOpsCoverageByArea(rows: OpsCoverageRow[]) {
  const areas: Record<string, {
    enabled: boolean
    minutesPerMonth?: number | null
    tokensPerMonth?: number | null
    minutesRemaining?: number | null
    tokensRemaining?: number | null
  }> = {
    negociacion: { enabled: false, minutesPerMonth: null, tokensPerMonth: null, minutesRemaining: null, tokensRemaining: null },
    analisis: { enabled: false, minutesPerMonth: null, tokensPerMonth: null, minutesRemaining: null, tokensRemaining: null },
    nucleos: { enabled: false, minutesPerMonth: null, tokensPerMonth: null, minutesRemaining: null, tokensRemaining: null },
    estrategia: { enabled: false, minutesPerMonth: null, tokensPerMonth: null, minutesRemaining: null, tokensRemaining: null },
  }
  rows.forEach((r) => {
    let key: keyof typeof areas = 'negociacion'
    const a = r.area?.toLowerCase() || ''
    if (a.includes('negoci')) key = 'negociacion'
    else if (a.includes('análisis') || a.includes('analisis')) key = 'analisis'
    else if (a.includes('núcleos') || a.includes('nucleos')) key = 'nucleos'
    else if (a.includes('estratég') || a.includes('estrateg')) key = 'estrategia'
    const areaRef = areas[key]
    if (r.has_access && (r.has_voice || r.has_chat)) areaRef.enabled = true
    if (r.voice_min_mes != null) areaRef.minutesPerMonth = Math.max(areaRef.minutesPerMonth ?? 0, r.voice_min_mes)
    if (r.chat_tokens_mes != null) areaRef.tokensPerMonth = Math.max(areaRef.tokensPerMonth ?? 0, r.chat_tokens_mes)
    if (r.voice_min_restante != null) areaRef.minutesRemaining = Math.max(areaRef.minutesRemaining ?? 0, r.voice_min_restante)
    if (r.chat_tokens_restante != null) areaRef.tokensRemaining = Math.max(areaRef.tokensRemaining ?? 0, r.chat_tokens_restante)
  })
  return areas
}


