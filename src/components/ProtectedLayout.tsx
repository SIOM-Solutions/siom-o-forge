import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ExcelsiorHost from './ExcelsiorHost'
import ProtectedRoute from './ProtectedRoute'
import TechBackground from './TechBackground'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Guardar última ubicación del usuario en Supabase (RPC sugerida: set_last_location)
  useEffect(() => {
    const save = async () => {
      try { await (supabase as any).rpc('set_last_location', { p_path: location.pathname }) } catch {}
    }
    save()
  }, [location.pathname])

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
                Hub
              </button>
              <span className="text-xs text-gray-400 border border-gray-800 rounded px-2 py-0.5">SIOM</span>
            </div>
            <nav className="flex items-center gap-2">
              <button onClick={() => navigate('/air/assignments')} className="px-3 py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800">AIR</button>
              <button onClick={() => navigate('/psitac')} className="px-3 py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800">PSITAC</button>
              <button onClick={() => navigate('/performance')} className="px-3 py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800">Performance</button>
              <button onClick={() => navigate('/ops')} className="px-3 py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800">OPS</button>
              <button onClick={() => navigate('/downloads')} className="px-3 py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800">Descargas</button>
              <button onClick={handleSignOut} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md">
                Cerrar sesión
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>

        {/* Montar el widget solo en zona protegida y fuera de salas dedicadas */}
        {!(location.pathname.startsWith('/forja/') || location.pathname.startsWith('/ops/sala/')) && (
          <ExcelsiorHost />
        )}
      </div>
    </ProtectedRoute>
  )
}


