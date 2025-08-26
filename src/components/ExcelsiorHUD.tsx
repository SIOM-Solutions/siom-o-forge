import { useExcelsior } from '../contexts/ExcelsiorContext'

export default function ExcelsiorHUD() {
  const { isOpen } = useExcelsior()

  if (!isOpen) return null

  return (
    <div
      className="mb-3 mr-1 select-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-gray-900/95 border border-gray-800 rounded-xl shadow-2xl p-3 min-w-[180px]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
          </span>
          <span className="text-sm text-white font-medium">Escuchando</span>
        </div>
      </div>
    </div>
  )
}


