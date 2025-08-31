import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccess } from '../contexts/AccessContext'

export default function HubPage() {
  const navigate = useNavigate()
  const { access, loading: accessLoading } = useAccess()

  useEffect(() => {
    document.title = 'O-Forge — Hub'
  }, [])

  const modules = [
    {
      id: 'air',
      title: 'SystemAIR™',
      description: 'Auditoría Inicial de Rendimiento. Línea base objetiva en 10 áreas clave para priorizar con datos.',
      color: 'from-cyan-500 to-cyan-600',
      href: '/air',
      active: accessLoading ? false : Boolean(access?.air)
    },
    {
      id: 'psitac',
      title: 'SIOM PSITAC™',
      description: 'Inteligencia Táctica de la Personalidad. Decodifica perfiles y dirige con precisión operativa.',
      color: 'from-violet-500 to-violet-600',
      href: '/psitac',
      active: accessLoading ? false : Boolean(access?.psitac)
    },
    {
      id: 'performance',
      title: 'SIOM Performance™',
      description: 'Rendimiento humano táctico. Protocolos de fisiología aplicada para operar bajo presión.',
      color: 'from-emerald-500 to-emerald-600',
      href: '/performance',
      active: accessLoading ? false : Boolean(access?.forge_performance)
    },
    {
      id: 'ops',
      title: 'Centro de Operaciones Estratégicas SIOM™',
      description: 'Playbooks, procesos e IA Multiplataforma para ejecutar con precisión y sin fricción.',
      color: 'from-amber-500 to-amber-600',
      href: '/ops',
      active: accessLoading ? false : Boolean(access?.forge_ops)
    }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Hub Central</h1>
            <p className="text-gray-400">Ecosistema de Inteligencia Híbrida de Élite — SIOM Solutions</p>
          </div>
          <div />
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-white mb-2 tech-glow">Centro de Mando</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">Cuatro divisiones integradas para decidir mejor y ejecutar más rápido: <span className="text-white">SystemAIR</span> (diagnóstico con datos), <span className="text-white">SIOM PSITAC</span> (dirección e influencia), <span className="text-white">Performance</span> (fisiología aplicada) y <span className="text-white">OPS</span> (operaciones y orquestación con IA).</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">Neurociencia</span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">Fisiología</span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">IA Táctica</span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">Operaciones Especiales</span>
          </div>
        </div>

        <div id="modules-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => module.active && navigate(module.href)}
              className={`relative group cursor-pointer h-full hud-card ${
                module.active ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="rounded-2xl p-8 h-full transition-all duration-300 group-hover:scale-[1.01]">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-2 tech-glow">{module.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      module.active 
                        ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800' 
                        : 'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}>
                      {module.active ? 'Activo' : 'Bloqueado'}
                    </span>
                    
                    {module.active && (<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />)}
                  </div>

                  {!module.active && (
                    <div className="mt-3">
                      <a href="mailto:contacto@siomsolutions.com?subject=Solicitud%20de%20acceso%20O‑Forge" className="text-xs text-blue-400 hover:text-blue-300">Solicitar acceso</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
