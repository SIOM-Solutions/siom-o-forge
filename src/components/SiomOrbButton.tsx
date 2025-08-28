import { useEffect } from 'react'
import { useExcelsior } from '../contexts/ExcelsiorContext'
import { voiceEngine } from '../lib/voiceEngine'

export default function SiomOrbButton() {
  const { isOpen, toggle } = useExcelsior()

  useEffect(() => {
    const run = async () => {
      try {
        if (isOpen) {
          await voiceEngine.start()
        } else {
          voiceEngine.stop()
        }
      } catch (e) {
        // noop
      }
    }
    run()
  }, [isOpen])

  const handleClick = async () => {
    if (!isOpen) {
      try { await navigator.mediaDevices.getUserMedia({ audio: true }) } catch {}
      // Desbloquear autoplay en iOS/Safari: intentar play() del audio remoto en gesto de usuario
      try {
        const a = document.getElementById('openai-remote-audio') as HTMLAudioElement | null
        if (a) { a.muted = false; await a.play().catch(() => {}) }
      } catch {}
    }
    toggle()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isOpen}
      aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
      title={isOpen ? 'Cerrar asistente' : 'Pulsa y habla con Excelsior'}
      className={`relative h-12 w-12 rounded-full transition-all duration-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
        isOpen ? 'scale-110 shadow-[0_0_30px_rgba(34,211,238,0.55)]' : 'scale-100'
      }`}
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,0.35) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.6) 100%)',
        boxShadow: 'inset 0 0 18px rgba(34,211,238,0.25)'
      }}
    >
      <span className={`absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/60 to-cyan-600/40 blur-2xl -z-10 ${isOpen ? 'opacity-100 animate-pulse' : 'opacity-70'}`} />
      <span className="absolute inset-0 rounded-full bg-cyan-500/10" />
      <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${isOpen ? 'h-9 w-9' : 'h-7 w-7'} bg-cyan-400/80 transition-all duration-300`} />
    </button>
  )
}


