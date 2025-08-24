import { useNavigate } from 'react-router-dom'

export default function AirAssignmentsPage() {
  const navigate = useNavigate()

  const materias = [
    { id: 1, slug: 'm1-sueno', name: 'M1: Recuperación Estratégica de Élite', status: 'assigned', description: 'Optimización del sueño y recuperación' },
    { id: 2, slug: 'm2-acondicionamiento', name: 'M2: Acondicionamiento Físico', status: 'assigned', description: 'Preparación física y resistencia' },
    { id: 3, slug: 'm3-nutricion', name: 'M3: Nutrición de Alto Rendimiento', status: 'assigned', description: 'Alimentación para máximo rendimiento' },
    { id: 4, slug: 'm4-atencion', name: 'M4: Atención y Enfoque', status: 'blocked', description: 'Concentración y gestión de distracciones' },
    { id: 5, slug: 'm5-aprendizaje', name: 'M5: Aprendizaje Acelerado', status: 'blocked', description: 'Técnicas de estudio y retención' },
    { id: 6, slug: 'm6-productividad', name: 'M6: Productividad Sistémica', status: 'blocked', description: 'Organización y gestión del tiempo' },
    { id: 7, slug: 'm7-estres', name: 'M7: Gestión del Estrés', status: 'blocked', description: 'Control emocional y resiliencia' },
    { id: 8, slug: 'm8-comunicacion', name: 'M8: Comunicación Efectiva', status: 'blocked', description: 'Habilidades de presentación y oratoria' },
    { id: 9, slug: 'm9-liderazgo', name: 'M9: Liderazgo Estratégico', status: 'blocked', description: 'Gestión de equipos y proyectos' },
    { id: 10, slug: 'm10-mastery', name: 'M10: Maestría Personal', status: 'blocked', description: 'Desarrollo de expertise y excelencia' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-emerald-900/20 text-emerald-400 border-emerald-800'
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
      case 'blocked':
        return 'Bloqueada'
      default:
        return 'Pendiente'
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Materias AIR</h1>
              <p className="text-gray-400">Tu catálogo de auditorías disponibles</p>
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
              <span className="text-sm text-gray-400">Progreso General</span>
              <span className="text-sm text-emerald-400">3/10 Completadas</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materias.map((materia) => (
            <div
              key={materia.id}
              className={`bg-gray-900 rounded-xl p-6 border border-gray-800 transition-all duration-200 ${
                materia.status === 'assigned' 
                  ? 'hover:border-emerald-600 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => materia.status === 'assigned' && navigate(`/air/assignments/${materia.slug}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{materia.id}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(materia.status)}`}>
                  {getStatusText(materia.status)}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{materia.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{materia.description}</p>

              {materia.status === 'assigned' ? (
                <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                  Iniciar Auditoría
                </button>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  🔒 Módulo Bloqueado
                </div>
              )}
            </div>
          ))}
        </div>

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
