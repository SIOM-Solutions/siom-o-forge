import { useNavigate } from 'react-router-dom'

export default function AirLandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Auditoría Inicial de Rendimiento</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            El primer paso para optimizar tu rendimiento y alcanzar tu máximo potencial
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                ¿Qué es AIR?
              </h2>
              <p className="text-gray-300 mb-6">
                AIR es nuestro sistema de diagnóstico integral que evalúa tu rendimiento actual 
                en 10 áreas clave para identificar oportunidades de mejora y crear un plan 
                personalizado de desarrollo.
              </p>
              <button
                onClick={() => navigate('/air/assignments')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Ver Mis Materias
              </button>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">AIR</span>
              </div>
              <p className="text-gray-400 text-sm">Sistema de Diagnóstico</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Diagnóstico</h3>
            <p className="text-gray-400 text-sm">
              Evaluación completa de tu rendimiento actual en 10 áreas clave
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Análisis</h3>
            <p className="text-gray-400 text-sm">
              Identificación de fortalezas y oportunidades de mejora
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Plan</h3>
            <p className="text-gray-400 text-sm">
              Desarrollo de un Learning Path personalizado para tu crecimiento
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/hub')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200 mr-4"
          >
            ← Volver al Hub
          </button>
          <button
            onClick={() => navigate('/air/assignments')}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Comenzar AIR →
          </button>
        </div>
      </div>
    </div>
  )
}
