import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TechBackground from './TechBackground'

export default function WelcomeScreen() {
  const navigate = useNavigate()
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    document.title = 'Bienvenido a La Forja | SIOM Solutions'
  }, [])

  const handleContinue = () => {
    setIsLeaving(true)
    try { supabase.rpc('set_last_location', { p_route: '/hub', p_context: {} as any }).catch(()=>{}) } catch {}
    window.setTimeout(() => navigate('/hub'), 500)
  }

  return (
    <div className="relative min-h-screen bg-gray-950">
      <TechBackground />
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isLeaving ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
          transition={{ duration: isLeaving ? 0.5 : 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLeaving ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
            transition={{ duration: isLeaving ? 0.45 : 0.8, delay: isLeaving ? 0 : 0.2, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Bienvenido a <span className="text-cyan-400">La Forja</span>, Operador.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">
              Has accedido al Ecosistema de Inteligencia Híbrida de Élite de <span className="text-white font-semibold">SIOM Solutions</span>:
              la primera plataforma digital que integra <span className="text-cyan-300">doctrina real de Operaciones Especiales de Acción Directa</span>,
              <span className="text-cyan-300"> Neurociencia Aplicada</span>, <span className="text-cyan-300">Fisiología</span> e
              <span className="text-cyan-300"> Inteligencia Artificial Multiplataforma</span> de manera sinérgica para potenciar tus capacidades
              y obtener <span className="text-white font-semibold">resultados medibles</span>.
            </p>
            <p className="text-lg md:text-xl text-white font-semibold mb-10">
              Esto es <span className="italic">ingeniería de precisión</span> aplicada al rendimiento humano. Aquí no ofrecemos un curso online:
              te brindamos un <span className="text-cyan-300">arsenal</span> a tu medida.
            </p>
            <button
              onClick={handleContinue}
              className="max-w-xs mx-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg shadow-cyan-900/20"
            >
              ACCEDE AL HUB CENTRAL
            </button>
          </motion.div>
        </motion.div>
      </div>
      {/* Excelsior está alojado globalmente en App.tsx */}
    </div>
  )
}


