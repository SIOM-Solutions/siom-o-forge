import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TechBackground from './TechBackground'

export default function WelcomeScreen() {
  const navigate = useNavigate()
  const [isLeaving, setIsLeaving] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    document.title = 'Bienvenido a La Forja | SIOM Solutions'
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    try { v.muted = true; (v as any).playsInline = true } catch {}
    const tryPlay = () => { try { v.play().catch(() => {}) } catch {} }
    if (v.readyState >= 2) tryPlay()
    else v.addEventListener('canplay', tryPlay, { once: true })
    return () => { try { v.removeEventListener('canplay', tryPlay as any) } catch {} }
  }, [])

  const handleContinue = () => {
    setIsLeaving(true)
    window.setTimeout(() => navigate('/hub'), 500)
  }

  return (
    <div className="relative min-h-screen bg-gray-950">
      <TechBackground />
      <div className="relative z-10 min-h-screen w-full grid md:grid-cols-2 gap-10 items-center p-8">
        <div className="text-center md:text-left max-w-3xl mx-auto md:mx-0">
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
            <p className="text-lg md:text-xl text-white font-semibold mb-8 md:mb-10">
              Esto es <span className="italic">ingeniería de precisión</span> aplicada al rendimiento humano. Aquí no ofrecemos un curso online:
              te brindamos un <span className="text-cyan-300">arsenal</span> a tu medida.
            </p>
            <button
              onClick={handleContinue}
              className="max-w-xs md:max-w-none md:w-auto mx-auto md:mx-0 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg shadow-cyan-900/20"
            >
              ACCEDE AL HUB CENTRAL
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isLeaving ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
          transition={{ duration: isLeaving ? 0.4 : 0.8, ease: 'easeOut' }}
          className="max-w-3xl w-full mx-auto md:mx-0"
        >
          <div className="relative rounded-2xl border border-gray-700/70 bg-gray-900/60 backdrop-blur-sm shadow-lg overflow-hidden">
            <video
              src="/images/p4t50UvD9W7ti1DfxPRX7.mp4"
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              ref={videoRef}
              className="w-full h-[240px] sm:h-[300px] md:h-[420px] object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03)' }} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}


