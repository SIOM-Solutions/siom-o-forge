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
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{materia.name}</h1>
              <p className="text-gray-400">Briefing de diagnóstico: por qué auditar esta materia y cómo impactará en tus resultados.</p>
            </div>
            <button
              onClick={() => navigate('/air/assignments')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200"
            >
              ← Volver a Materias
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">El Dolor</h3>
              <p className="text-gray-300 text-sm">{BRIEFINGS[materia.slug]?.dolor ?? 'Diagnóstico del problema clave en esta materia.'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">La Solución SIOM</h3>
              <p className="text-gray-300 text-sm">{BRIEFINGS[materia.slug]?.solucion ?? 'Protocolos y metodología aplicada para resolverlo.'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">El Impacto</h3>
              <p className="text-gray-300 text-sm">{BRIEFINGS[materia.slug]?.impacto ?? 'Resultados esperables y ventajas operativas.'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Auditoría</h2>
          
          <div className="bg-gray-800 rounded-xl p-4 border-2 border-dashed border-gray-600 text-center mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Cuestionario</h3>
            {materia.typeform_id ? (
              <iframe
                title={`Auditoría ${materia.name}`}
                src={`https://form.typeform.com/to/${materia.typeform_id}`}
                className="w-full h-[70vh] rounded-lg border border-gray-700"
                allow="camera; microphone; autoplay; encrypted-media;"
              />
            ) : (
              <p className="text-gray-400">Cargando cuestionario… Si no aparece, ábrelo en una nueva ventana.</p>
            )}
          </div>

          <div className="text-center">
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
            <p className="text-gray-400 text-sm mt-3">
              Haz clic cuando hayas terminado de responder todas las preguntas
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/air/assignments')}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200"
          >
            ← Volver a Materias
          </button>
        </div>
      </div>
    </div>
  )
}
