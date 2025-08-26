import { useExcelsior } from '../contexts/ExcelsiorContext'

export default function SiomOrbButton() {
  const { isOpen, toggle } = useExcelsior()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isOpen}
      aria-label={isOpen ? 'Cerrar Excelsior' : 'Abrir Excelsior'}
      className={`relative h-14 w-14 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
        isOpen ? 'scale-105' : 'scale-100'
      }`}
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,0.35) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.6) 100%)',
        boxShadow: '0 0 24px rgba(34,211,238,0.45), inset 0 0 18px rgba(34,211,238,0.25)'
      }}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/60 to-cyan-600/40 blur-2xl -z-10" />
      <span className="absolute inset-0 rounded-full bg-cyan-500/10" />
      <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-cyan-400/80 ${
        isOpen ? 'animate-ping' : ''
      }`} />
      <span className="absolute bottom-1 text-[10px] text-white/80 font-semibold w-full text-center select-none">
        EXCELSIOR
      </span>
    </button>
  )
}


