import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { fetchAllMaterias, fetchUserAssignments } from '../../services/air'
import type { AirAssignment, AirMateria } from '../../lib/supabase'

export default function AirAssignmentsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [materias, setMaterias] = useState<AirMateria[]>([])
  const [assignments, setAssignments] = useState<AirAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [activeProgram, setActiveProgram] = useState<number | 'all'>('all')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const [allMats, userAssigns] = await Promise.all([
          fetchAllMaterias(),
          fetchUserAssignments(user.id),
        ])
        if (!cancelled) {
          // Excluir PSITAC del grid de SystemAIR
          setMaterias(allMats.filter(m => m.slug !== 'PSITAC'))
          setAssignments(userAssigns)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Error cargando materias')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user?.id])

  // Mapeos y orden
  const assignsByMateriaId = useMemo(() => {
    const map = new Map<number, AirAssignment>()
    assignments.forEach(a => map.set(a.materia_id, a))
    return map
  }, [assignments])

  const parsedAndSortedAll = useMemo(() => {
    const list = materias.map((m) => {
      const match = m.slug.match(/^M(\d+)_/)
      const ordinal = match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER
      const assignment = assignsByMateriaId.get(m.id)
      return { materia: m, assignment, _ordinal: ordinal }
    })
    list.sort((a, b) => a._ordinal - b._ordinal)
    return list
  }, [materias, assignsByMateriaId])

  const progress = useMemo(() => {
    const totalAssigned = parsedAndSortedAll.filter(i => !!i.assignment).length
    const completed = parsedAndSortedAll.filter(i => i.assignment?.status === 'sent').length
    const percent = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0
    return { completed, totalAssigned, percent }
  }, [parsedAndSortedAll])

  const assignedItems = useMemo(() => parsedAndSortedAll.filter(i => !!i.assignment), [parsedAndSortedAll])
  const lockedItems = useMemo(() => parsedAndSortedAll.filter(i => !i.assignment), [parsedAndSortedAll])

  // Briefings breves para vista de tarjetas (hover)
  const HOVER_INFO: Record<string, { analiza: string; dolor: string; obtienes: string }> = {
    M1_SUENO: {
      analiza: 'Patrones de sueño, profundidad y recuperación',
      dolor: 'Privación → peor decisión y claridad',
      obtienes: 'Protocolo para dormir profundo y rendir estable',
    },
    M2_ACOND: {
      analiza: 'Fuerza, cardio y movilidad orientados a función',
      dolor: 'Sedentarismo → baja energía y estrés alto',
      obtienes: 'Plan de atleta corporativo eficiente en tiempo',
    },
    M3_NUTRI: {
      analiza: 'Ritmos y densidad nutritiva',
      dolor: 'Picos de glucosa → niebla mental y fatiga',
      obtienes: 'Energía sostenida y enfoque estable',
    },
    M4_ATENCION: {
      analiza: 'Foco, trabajo profundo y control de distracciones',
      dolor: 'Multitarea y ruido digital',
      obtienes: 'Más output de calidad en menos tiempo',
    },
    M5_APREND: {
      analiza: 'Métodos de meta‑aprendizaje efectivos',
      dolor: 'Brechas que frenan el progreso',
      obtienes: 'Aprender lo crítico antes y mejor',
    },
    M6_PROD: {
      analiza: 'Priorización, delegación y rituales',
      dolor: 'Trabajo sobre el trabajo; agendas reactivas',
      obtienes: 'Decisiones más rápidas y ejecución alineada',
    },
    M7_ESTRES: {
      analiza: 'Autorregulación y tolerancia al estrés',
      dolor: 'Estrés crónico que degrada la decisión',
      obtienes: 'Resiliencia y rendimiento sostenido',
    },
    M8_NEURO: {
      analiza: 'Rutinas que modulan dopamina/serotonina/cortisol',
      dolor: 'Altibajos de motivación y ánimo',
      obtienes: 'Energía y autocontrol emocional estables',
    },
    M9_LIDER: {
      analiza: 'Autoliderazgo y equipos de alto rendimiento',
      dolor: 'Silos y baja ejecución',
      obtienes: 'Equipos comprometidos y decisiones mejores',
    },
    M10_MASTER: {
      analiza: 'Integración de prácticas SIOM en sistema',
      dolor: 'Mejoras puntuales sin consolidar',
      obtienes: 'Ventaja estructural y sostenible',
    },
  }

  // Programa al que pertenece cada materia según ordinal (1-3, 4-6, 7-9, 10)
  const getProgramMeta = (ordinal: number) => {
    if (ordinal >= 1 && ordinal <= 3) {
      return {
        id: 1,
        name: 'Programa 1 — Peak Physical Performance',
        short: 'Prog 1 · Peak Physical',
        badgeClass: 'bg-cyan-900/20 text-cyan-300 border-cyan-800',
      }
    }
    if (ordinal >= 4 && ordinal <= 6) {
      return {
        id: 2,
        name: 'Programa 2 — Mind Mastery for Top Performers',
        short: 'Prog 2 · Mind Mastery',
        badgeClass: 'bg-violet-900/20 text-violet-300 border-violet-800',
      }
    }
    if (ordinal >= 7 && ordinal <= 9) {
      return {
        id: 3,
        name: 'Programa 3 — Emotional Resilience',
        short: 'Prog 3 · Resilience',
        badgeClass: 'bg-amber-900/20 text-amber-300 border-amber-800',
      }
    }
    return {
      id: 4,
      name: 'Programa 4 — The Master Concept',
      short: 'Prog 4 · Master Concept',
      badgeClass: 'bg-blue-900/20 text-blue-300 border-blue-800',
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-emerald-900/20 text-emerald-400 border-emerald-800'
      case 'completed':
        return 'bg-blue-900/20 text-blue-300 border-blue-800'
      case 'blocked':
        return 'bg-gray-800 text-gray-500 border-gray-700'
      default:
        return 'bg-gray-800 text-gray-500 border-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'Asignada'
      case 'completed':
        return 'Completada'
      case 'blocked':
        return 'Bloqueada'
      default:
        return 'Pendiente'
    }
  }

  const filteredAssignedItems = useMemo(() => {
    return assignedItems.filter(i => activeProgram === 'all' ? true : getProgramMeta(i._ordinal).id === activeProgram)
  }, [assignedItems, activeProgram])

  // Nota: bloqueadas se integran en los bloques por programa; no es necesario un listado aparte

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando materias...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 max-w-lg text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg">Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Mis Materias SystemAIR™</h1>
              <p className="text-gray-400">Completa estas mini‑auditorías para obtener tu mapa de rendimiento.</p>
            </div>
            <button
              onClick={() => navigate('/air')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200"
            >
              ← Volver a AIR
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Progreso general</span>
              <span className="text-sm text-emerald-400">{progress.completed}/{progress.totalAssigned} Completadas</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${progress.percent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Filtros por programa */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button onClick={() => setActiveProgram('all')} className={`btn btn-secondary btn-sm ${activeProgram==='all' ? 'ring-2 ring-cyan-500/50' : ''}`}>Todos</button>
          <button onClick={() => setActiveProgram(1)} className={`btn btn-secondary btn-sm ${activeProgram===1 ? 'ring-2 ring-cyan-500/50' : ''}`}>Prog 1</button>
          <button onClick={() => setActiveProgram(2)} className={`btn btn-secondary btn-sm ${activeProgram===2 ? 'ring-2 ring-cyan-500/50' : ''}`}>Prog 2</button>
          <button onClick={() => setActiveProgram(3)} className={`btn btn-secondary btn-sm ${activeProgram===3 ? 'ring-2 ring-cyan-500/50' : ''}`}>Prog 3</button>
          <button onClick={() => setActiveProgram(4)} className={`btn btn-secondary btn-sm ${activeProgram===4 ? 'ring-2 ring-cyan-500/50' : ''}`}>Prog 4</button>
        </div>

        {/* Leyenda de programas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="hud-card p-3 flex items-center gap-2 text-xs"><span className="badge bg-cyan-900/20 text-cyan-300 border-cyan-800 border">Prog 1</span><span className="text-gray-300">Peak Physical Performance</span></div>
          <div className="hud-card p-3 flex items-center gap-2 text-xs"><span className="badge bg-violet-900/20 text-violet-300 border-violet-800 border">Prog 2</span><span className="text-gray-300">Mind Mastery</span></div>
          <div className="hud-card p-3 flex items-center gap-2 text-xs"><span className="badge bg-amber-900/20 text-amber-300 border-amber-800 border">Prog 3</span><span className="text-gray-300">Emotional Resilience</span></div>
          <div className="hud-card p-3 flex items-center gap-2 text-xs"><span className="badge bg-blue-900/20 text-blue-300 border-blue-800 border">Prog 4</span><span className="text-gray-300">The Master Concept</span></div>
        </div>

        {([1,2,3,4] as const).map((pid) => {
          const sectionItems = parsedAndSortedAll.filter(i => (activeProgram==='all' ? true : getProgramMeta(i._ordinal).id === activeProgram) && getProgramMeta(i._ordinal).id === pid)
          if (sectionItems.length === 0) return null
          const title = getProgramMeta(pid === 4 ? 10 : pid * 3).name
          const assignedInBlock = sectionItems.filter(i => !!i.assignment)
          const completedInBlock = sectionItems.filter(i => i.assignment?.status === 'sent')
          return (
            <div key={`prog-${pid}`} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <span className="text-xs text-gray-500">{completedInBlock.length}/{assignedInBlock.length}/{sectionItems.length}</span>
              </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectionItems.map(({ materia, assignment, _ordinal }, idx) => {
                  const status = assignment ? (assignment.status === 'sent' ? 'completed' : 'assigned') : 'blocked'
                  const badge = Number.isFinite(_ordinal) ? _ordinal : (idx + 1)
                  const program = getProgramMeta(badge)
                  const isOpen = !!expanded[materia.id]
                  return (
            <div
              key={materia.id}
                      className={`group bg-gray-900 rounded-xl p-6 border transition-all duration-200 ${
                        status === 'assigned' || status === 'completed'
                          ? 'hover:border-emerald-600' 
                          : 'opacity-80'
                      } ${program.badgeClass.replace('bg-','border-').replace(' text-',' ').replace(' border-',' border-')}`}
                      onClick={() => setExpanded(prev => ({ ...prev, [materia.id]: !prev[materia.id] }))}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{badge}</span>
                </div>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                </span>
              </div>

                      <h3 className="text-lg font-semibold text-white mb-1">{materia.name}</h3>
                      <div className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border ${program.badgeClass} mb-3`} title={program.name}>
                        {program.short}
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Materia {badge}</p>

                      {(status === 'assigned' || status === 'completed') && (
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'} md:group-hover:max-h-48`}>
                          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300">
                              <div>
                                <div className="text-gray-400">Qué analizas</div>
                                <div className="text-white/90">{HOVER_INFO[materia.slug]?.analiza ?? 'Diagnóstico específico de la materia'}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Dolor</div>
                                <div className="text-white/90">{HOVER_INFO[materia.slug]?.dolor ?? 'Problema clave a detectar'}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Qué obtienes</div>
                                <div className="text-white/90">{HOVER_INFO[materia.slug]?.obtienes ?? 'Resultados e impacto esperables'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {status === 'assigned' && (
                        <button className="w-full btn btn-air text-sm font-semibold" onClick={(e) => { e.stopPropagation(); navigate(`/air/assignments/${materia.slug}`) }}>
                  Iniciar Auditoría
                </button>
                      )}
                      {status === 'completed' && (
                        <div className="text-center text-blue-300 text-sm">✅ Enviada</div>
                      )}
                      {status === 'blocked' && (
                        <div className="text-center text-gray-500 text-sm">🔒 No asignada</div>
                      )}
                    </div>
                  )
                })}
                </div>
            </div>
          )
        })}

        {/* La sección de bloqueadas independiente se elimina: ahora todas aparecen por programa */}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/hub')}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200"
          >
            ← Volver al Hub
          </button>
        </div>
      </div>
    </div>
  )
}
