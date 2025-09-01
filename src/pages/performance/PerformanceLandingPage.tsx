import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { loadUserLearningPath, loadUserPlanAndPolicies, type LpMateria } from '../../services/lp'
import { supabase } from '../../lib/supabase'

export default function PerformanceLandingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [materias, setMaterias] = useState<LpMateria[]>([])
  const [plan, setPlan] = useState<{ plan_code?: string | null; plan_label?: string | null; plan_meta?: any } | null>(null)
  const [expandedPrograms, setExpandedPrograms] = useState<Record<string, boolean>>({})
  const [expandedMaterias, setExpandedMaterias] = useState<Record<number, boolean>>({})
  const [expandedDims, setExpandedDims] = useState<Record<number, boolean>>({})
  const [authInfo, setAuthInfo] = useState<Record<string, { remainingSeconds?: number | null; remainingTokens?: number | null }>>({})
  const consoleBase = (import.meta as any)?.env?.VITE_CONSOLE_API_BASE || ''

  const authorizeAi = async (materia: LpMateria, channel: 'voice' | 'text') => {
    try {
      // 1) Obtener agent_id mapeado a la materia y canal
      const { data: maps, error: mapErr } = await (supabase as any)
        .from('ai_agent_materia')
        .select('agent_id, materia_id, enabled, ai_agents!inner(channel)')
        .eq('materia_id', materia.id)
        .eq('enabled', true)
      if (mapErr) throw mapErr
      const row = (maps || []).find((r: any) => (r.ai_agents?.channel === channel || (channel === 'text' && r.ai_agents?.channel === 'chat')))
      const agentId = row?.agent_id
      if (!agentId) throw new Error('No hay agente mapeado para esta materia y canal')

      // 2) Autorizar sesión en Console
      const res = await fetch(`${consoleBase}/api/ai/sessions/authorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, materia_slug: materia.slug }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`Authorize fallo: ${res.status}`)
      const json = await res.json()

      const remainingSeconds = json?.limits?.remaining_monthly_seconds ?? null
      const remainingTokens = json?.limits?.remaining_monthly_tokens ?? null
      const key = `${materia.id}:${channel}`
      setAuthInfo((prev) => ({ ...prev, [key]: { remainingSeconds, remainingTokens } }))
    } catch (e) {
      console.error('[authorizeAi] error', e)
    }
  }

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const [data, planData] = await Promise.all([
          loadUserLearningPath(user.id),
          loadUserPlanAndPolicies(user.id),
        ])
        if (!cancelled) {
          setMaterias(data)
          setPlan(planData.plan)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'No se pudo cargar el Learning Path')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [user?.id])

  // Mapeo de programa por slug de materia (M1-3, M4-6, M7-9, M10)
  const getProgramMeta = (materiaSlug: string) => {
    const match = materiaSlug?.match(/^M(\d+)_/)
    const idx = match ? parseInt(match[1], 10) : 999
    if (idx >= 1 && idx <= 3) return { key: 'p1', name: 'Programa 1 — Peak Physical Performance', badge: 'bg-cyan-900/20 text-cyan-300 border-cyan-800' }
    if (idx >= 4 && idx <= 6) return { key: 'p2', name: 'Programa 2 — Mind Mastery for Top Performers', badge: 'bg-violet-900/20 text-violet-300 border-violet-800' }
    if (idx >= 7 && idx <= 9) return { key: 'p3', name: 'Programa 3 — Emotional Resilience', badge: 'bg-amber-900/20 text-amber-300 border-amber-800' }
    if (idx === 10) return { key: 'p4', name: 'Programa 4 — The Master Concept', badge: 'bg-blue-900/20 text-blue-300 border-blue-800' }
    return { key: 'px', name: 'Otros', badge: 'bg-gray-800 text-gray-300 border-gray-700' }
  }

  // Agrupar materias por programa
  const groups = useMemo(() => {
    const map = new Map<string, { key: string; name: string; badge: string; materias: LpMateria[] }>()
    materias.forEach((m) => {
      const meta = getProgramMeta(m.slug)
      if (!map.has(meta.key)) map.set(meta.key, { key: meta.key, name: meta.name, badge: meta.badge, materias: [] })
      map.get(meta.key)!.materias.push(m)
    })
    return Array.from(map.values())
  }, [materias])

  const getProgramStyle = (key: string) => {
    switch (key) {
      case 'p1': return { bg: 'bg-cyan-900/15', border: 'border-cyan-800' }
      case 'p2': return { bg: 'bg-violet-900/15', border: 'border-violet-800' }
      case 'p3': return { bg: 'bg-amber-900/15', border: 'border-amber-800' }
      case 'p4': return { bg: 'bg-blue-900/15', border: 'border-blue-800' }
      default:   return { bg: 'bg-gray-900/10', border: 'border-gray-800' }
    }
  }

  const expandAll = () => {
    const prog: Record<string, boolean> = {}
    const mat: Record<number, boolean> = {}
    const dim: Record<number, boolean> = {}
    groups.forEach((g) => {
      prog[g.key] = true
      g.materias.forEach((m) => {
        mat[m.id] = true
        m.dimensions.forEach((d) => { dim[d.id] = true })
      })
    })
    setExpandedPrograms(prog)
    setExpandedMaterias(mat)
    setExpandedDims(dim)
  }

  const collapseAll = () => {
    setExpandedPrograms({})
    setExpandedMaterias({})
    setExpandedDims({})
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-white mb-2">SIOM Performance™ — Mi Learning Path</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Entrenamientos y protocolos aplicados para operar bajo presión. Vista por <span className="text-white font-semibold">materias → dimensiones → sesiones</span>.</p>
        </div>

        <div className="flex items-center justify-end gap-2 mb-4">
          <button className="btn btn-secondary btn-sm" onClick={expandAll}>Expandir todo</button>
          <button className="btn btn-secondary btn-sm" onClick={collapseAll}>Colapsar todo</button>
        </div>

        {loading && (
          <div className="hud-card p-6 text-center text-gray-400">Cargando tu Learning Path…</div>
        )}
        {error && (
          <div className="hud-card p-6 text-center text-red-300">{error}</div>
        )}

        {!loading && !error && (
          <div className="hud-card p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-semibold">Tipo de servicio contratado</div>
              {(plan?.plan_label || plan?.plan_code) && (<span className="text-sm text-cyan-300">{plan?.plan_label ?? plan?.plan_code}</span>)}
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm text-gray-300">
              <div className="bg-gray-900/60 border border-gray-800 rounded p-3"><span className="text-gray-400">Plan:</span> <span className="text-white/90">{plan?.plan_label ?? plan?.plan_code ?? '—'}</span></div>
              <div className="bg-gray-900/60 border border-gray-800 rounded p-3"><span className="text-gray-400">Materias en LP:</span> <span className="text-white/90">{materias.length}</span></div>
              <div className="bg-gray-900/60 border border-gray-800 rounded p-3"><span className="text-gray-400">Cobertura IA:</span> <span className="text-white/90">{materias.filter(m=>m.hasAi).length} materias</span></div>
            </div>
            <div className="mt-3 text-xs text-gray-400">Nivel de dominio recomendado: Funcional (1 sesión/dim) · Intermedio (2) · Avanzado (3) · Maestro (3+ ad hoc).</div>
          </div>
        )}

        {!loading && !error && groups.map((g) => {
          const isOpenProg = !!expandedPrograms[g.key]
          const style = getProgramStyle(g.key)
          return (
            <div key={g.key} className={`hud-card p-5 mb-6 border ${style.bg} ${style.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => setExpandedPrograms((prev) => ({ ...prev, [g.key]: !prev[g.key] }))}>{isOpenProg ? '−' : '+'}</button>
                  <button className="text-left text-lg font-semibold text-white hover:text-cyan-300" onClick={() => setExpandedPrograms((prev) => ({ ...prev, [g.key]: !prev[g.key] }))}>{g.name}</button>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${g.badge}`}>Programa</span>
              </div>
              {isOpenProg && (
                <div className="mt-4 space-y-4">
                  {g.materias.map((m) => {
                    const openMat = !!expandedMaterias[m.id]
                    return (
                      <div key={m.id} className={`bg-gray-900/60 border rounded-lg p-4 ${style.border}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button className="btn btn-secondary btn-sm" onClick={() => setExpandedMaterias((prev) => ({ ...prev, [m.id]: !prev[m.id] }))}>{openMat ? '−' : '+'}</button>
                            <button className="text-left text-white font-semibold hover:text-cyan-300" onClick={() => setExpandedMaterias((prev) => ({ ...prev, [m.id]: !prev[m.id] }))}>{m.name}</button>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${m.hasAi ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>{m.hasAi ? 'IA disponible' : 'IA no asignada'}</span>
                        </div>
                        {openMat && (
                          <div className="space-y-3">
                            {m.dimensions.map((d) => {
                              const openDim = !!expandedDims[d.id]
                              return (
                                <div key={d.id} className={`bg-gray-900 border rounded-lg p-3 ${style.border}`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <button className="btn btn-secondary btn-sm" onClick={() => setExpandedDims((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}>{openDim ? '−' : '+'}</button>
                                      <button className="text-left text-sm text-gray-300 hover:text-cyan-300" onClick={() => setExpandedDims((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}>{d.name}</button>
                                    </div>
                                  </div>
                                  {openDim && (
                                    <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {d.sessions.map((s) => (
                                        <div key={s.id} className={`bg-gray-950 border rounded-lg p-3 ${style.border}`}>
                                          <div className="text-white font-semibold text-sm mb-1">{s.name}</div>
                                          <div className="text-xs text-gray-400">{s.slug}</div>
                                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                            {m.hasVoice && (<span className="px-2 py-0.5 rounded-full border bg-emerald-900/20 text-emerald-400 border-emerald-800">✓ Voz</span>)}
                                            {m.hasChat && (<span className="px-2 py-0.5 rounded-full border bg-emerald-900/20 text-emerald-400 border-emerald-800">✓ Chat</span>)}
                                            {!m.hasVoice && !m.hasChat && (<span className="px-2 py-0.5 rounded-full border bg-gray-800 text-gray-500 border-gray-700">IA inactiva</span>)}
                                            {m.voiceCapSeconds != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Voz: {Math.round(m.voiceCapSeconds/60)} min/mes{m.voiceRemainingSeconds != null ? ` · restante ${Math.max(0, Math.round(m.voiceRemainingSeconds/60))} min` : ''}</span>)}
                                            {m.chatCapTokens != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Chat: {m.chatCapTokens} tokens/mes{m.chatRemainingTokens != null ? ` · restante ${m.chatRemainingTokens}` : ''}</span>)}
                                          </div>
                                          {(m.hasVoice || m.hasChat) && (
                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                              {m.hasVoice && (
                                                <>
                                                  <button className="btn btn-secondary btn-sm" onClick={() => authorizeAi(m, 'voice')}>Iniciar Voz</button>
                                                  {authInfo[`${m.id}:voice`]?.remainingSeconds != null && (
                                                    <span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante voz: {Math.max(0, Math.round((authInfo[`${m.id}:voice`]?.remainingSeconds || 0)/60))} min</span>
                                                  )}
                                                </>
                                              )}
                                              {m.hasChat && (
                                                <>
                                                  <button className="btn btn-secondary btn-sm" onClick={() => authorizeAi(m, 'text')}>Iniciar Chat</button>
                                                  {authInfo[`${m.id}:text`]?.remainingTokens != null && (
                                                    <span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante chat: {authInfo[`${m.id}:text`]?.remainingTokens}</span>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


