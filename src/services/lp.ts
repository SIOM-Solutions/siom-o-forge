import { supabase } from '../lib/supabase'

type Id = number

export type LpSession = { id: Id; slug: string; name: string }
export type LpDimension = { id: Id; slug: string; name: string; sessions: LpSession[] }
export type LpMateria = { id: Id; slug: string; name: string; hasAi: boolean; dimensions: LpDimension[] }
export type PlanSummary = { plan_code?: string | null; plan_label?: string | null; plan_meta?: any }
export type PolicySummary = { materia_id: Id; monthly_seconds_cap?: number | null; monthly_token_cap?: number | null; access_start_at?: string | null; access_end_at?: string | null }

export async function loadUserLearningPath(userId: string): Promise<LpMateria[]> {
  // 1) LP activo
  const { data: lpRow, error: lpErr } = await (supabase as any)
    .from('lp')
    .select('id')
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
    .select('id, slug, name')
    .in('id', materiaIds)
  if (matErr) throw matErr

  // 6) AI coverage
  const { data: mapAgents, error: mapErr } = await (supabase as any)
    .from('ai_agent_materia')
    .select('materia_id, agent_id, enabled')
    .eq('enabled', true)
  if (mapErr) throw mapErr
  const { data: policies, error: polErr } = await (supabase as any)
    .from('ai_user_policy')
    .select('agent_id, materia_id, enabled')
    .eq('user_id', userId)
    .eq('enabled', true)
  if (polErr) throw polErr

  const materiaIdToAgents = new Map<Id, Set<string>>()
  ;(mapAgents || []).forEach((r: any) => {
    if (!materiaIdToAgents.has(r.materia_id)) materiaIdToAgents.set(r.materia_id, new Set())
    materiaIdToAgents.get(r.materia_id)!.add(r.agent_id)
  })
  const userAgents = new Set<string>((policies || []).map((p: any) => p.agent_id))
  const materiaHasAi = (materiaId: Id) => {
    const allowed = materiaIdToAgents.get(materiaId)
    if (!allowed || !allowed.size) return false
    for (const a of allowed) if (userAgents.has(a)) return true
    return false
  }

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

  const materiasSorted = [...(materias || [])].sort((a: any, b: any) => String(a.slug).localeCompare(String(b.slug)))
  const result: LpMateria[] = materiasSorted.map((m: any) => {
    const dims = (dimsByMateria.get(m.id) || []).sort((a: any, b: any) => String(a.slug).localeCompare(String(b.slug)))
    const dimsOut: LpDimension[] = dims.map((d: any) => {
      const sess = (sessByDimension.get(d.id) || []).sort((a: any, b: any) => String(a.slug).localeCompare(String(b.slug)))
      const sessOut: LpSession[] = sess.map((s: any) => ({ id: s.id, slug: s.slug, name: s.name }))
      return { id: d.id, slug: d.slug, name: d.name, sessions: sessOut }
    })
    return { id: m.id, slug: m.slug, name: m.name, hasAi: materiaHasAi(m.id), dimensions: dimsOut }
  })

  return result
}

export async function loadUserPlanAndPolicies(userId: string): Promise<{ plan: PlanSummary | null; policies: PolicySummary[] }>{
  // Plan del LP activo
  const { data: lpRow, error: lpErr } = await (supabase as any)
    .from('lp')
    .select('plan_code, plan_label, plan_meta')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (lpErr) throw lpErr
  const plan: PlanSummary | null = lpRow ? { plan_code: lpRow.plan_code ?? null, plan_label: lpRow.plan_label ?? null, plan_meta: lpRow.plan_meta ?? null } : null

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


