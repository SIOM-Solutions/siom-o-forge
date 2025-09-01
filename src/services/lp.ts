import { supabase } from '../lib/supabase'

type Id = number

export type LpSession = { id: Id; slug: string; name: string }
export type LpDimension = { id: Id; slug: string; name: string; sessions: LpSession[] }
export type LpMateria = {
  id: Id
  slug: string
  name: string
  hasAi: boolean
  hasVoice: boolean
  hasChat: boolean
  voiceCapSeconds?: number | null
  chatCapTokens?: number | null
  voiceRemainingSeconds?: number | null
  chatRemainingTokens?: number | null
  dimensions: LpDimension[]
}
export type PlanSummary = { plan_code?: string | null; plan_label?: string | null; plan_meta?: any }
export type PolicySummary = { materia_id: Id; monthly_seconds_cap?: number | null; monthly_token_cap?: number | null; access_start_at?: string | null; access_end_at?: string | null }

export async function loadUserLearningPath(userId: string): Promise<LpMateria[]> {
  // 1) LP activo
  const { data: lpRow, error: lpErr } = await (supabase as any)
    .from('lp')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (lpErr) throw lpErr
  const lpId: Id | null = lpRow?.id ?? null
  if (!lpId) return []

  // 2) items (sesiones)
  const { data: items, error: itemsErr } = await (supabase as any)
    .from('lp_items')
    .select('session_id')
    .eq('lp_id', lpId)
  if (itemsErr) throw itemsErr
  const sessionIds: Id[] = (items || []).map((r: any) => r.session_id)
  if (!sessionIds.length) return []

  // 3) sesiones
  const { data: sessions, error: sessErr } = await (supabase as any)
    .from('sessions_catalog')
    .select('id, slug, name, dimension_id')
    .in('id', sessionIds)
  if (sessErr) throw sessErr
  const dimensionIds: Id[] = Array.from(new Set((sessions || []).map((s: any) => s.dimension_id)))

  // 4) dimensiones
  const { data: dimensions, error: dimErr } = await (supabase as any)
    .from('dimensions_catalog')
    .select('id, slug, name, materia_id')
    .in('id', dimensionIds)
  if (dimErr) throw dimErr
  const materiaIds: Id[] = Array.from(new Set((dimensions || []).map((d: any) => d.materia_id)))

  // 5) materias
  const { data: materias, error: matErr } = await (supabase as any)
    .from('materias_catalog')
    .select('id, slug, name, position')
    .in('id', materiaIds)
  if (matErr) throw matErr

  // 6) AI coverage
  // 6) AI mapping (materia ↔ agentes) limitado a materias del LP y con canal
  const { data: mapAgents, error: mapErr } = await (supabase as any)
    .from('ai_agent_materia')
    .select('materia_id, agent_id, enabled')
    .eq('enabled', true)
    .in('materia_id', materiaIds)
  if (mapErr) throw mapErr
  const agentIds: string[] = Array.from(new Set((mapAgents || []).map((r: any) => r.agent_id)))
  const { data: agents, error: agentsErr } = await (supabase as any)
    .from('ai_agents')
    .select('agent_id, channel')
    .in('agent_id', agentIds.length ? agentIds : ['-nope-'])
  if (agentsErr) throw agentsErr
  const agentIdToChannel = new Map<string, 'voice' | 'text' | 'chat' | string>()
  ;(agents || []).forEach((a: any) => agentIdToChannel.set(a.agent_id, a.channel))

  // 7) Políticas activas en ventana (scope='materia') y con canal
  const { data: policiesAll, error: polErr } = await (supabase as any)
    .from('ai_user_policy')
    .select('agent_id, materia_id, enabled, scope, access_start_at, access_end_at, monthly_seconds_cap, monthly_token_cap')
    .eq('user_id', userId)
    .eq('enabled', true)
    .eq('scope', 'materia')
    .in('materia_id', materiaIds)
  if (polErr) throw polErr
  const nowMs = Date.now()
  const policies = (policiesAll || []).filter((p: any) => {
    const startOk = !p.access_start_at || (Date.parse(p.access_start_at) <= nowMs)
    const endOk = !p.access_end_at || (Date.parse(p.access_end_at) >= nowMs)
    return startOk && endOk
  })

  // Set de agentes mapeados por materia (independiente de canal) — como en tu SQL
  const materiaIdToAgentSet = new Map<Id, Set<string>>()
  ;(mapAgents || []).forEach((r: any) => {
    if (!materiaIdToAgentSet.has(r.materia_id)) materiaIdToAgentSet.set(r.materia_id, new Set())
    materiaIdToAgentSet.get(r.materia_id)!.add(r.agent_id)
  })
  // 8) Uso en ventana por política para calcular restante (consulta única y agregación en cliente)
  const policyAgentIds: string[] = Array.from(new Set((policies || []).map((p: any) => p.agent_id)))
  let sessionsByAgent: Record<string, any[]> = {}
  if (policyAgentIds.length) {
    const { data: sessionsAll, error: sessErr2 } = await (supabase as any)
      .from('ai_sessions')
      .select('agent_id, started_at, seconds_used, tokens_in, tokens_out')
      .eq('user_id', userId)
      .in('agent_id', policyAgentIds)
    if (sessErr2) throw sessErr2
    sessionsByAgent = (sessionsAll || []).reduce((acc: any, s: any) => {
      if (!acc[s.agent_id]) acc[s.agent_id] = []
      acc[s.agent_id].push(s)
      return acc
    }, {})
  }

  const materiaChannelCaps = new Map<Id, { voiceCapSeconds?: number | null; chatCapTokens?: number | null; voiceRemainingSeconds?: number | null; chatRemainingTokens?: number | null; hasVoice: boolean; hasChat: boolean }>()
  ;(materiaIds || []).forEach((mid: Id) => {
    materiaChannelCaps.set(mid, { hasVoice: false, hasChat: false, voiceCapSeconds: null, chatCapTokens: null, voiceRemainingSeconds: null, chatRemainingTokens: null })
  })
  ;(policies || []).forEach((p: any) => {
    const channel = agentIdToChannel.get(p.agent_id)
    const mapped = materiaIdToAgentSet.get(p.materia_id)
    const out = materiaChannelCaps.get(p.materia_id)!
    if (channel === 'voice' && mapped && mapped.has(p.agent_id)) {
      out.hasVoice = true
      if (p.monthly_seconds_cap != null) out.voiceCapSeconds = Math.max(out.voiceCapSeconds ?? 0, p.monthly_seconds_cap)
      // calcular uso en ventana
      const winStart = p.access_start_at ? new Date(p.access_start_at).getTime() : new Date('1970-01-01T00:00:00Z').getTime()
      const winEnd = p.access_end_at ? new Date(p.access_end_at).getTime() : Number.POSITIVE_INFINITY
      const usedSeconds = (sessionsByAgent[p.agent_id] || []).reduce((sum: number, s: any) => {
        const t = new Date(s.started_at).getTime()
        if (t >= winStart && t <= winEnd) return sum + (s.seconds_used || 0)
        return sum
      }, 0)
      if (p.monthly_seconds_cap != null) out.voiceRemainingSeconds = Math.max(out.voiceRemainingSeconds ?? 0, Math.max(0, p.monthly_seconds_cap - usedSeconds))
    }
    if ((channel === 'text' || channel === 'chat') && mapped && mapped.has(p.agent_id)) {
      out.hasChat = true
      if (p.monthly_token_cap != null) out.chatCapTokens = Math.max(out.chatCapTokens ?? 0, p.monthly_token_cap)
      const winStart = p.access_start_at ? new Date(p.access_start_at).getTime() : new Date('1970-01-01T00:00:00Z').getTime()
      const winEnd = p.access_end_at ? new Date(p.access_end_at).getTime() : Number.POSITIVE_INFINITY
      const usedTokens = (sessionsByAgent[p.agent_id] || []).reduce((sum: number, s: any) => {
        const t = new Date(s.started_at).getTime()
        if (t >= winStart && t <= winEnd) return sum + ((s.tokens_in || 0) + (s.tokens_out || 0))
        return sum
      }, 0)
      if (p.monthly_token_cap != null) out.chatRemainingTokens = Math.max(out.chatRemainingTokens ?? 0, Math.max(0, p.monthly_token_cap - usedTokens))
    }
  })

  // 7) Ensamblar estructura Materia → Dimensiones → Sesiones
  const dimsByMateria = new Map<Id, any[]>()
  ;(dimensions || []).forEach((d: any) => {
    if (!dimsByMateria.has(d.materia_id)) dimsByMateria.set(d.materia_id, [])
    dimsByMateria.get(d.materia_id)!.push(d)
  })

  const sessByDimension = new Map<Id, any[]>()
  ;(sessions || []).forEach((s: any) => {
    if (!sessByDimension.has(s.dimension_id)) sessByDimension.set(s.dimension_id, [])
    sessByDimension.get(s.dimension_id)!.push(s)
  })

  const getSlugNum = (slug: string) => {
    const num = String(slug || '').replace(/\D/g, '')
    return num ? parseInt(num, 10) : Number.MAX_SAFE_INTEGER
  }
  const materiasSorted = [...(materias || [])].sort((a: any, b: any) => {
    const pa = a.position ?? null
    const pb = b.position ?? null
    if (pa != null && pb != null) return pa - pb
    if (pa != null) return -1
    if (pb != null) return 1
    return getSlugNum(a.slug) - getSlugNum(b.slug)
  })
  let result: LpMateria[] = materiasSorted.map((m: any) => {
    const dims = (dimsByMateria.get(m.id) || []).sort((a: any, b: any) => String(a.slug).localeCompare(String(b.slug)))
    const dimsOut: LpDimension[] = dims.map((d: any) => {
      const sess = (sessByDimension.get(d.id) || []).sort((a: any, b: any) => String(a.slug).localeCompare(String(b.slug)))
      const sessOut: LpSession[] = sess.map((s: any) => ({ id: s.id, slug: s.slug, name: s.name }))
      return { id: d.id, slug: d.slug, name: d.name, sessions: sessOut }
    })
    const caps = materiaChannelCaps.get(m.id)!
    const hasAi = !!(caps.hasVoice || caps.hasChat)
    return {
      id: m.id,
      slug: m.slug,
      name: m.name,
      hasAi,
      hasVoice: caps.hasVoice,
      hasChat: caps.hasChat,
      voiceCapSeconds: caps.voiceCapSeconds ?? null,
      chatCapTokens: caps.chatCapTokens ?? null,
      voiceRemainingSeconds: caps.voiceRemainingSeconds ?? null,
      chatRemainingTokens: caps.chatRemainingTokens ?? null,
      dimensions: dimsOut,
    }
  })

  // 9) OPCIONAL: si existe la RPC `ia_coverage_by_materia`, superponer cobertura desde Supabase (evita problemas RLS)
  try {
    const { data: cov, error: covErr } = await (supabase as any).rpc('ia_coverage_by_materia')
    if (!covErr && Array.isArray(cov) && cov.length) {
      const bySlug = new Map<string, any>()
      for (const r of cov) bySlug.set(r.materia_slug, r)
      result = result.map((m) => {
        const row = bySlug.get(m.slug)
        if (!row) return m
        const hasVoice = !!row.has_voice
        const hasChat = !!row.has_chat
        const hasAi = hasVoice || hasChat
        const voiceCapSeconds = row.voice_min_mes != null ? Number(row.voice_min_mes) * 60 : m.voiceCapSeconds ?? null
        const chatCapTokens = row.chat_tokens_mes != null ? Number(row.chat_tokens_mes) : m.chatCapTokens ?? null
        const voiceRemainingSeconds = row.voice_min_restante != null ? Number(row.voice_min_restante) * 60 : m.voiceRemainingSeconds ?? null
        const chatRemainingTokens = row.chat_tokens_restante != null ? Number(row.chat_tokens_restante) : m.chatRemainingTokens ?? null
        return { ...m, hasAi, hasVoice, hasChat, voiceCapSeconds, chatCapTokens, voiceRemainingSeconds, chatRemainingTokens }
      })
    }
  } catch (_) {
    // ignore and keep local computation
  }

  return result
}

