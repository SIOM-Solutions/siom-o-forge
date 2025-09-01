import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { loadUserLearningPath, type LpMateria } from '../../services/lp'

export default function PerformanceLandingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [materias, setMaterias] = useState<LpMateria[]>([])
  const [expandedPrograms, setExpandedPrograms] = useState<Record<string, boolean>>({})
  const [expandedMaterias, setExpandedMaterias] = useState<Record<number, boolean>>({})
  const [expandedDims, setExpandedDims] = useState<Record<number, boolean>>({})

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const data = await loadUserLearningPath(user.id)
        if (!cancelled) setMaterias(data)
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

        {!loading && !error && groups.map((g) => {
          const isOpenProg = !!expandedPrograms[g.key]
          return (
            <div key={g.key} className="hud-card p-5 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => setExpandedPrograms((prev) => ({ ...prev, [g.key]: !prev[g.key] }))}>{isOpenProg ? '−' : '+'}</button>
                  <h2 className="text-lg font-semibold text-white">{g.name}</h2>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${g.badge}`}>Programa</span>
              </div>
              {isOpenProg && (
                <div className="mt-4 space-y-4">
                  {g.materias.map((m) => {
                    const openMat = !!expandedMaterias[m.id]
                    return (
                      <div key={m.id} className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button className="btn btn-secondary btn-sm" onClick={() => setExpandedMaterias((prev) => ({ ...prev, [m.id]: !prev[m.id] }))}>{openMat ? '−' : '+'}</button>
                            <div className="text-white font-semibold">{m.name}</div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${m.hasAi ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>{m.hasAi ? 'IA disponible' : 'IA no asignada'}</span>
                        </div>
                        {openMat && (
                          <div className="space-y-3">
                            {m.dimensions.map((d) => {
                              const openDim = !!expandedDims[d.id]
                              return (
                                <div key={d.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <button className="btn btn-secondary btn-sm" onClick={() => setExpandedDims((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}>{openDim ? '−' : '+'}</button>
                                      <div className="text-sm text-gray-300">{d.name}</div>
                                    </div>
                                  </div>
                                  {openDim && (
                                    <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {d.sessions.map((s) => (
                                        <div key={s.id} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                                          <div className="text-white font-semibold text-sm mb-1">{s.name}</div>
                                          <div className="text-xs text-gray-400">{s.slug}</div>
                                          <div className="mt-2 flex items-center gap-2 text-xs">
                                            <span className={`px-2 py-0.5 rounded-full border ${m.hasAi ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{m.hasAi ? '✓ IA Voz/Chat' : 'IA inactiva'}</span>
                                          </div>
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


