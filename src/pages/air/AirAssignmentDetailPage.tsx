import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fetchAssignmentForUserAndMateria, fetchMateriaBySlug, markAssignmentAsSent } from '../../services/air'

export default function AirAssignmentDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [materia, setMateria] = useState<{ id: number; slug: string; name: string; typeform_id: string } | null>(null)
  const [assignment, setAssignment] = useState<{ id: number; status: 'pending' | 'sent' } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!slug) return
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const m = await fetchMateriaBySlug(slug)
        if (!m) {
          throw new Error('Materia no encontrada')
        }
        const a = await fetchAssignmentForUserAndMateria(user.id, m.id)
        if (!cancelled) {
          setMateria({ id: m.id, slug: m.slug, name: m.name, typeform_id: m.typeform_id })
          setAssignment(a ? { id: a.id, status: a.status } : null)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Error cargando la auditoría')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [slug, user?.id])

  // Títulos y briefings por materia (copys UI, sin lógica)
  const BRIEFINGS: Record<string, { dolor: string; solucion: string; impacto: string }> = {
    M1_SUENO: {
      dolor: 'La privación de sueño mina claridad mental y decisión; incrementa errores y ralentiza tu día.',
      solucion: 'Reajuste de hábitos y ritmos circadianos con ciencia de fisiología de élite; protocolos prácticos para dormir más profundo y recuperar mejor.',
      impacto: 'Decisiones más claras y rápidas, energía estable y menor desgaste cognitivo a diario.',
    },
    M2_ACOND: {
      dolor: 'Sedentarismo = menos energía, peor tolerancia al estrés y más bajas.',
      solucion: 'Plan de “atleta corporativo” eficiente en tiempo (fuerza, cardio, movilidad) con seguimiento.',
      impacto: '+Productividad, mejor estado de ánimo y resiliencia física y mental.',
    },
    M3_NUTRI: {
      dolor: 'Picos y valles de glucosa → “niebla mental”, fatiga y peor enfoque.',
      solucion: 'Crononutrición y elecciones de alta densidad nutritiva para energía sostenida.',
      impacto: 'Enfoque estable todo el día, menos bajones y mejor salud a medio plazo.',
    },
    M4_ATENCION: {
      dolor: 'Distracciones constantes y multitarea rompen el trabajo profundo.',
      solucion: 'Entrenamiento de foco (Deep Work), time‑blocking y control del entorno digital.',
      impacto: 'Más output de calidad en menos tiempo; menos estrés por tareas arrastradas.',
    },
    M5_APREND: {
      dolor: 'Falta de método para aprender rápido lo crítico; brechas que frenan.',
      solucion: 'Meta‑aprendizaje, práctica espaciada y active recall integrados a tu agenda.',
      impacto: 'Dominas habilidades antes y mejor; cultura de aprendizaje continuo real.',
    },
    M6_PROD: {
      dolor: 'Mucho “trabajo sobre el trabajo”, poca estrategia; agendas reactivas.',
      solucion: 'Priorización, delegación inteligente, rituales semanales y bloques de foco.',
      impacto: 'Ciclos de decisión más cortos, menos incendios y más objetivos clave cumplidos.',
    },
    M7_ESTRES: {
      dolor: 'Estrés crónico → peor decisión, más errores y fuga de talento.',
      solucion: 'Autorregulación (respiración, coherencia cardíaca, mindfulness ejecutivo) y exposición estratégica.',
      impacto: 'Resiliencia operativa; rendimiento sostenido incluso bajo presión alta.',
    },
    M8_NEURO: {
      dolor: 'Altibajos de motivación/ánimo por hábitos y estímulos; falta de control interno.',
      solucion: 'Optimización de dopamina/serotonina/cortisol con rutinas, luz, descanso, ejercicio y detox digital.',
      impacto: 'Energía y foco más estables; autocontrol emocional y constancia de rendimiento.',
    },
    M9_LIDER: {
      dolor: 'Gaps de liderazgo → desmotivación, silos y estrategias que no se ejecutan.',
      solucion: 'Autoliderazgo, equipos de alto rendimiento, influencia organizacional y liderazgo en crisis.',
      impacto: 'Equipos comprometidos, mejores decisiones y ejecución más rápida y alineada.',
    },
    M10_MASTER: {
      dolor: 'Mejoras puntuales sin sistema; todo vuelve a la línea base.',
      solucion: 'Integrar prácticas SIOM en cultura, procesos y KPIs para que perduren.',
      impacto: 'Ventaja estructural: alto rendimiento institucionalizado y sostenible.',
    },
  }

  useEffect(() => {
    if (materia) document.title = `O-Forge — ${materia.name}`
  }, [materia?.name])

  // Programa al que pertenece cada materia según ordinal (1-3, 4-6, 7-9, 10)
  const getProgramMeta = (ordinal: number) => {
    if (ordinal >= 1 && ordinal <= 3) {
      return { id: 1, name: 'Programa 1 — Peak Physical Performance', short: 'Prog 1 · Peak Physical', badgeClass: 'bg-cyan-900/20 text-cyan-300 border-cyan-800' }
    }
    if (ordinal >= 4 && ordinal <= 6) {
      return { id: 2, name: 'Programa 2 — Mind Mastery for Top Performers', short: 'Prog 2 · Mind Mastery', badgeClass: 'bg-violet-900/20 text-violet-300 border-violet-800' }
    }
    if (ordinal >= 7 && ordinal <= 9) {
      return { id: 3, name: 'Programa 3 — Emotional Resilience', short: 'Prog 3 · Resilience', badgeClass: 'bg-amber-900/20 text-amber-300 border-amber-800' }
    }
    return { id: 4, name: 'Programa 4 — The Master Concept', short: 'Prog 4 · Master Concept', badgeClass: 'bg-blue-900/20 text-blue-300 border-blue-800' }
  }

  const handleSubmit = async () => {
    if (!assignment) return
    setIsSubmitting(true)
    setError(null)
    try {
      await markAssignmentAsSent(assignment.id)
      setAssignment({ ...assignment, status: 'sent' })
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo enviar la auditoría')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (assignment && assignment.status === 'sent') {
    return (
      <div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-emerald-900/20 border border-emerald-800 rounded-2xl p-8 mb-6">
            <div className="w-20 h-20 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">¡Auditoría Enviada!</h1>
            <p className="text-emerald-300 text-lg mb-6">
              Has completado exitosamente la auditoría de {materia?.name}
            </p>
            <p className="text-gray-400 mb-8">
              Tus respuestas han sido enviadas y servirán para optimizar tu aprendizaje. 
              Cuando completes todas las auditorías asignadas, recibirás tu Learning Path personalizado.
            </p>
            <button
              onClick={() => navigate('/air/assignments')}
              className="btn btn-air btn-lg"
            >
              Ver Otras Materias
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando auditoría...</p>
        </div>
      </div>
    )
  }

  if (error || !materia) {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 max-w-lg text-center">
          <p className="text-red-300 mb-4">{error ?? 'No se pudo cargar la materia'}</p>
          <button onClick={() => navigate('/air/assignments')} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg">Volver</button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {(() => {
                const match = materia.slug.match(/^M(\d+)_/)
                const ordinal = match ? parseInt(match[1], 10) : 0
                const prog = getProgramMeta(ordinal)
                return (
                  <span className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-full border ${prog.badgeClass}`} title={prog.name}>{prog.short}</span>
                )
              })()}
              <span className={`text-[11px] px-2 py-0.5 rounded-full border ${assignment?.status === 'sent' ? 'bg-blue-900/20 text-blue-300 border-blue-800' : 'bg-emerald-900/20 text-emerald-400 border-emerald-800'}`}>
                {assignment?.status === 'sent' ? 'Enviada' : 'Asignada'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">{materia.name}</h1>
            <p className="text-gray-400">Briefing de diagnóstico: por qué auditar esta materia y cómo impactará en tus resultados.</p>
          </div>
          <button onClick={() => navigate('/air/assignments')} className="btn btn-secondary">← Materias</button>
        </div>

        {/* Layout principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="hud-card p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">El Dolor</div>
                  <p className="text-gray-300 text-sm">{BRIEFINGS[materia.slug]?.dolor ?? 'Diagnóstico del problema clave en esta materia.'}</p>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">La Solución SIOM</div>
                  <p className="text-gray-300 text-sm">{BRIEFINGS[materia.slug]?.solucion ?? 'Protocolos y metodología aplicada para resolverlo.'}</p>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">El Impacto</div>
                  <p className="text-gray-300 text-sm">{BRIEFINGS[materia.slug]?.impacto ?? 'Resultados esperables y ventajas operativas.'}</p>
                </div>
              </div>
            </div>

            <div className="hud-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Auditoría</h2>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="bg-gray-800/60 border border-gray-700 rounded px-2 py-0.5">~50 preguntas</span>
                  <span className="bg-gray-800/60 border border-gray-700 rounded px-2 py-0.5">Tiempo variable</span>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
                {materia.typeform_id ? (
                  <iframe
                    title={`Auditoría ${materia.name}`}
                    src={`https://form.typeform.com/to/${materia.typeform_id}`}
                    className="w-full h-[70vh]"
                    allow="camera; microphone; autoplay; encrypted-media;"
                  />
                ) : (
                  <div className="p-6 text-gray-400">Cargando cuestionario… Si no aparece, ábrelo en una nueva ventana.</div>
                )}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !assignment}
                  className="btn btn-air btn-lg disabled:opacity-60 flex items-center justify-center gap-2 mx-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    assignment ? 'He Completado la Auditoría' : 'No tienes esta materia asignada'
                  )}
                </button>
                <p className="text-gray-400 text-sm mt-3">Pulsa cuando hayas terminado de responder todas las preguntas.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="hud-card p-5">
              <div className="text-sm text-gray-400 mb-2">Resumen de la materia</div>
              <ul className="text-sm text-gray-300 space-y-2">
                <li><span className="text-gray-400">Qué analizas:</span> <span className="text-white/90">{BRIEFINGS[materia.slug]?.dolor ? 'Factores clave de rendimiento' : 'Diagnóstico específico'}</span></li>
                <li><span className="text-gray-400">Dolor:</span> <span className="text-white/90">{BRIEFINGS[materia.slug]?.dolor ?? '—'}</span></li>
                <li><span className="text-gray-400">Qué obtienes:</span> <span className="text-white/90">{BRIEFINGS[materia.slug]?.impacto ?? '—'}</span></li>
              </ul>
            </div>
            <div className="hud-card p-5">
              <div className="text-sm text-gray-400 mb-2">Recomendaciones</div>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                <li>Responde con calma y sinceridad.</li>
                <li>Evita interrupciones para mantener el foco.</li>
                <li>Si se corta, recarga la página y continúa.</li>
              </ul>
            </div>
            <div className="hud-card p-5">
              <div className="text-sm text-gray-400 mb-2">Soporte</div>
              <a href="mailto:contacto@siomsolutions.com" className="text-blue-300 hover:text-blue-200 text-sm">contacto@siomsolutions.com</a>
            </div>
          </aside>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/air/assignments')} className="btn btn-secondary">← Volver a Materias</button>
        </div>
      </div>
    </div>
  )
}
