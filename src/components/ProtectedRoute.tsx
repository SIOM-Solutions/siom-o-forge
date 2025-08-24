import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAccess } from '../contexts/AccessContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredAccess?: 'air' | 'psitac' | 'forge_performance' | 'forge_ops'
}

export default function ProtectedRoute({ children, requiredAccess }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const accessCtx = useAccess()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (requiredAccess && accessCtx) {
    const { access, loading: accessLoading } = accessCtx
    if (accessLoading) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Verificando permisos...</p>
          </div>
        </div>
      )
    }
    const allowed = Boolean(access && access[requiredAccess])
    if (!allowed) {
      return <Navigate to="/hub" replace />
    }
  }

  return <>{children}</>
}
