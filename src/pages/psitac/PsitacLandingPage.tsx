import { useNavigate } from 'react-router-dom'

export default function PsitacLandingPage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-white mb-3">PSITAC — Inteligencia Táctica de la Personalidad</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Evalúa patrones de personalidad y comportamiento para mejorar comunicación, influencia y toma de decisiones en entornos de alta presión.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white mb-2">PSITAC — Parte I: Perfil Operativo</h3>
            <p className="text-gray-400 mb-4">Cuestionario base para tu perfil conductual y rasgos dominantes en contexto profesional.</p>
            <button className="btn btn-psitac" onClick={() => navigate('/psitac/parte-i')}>Iniciar Parte I</button>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white mb-2">PSITAC — Parte II: Patrones de Influencia</h3>
            <p className="text-gray-400 mb-4">Escenarios tácticos para evaluar estilo de comunicación, negociación y lectura del otro.</p>
            <button className="btn btn-psitac" onClick={() => navigate('/psitac/parte-ii')}>Iniciar Parte II</button>
          </div>
        </div>
      </div>
    </div>
  )
}


