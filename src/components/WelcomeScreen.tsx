import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TechBackground from './TechBackground'

export default function WelcomeScreen() {
  const navigate = useNavigate()
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    document.title = 'Bienvenido a O‑Forge | SIOM Solutions'
  }, [])

  const handleContinue = () => {
    setIsLeaving(true)
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Bienvenido a <span className="text-cyan-400">O‑Forge</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">
              Has accedido al Ecosistema de Inteligencia Híbrida de Élite de <span className="text-white font-semibold">SIOM Solutions</span>:
              una plataforma digital que integra neurociencia, fisiología, IA híbrida aplicada y doctrina de operaciones especiales
              para elevar tu rendimiento al siguiente nivel.
            </p>
            <p className="text-lg md:text-xl text-white font-bold italic mb-10">
              Ingeniería de precisión para decidir mejor y ejecutar más rápido.
            </p>
            <button
              onClick={handleContinue}
              className="max-w-xs mx-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ACCEDER AL CENTRO DE MANDO
            </button>
          </motion.div>
        </motion.div>
      </div>
      {/* Excelsior está alojado globalmente en App.tsx */}
    </div>
  )
}


