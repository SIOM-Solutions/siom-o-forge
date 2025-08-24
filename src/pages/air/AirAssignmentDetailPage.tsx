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
      <div className="min-h-screen bg-gray-950 p-6">
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
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
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
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando auditoría...</p>
        </div>
      </div>
    )
  }

  if (error || !materia) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 max-w-lg text-center">
          <p className="text-red-300 mb-4">{error ?? 'No se pudo cargar la materia'}</p>
          <button onClick={() => navigate('/air/assignments')} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg">Volver</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{materia.name}</h1>
              <p className="text-gray-400">Completa la auditoría para continuar.</p>
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
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Objetivo de la Auditoría</h2>
              <p className="text-gray-300 mb-6">Sigue el cuestionario y responde con honestidad.</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-300">Evaluación personalizada</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-300">Análisis de patrones actuales</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-300">Identificación de oportunidades</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{materia.id}</span>
              </div>
              <p className="text-gray-400">Materia {materia.id}</p>
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
              <p className="text-gray-400">Formulario no disponible.</p>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !assignment}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
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
