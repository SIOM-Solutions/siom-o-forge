import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function AirAssignmentDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const materia = {
    id: 1,
    slug: slug || 'm1-sueno',
    name: 'M1: Recuperación Estratégica de Élite',
    description: 'Optimización del sueño y recuperación para máximo rendimiento',
    objective: 'Identificar patrones de sueño y recuperación para optimizar tu rendimiento diario',
    typeformId: 'fn2811wjgw1',
    status: 'pending'
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    setTimeout(() => {
      setIsSubmitted(true)
      setIsSubmitting(false)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-emerald-900/20 border border-emerald-800 rounded-2xl p-8 mb-6">
            <div className="w-20 h-20 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">¡Auditoría Enviada!</h1>
            <p className="text-emerald-300 text-lg mb-6">
              Has completado exitosamente la auditoría de {materia.name}
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

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{materia.name}</h1>
              <p className="text-gray-400">{materia.description}</p>
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
              <p className="text-gray-300 mb-6">{materia.objective}</p>
              
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
          
          <div className="bg-gray-800 rounded-xl p-8 border-2 border-dashed border-gray-600 text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Typeform de Auditoría</h3>
            <p className="text-gray-400 mb-4">
              Aquí se embebrá el Typeform de {materia.name}
            </p>
            <p className="text-sm text-gray-500">
              ID: {materia.typeformId} | Estado: {materia.status}
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                'He Completado la Auditoría'
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
