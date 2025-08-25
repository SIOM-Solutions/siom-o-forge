import { useNavigate } from 'react-router-dom'

export default function AirLandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">SystemAIR™ — Auditoría Inicial de Rendimiento</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Diagnóstico 360° de tu rendimiento para identificar brechas y trazar una hoja de ruta con retorno medible.</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                ¿Qué es AIR?
              </h2>
              <p className="text-gray-300 mb-4">SystemAIR es la Auditoría Inicial de Rendimiento en O‑Forge. Es el punto de entrada al ecosistema SIOM: establece tu línea base en 10 áreas críticas y revela qué palancas mover primero para obtener mejoras visibles con el menor esfuerzo y tiempo posible.</p>
              <p className="text-gray-300 mb-6">El resultado es un mapa de brechas y fortalezas con retorno medible, que alimenta tu Learning Path y las siguientes divisiones (PSITAC, Performance y OPS) para acelerar impacto sin fricción operativa. Con los resultados prepararemos tu Learning Path, forjaremos a tus instructores SIOM y podremos alimentar a tus asesores estratégicos. Es un paso crucial que permite perfilar con precisión sin igual tu viaje en SIOM O‑Forge.</p>
              <button
                onClick={() => navigate('/air/assignments')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Ver Mis Materias
              </button>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-800/30">
                <span className="text-4xl font-bold text-white tracking-wide">AIR</span>
              </div>
              <p className="text-gray-400 text-sm">Sistema de Diagnóstico</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">SystemAIR en SIOM O‑Forge</h2>
          <p className="text-gray-300">Como parte del Centro de Operaciones de SIOM Solutions, AIR combina neurociencia, fisiología aplicada e inteligencia artificial para transformar datos en decisiones. El objetivo es simple: aumentar tu capacidad de decidir y ejecutar con calidad sostenida, incluso bajo presión.</p>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Qué evalúa</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Sueño y recuperación</li>
                <li>Acondicionamiento físico</li>
                <li>Nutrición</li>
                <li>Atención y foco</li>
                <li>Dominio del aprendizaje</li>
                <li>Productividad ejecutiva</li>
                <li>Gestión del estrés</li>
                <li>Neuroquímica</li>
                <li>Liderazgo</li>
                <li>The Master Concept</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Cómo usamos los datos</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Privacidad y control: visibles solo para tu equipo autorizado</li>
                <li>KPIs y seguimiento: progreso y ROI operacional</li>
                <li>Learning Path: materias y acciones personalizadas</li>
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">Tiempo: 12–20 min</div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">Formato: cuestionario + micro‑retos</div>
              </div>
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
            className="btn btn-air"
          >
            Comenzar AIR →
          </button>
        </div>
      </div>
    </div>
  )
}
