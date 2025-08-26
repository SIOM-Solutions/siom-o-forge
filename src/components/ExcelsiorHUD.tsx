import { useExcelsior } from '../contexts/ExcelsiorContext'

export default function ExcelsiorHUD() {
  const { isOpen, close } = useExcelsior()

  if (!isOpen) return null

  return (
    <div
      className="mb-3 mr-1 select-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-gray-900/95 border border-gray-800 rounded-xl shadow-2xl p-3 min-w-[220px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
            <span className="text-sm text-white font-medium">Escuchando</span>
          </div>
          <button
            onClick={close}
            className="text-xs px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200"
          >
            Cerrar
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-300">Asistente activo.</div>
      </div>
    </div>
  )
}


