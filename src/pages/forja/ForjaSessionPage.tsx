import { useParams } from 'react-router-dom'

export default function ForjaSessionPage() {
  const { materiaSlug, dimensionSlug, sessionSlug } = useParams()
  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-2">Sala de Forja</h1>
        <div className="text-gray-300 mb-4">{materiaSlug} / {dimensionSlug} / {sessionSlug}</div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="hud-card p-4">
              <div className="text-white font-semibold mb-1">Objetivo de la sesión</div>
              <p className="text-gray-300 text-sm">Transformar diagnóstico en acción operativa. Enfócate en la palanca de mayor impacto.</p>
            </div>
            <div className="hud-card p-4">
              <div className="text-white font-semibold mb-1">Acciones</div>
              <div className="flex gap-2">
                <button className="btn btn-secondary">Iniciar Voz</button>
                <button className="btn btn-secondary">Iniciar Chat</button>
                <button className="btn">Finalizar sesión</button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="hud-card p-4">
              <div className="text-white font-semibold mb-1">Límites y ventana</div>
              <p className="text-gray-300 text-sm">Se muestran en la materia dentro del Learning Path. Aquí podrás ver el restante al autorizar.</p>
            </div>
            <div className="hud-card p-4">
              <div className="text-white font-semibold mb-1">Notas</div>
              <p className="text-gray-300 text-sm">Guarda acuerdos y próximos pasos para continuidad estratégica.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


