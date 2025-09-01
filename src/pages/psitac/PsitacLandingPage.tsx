import { useNavigate } from 'react-router-dom'

export default function PsitacLandingPage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-white mb-2">Test SIOM PSITAC™ — Perfil táctico de liderazgo & personalidad</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">“<span className="text-cyan-300 font-semibold">Qué tipo de operador eres bajo presión</span>”.</p>
        </div>

        <div className="hud-card p-5 mb-8">
          <div className="grid md:grid-cols-4 gap-4 items-stretch">
            <div className="md:col-span-3">
              <ul className="text-gray-300 space-y-1 mb-3">
                <li>• Evalúa <span className="text-white font-semibold">estilo de liderazgo</span>, patrones de <span className="text-white font-semibold">influencia y persuasión</span>, perfiles psicológicos, tolerancia al estrés y <span className="text-white font-semibold">sesgos críticos</span>.</li>
                <li>• Genera un <span className="text-white font-semibold">perfil operativo</span> que alimenta decisiones tácticas y rutas de intervención.</li>
                <li>• Actúa como <span className="text-white font-semibold">puente</span> entre la formación (<span className="text-cyan-300">Performance</span>) y la acción estratégica (<span className="text-cyan-300">OPS</span>).</li>
              </ul>
              <p className="text-gray-400 text-sm">PSITAC es un <span className="text-white font-semibold">Test Psicométrico‑Táctico propietario</span> de SIOM Solutions. Consta de dos partes: primero <span className="text-white font-semibold">personalidad bajo presión</span>; después, <span className="text-white font-semibold">auditoría de conocimientos tácticos</span> (liderazgo, negociación, análisis de personalidad, influencia y entorno organizacional). El resultado alimenta a tus asesores tácticos para ofrecerte <span className="text-cyan-300 font-semibold">soporte operativo 24/7</span>.</p>
            </div>
            <div className="md:col-span-1">
              <div className="rounded-xl overflow-hidden border border-gray-800 h-full">
                <img src="/images/psitac/psitac-hero.jpg" alt="Test SIOM PSITAC™ — Perfil táctico de liderazgo & personalidad" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white mb-2">PSITAC — Parte I: Perfil Operativo</h3>
            <p className="text-gray-300 mb-3">Personalidad bajo presión: rasgos dominantes y estilo base en contexto profesional.</p>
            <ul className="text-sm text-gray-400 mb-4 list-disc list-inside">
              <li>Rasgos y motivadores</li>
              <li>Patrones de respuesta al estrés</li>
            </ul>
            <button className="btn btn-psitac" onClick={() => navigate('/psitac/parte-i')}>Iniciar Parte I</button>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white mb-2">PSITAC — Parte II: Patrones de Influencia</h3>
            <p className="text-gray-300 mb-3">Escenarios tácticos para evaluar liderazgo, comunicación, negociación e influencia.</p>
            <ul className="text-sm text-gray-400 mb-4 list-disc list-inside">
              <li>Lectura del otro y sesgos</li>
              <li>Dirección e impacto organizacional</li>
            </ul>
            <button className="btn btn-psitac" onClick={() => navigate('/psitac/parte-ii')}>Iniciar Parte II</button>
          </div>
        </div>
      </div>
    </div>
  )
}


