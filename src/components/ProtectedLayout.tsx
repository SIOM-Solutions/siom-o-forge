import { Outlet, useNavigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/hub')} className="text-white font-semibold text-lg">
                O-Forge
              </button>
              <span className="text-xs text-gray-400 border border-gray-800 rounded px-2 py-0.5">SIOM</span>
            </div>
            <nav className="flex items-center gap-2">
              <button onClick={() => navigate('/hub')} className="px-3 py-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800">
                Hub
              </button>
              <button onClick={handleSignOut} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md">
                Cerrar sesión
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  )
}


