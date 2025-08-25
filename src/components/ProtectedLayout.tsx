import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ProtectedRoute from './ProtectedRoute'
import TechBackground from './TechBackground'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [showExcelsior, setShowExcelsior] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login')
  }

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-gray-950 text-gray-100">
        <TechBackground />
        <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/hub')} className="text-white font-semibold text-lg">
                O-Forge
              </button>
              <span className="text-xs text-gray-400 border border-gray-800 rounded px-2 py-0.5">SIOM</span>
            </div>
            <nav className="flex items-center gap-2">
              <button onClick={() => setShowExcelsior(true)} className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md">
                Consultar a Excelsior
              </button>
              <button onClick={() => navigate('/hub')} className="px-3 py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800">
                Hub
              </button>
              <button onClick={handleSignOut} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md">
                Cerrar sesión
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>

        {/* Panel Excelsior */}
        {showExcelsior && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowExcelsior(false)} />
            <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-gray-950 border-l border-gray-800 shadow-2xl">
              <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4">
                <span className="text-white font-semibold">Excelsior — Guía de la Plataforma</span>
                <button onClick={() => setShowExcelsior(false)} className="px-2 py-1 text-gray-300 hover:text-white">Cerrar</button>
              </div>
              <div className="h-[calc(100%-3.5rem)]">
                <iframe
                  title="Excelsior Assistant"
                  src={import.meta.env.VITE_EXCELSIOR_URL || 'about:blank'}
                  className="w-full h-full"
                  allow="microphone; clipboard-read; clipboard-write;"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}


