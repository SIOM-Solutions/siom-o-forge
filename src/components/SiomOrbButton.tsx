import { useEffect } from 'react'
import { useExcelsior } from '../contexts/ExcelsiorContext'
import { startRealtime, stopRealtime } from '../lib/openaiRealtime'

export default function SiomOrbButton() {
  const { isOpen, toggle } = useExcelsior()

  useEffect(() => {
    const run = async () => {
      try {
        if (isOpen) {
          // Solicitar permiso antes de iniciar la oferta para forzar prompt del navegador
          await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {})
          await startRealtime()
        } else {
          stopRealtime()
        }
      } catch (e) {
        // noop
      }
    }
    run()
  }, [isOpen])

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isOpen}
      aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
      title={isOpen ? 'Cerrar asistente' : 'Pulsa y habla con Excelsior'}
      className={`relative h-12 w-12 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
        isOpen ? 'scale-105 shadow-[0_0_24px_rgba(34,211,238,0.45)]' : 'scale-100'
      }`}
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,0.35) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.6) 100%)',
        boxShadow: 'inset 0 0 18px rgba(34,211,238,0.25)'
      }}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/60 to-cyan-600/40 blur-2xl -z-10" />
      <span className="absolute inset-0 rounded-full bg-cyan-500/10" />
      <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-cyan-400/80 ${
        isOpen ? 'animate-ping' : ''
      }`} />
    </button>
  )
}


