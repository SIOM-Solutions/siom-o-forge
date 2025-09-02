import { useParams } from 'react-router-dom'

export default function ForjaSessionPage() {
  const { materiaSlug, dimensionSlug, sessionSlug } = useParams()
  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-1">Sala de Forja</h1>
        <div className="text-gray-400 mb-5 text-sm">{materiaSlug} / {dimensionSlug} / {sessionSlug}</div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Columna izquierda: Visualizador (2/3) */}
          <div className="md:col-span-2 space-y-4">
            <div className="hud-card p-0 overflow-hidden">
              <div className="bg-gray-950/60 border-b border-gray-800 px-4 py-2 text-sm text-gray-400">Visualizador de contenidos</div>
              <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-500">
                <span className="text-sm">(Aquí se renderizará Gamma / Vídeo / URL de la sesión)</span>
              </div>
            </div>

            {/* Chat de texto (debajo, mismo ancho) */}
            <div className="hud-card p-0 overflow-hidden">
              <div className="bg-gray-950/60 border-b border-gray-800 px-4 py-2 text-sm text-gray-400">Chat del instructor (texto)</div>
              <div className="h-64 bg-gray-900 p-4 text-gray-400 text-sm">
                <div className="opacity-70">(UI de chat se integrará en el siguiente paso: authorize + streaming de respuestas)</div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Orbe + Iniciar + KPIs */}
          <div className="space-y-4">
            <div className="hud-card p-5 flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full flex items-center justify-center"
                   style={{ background: 'radial-gradient(closest-side, rgba(34,197,94,0.15), rgba(0,0,0,0))', boxShadow: '0 0 30px rgba(34,197,94,0.15)' }}>
                <div className="w-28 h-28 rounded-full bg-gray-900 border border-emerald-800/60 shadow-inner" />
              </div>
              <button className="btn btn-secondary mt-4">Iniciar instructor</button>
              <div className="mt-2 text-xs text-gray-500">El orbe es visual; inicia con el botón.</div>
            </div>

            <div className="hud-card p-4">
              <div className="text-white font-semibold mb-2">KPIs de la sesión</div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li className="opacity-70">(Aquí cargaremos los KPIs desde Supabase)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