export async function loadUserPlanAndPolicies(userId: string): Promise<{ plan: PlanSummary | null; policies: PolicySummary[] }>{
  // Plan del LP activo
  const { data: lpRow, error: lpErr } = await (supabase as any)
    .from('lp')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (lpErr) throw lpErr
  const plan: PlanSummary | null = lpRow ? {
    plan_code: (lpRow as any).plan_code ?? (lpRow as any).plan ?? null,
    plan_label: (lpRow as any).plan_label ?? null,
    plan_meta: (lpRow as any).plan_meta ?? null,
  } : null

  // Políticas IA por materia
  const { data: pol, error: polErr } = await (supabase as any)
    .from('ai_user_policy')
    .select('materia_id, monthly_seconds_cap, monthly_token_cap, access_start_at, access_end_at, enabled')
    .eq('user_id', userId)
    .eq('enabled', true)
  if (polErr) throw polErr
  const policies: PolicySummary[] = (pol || []).map((p: any) => ({
    materia_id: p.materia_id,
    monthly_seconds_cap: p.monthly_seconds_cap ?? null,
    monthly_token_cap: p.monthly_token_cap ?? null,
    access_start_at: p.access_start_at ?? null,
    access_end_at: p.access_end_at ?? null,
  }))

  return { plan, policies }
}


