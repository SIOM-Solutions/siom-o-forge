import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useAccess } from '../contexts/AccessContext'

export default function HubPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const { access, loading: accessLoading } = useAccess()

  const modules = [
    {
      id: 'air',
      title: 'AIR',
      description: 'Auditoría Inicial de Rendimiento',
      color: 'from-emerald-500 to-emerald-600',
      href: '/air',
      active: accessLoading ? false : Boolean(access?.air)
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'Optimización de Rendimiento',
      color: 'from-cyan-500 to-cyan-600',
      href: '#',
      active: accessLoading ? false : Boolean(access?.forge_performance)
    },
    {
      id: 'psitac',
      title: 'PSITAC',
      description: 'Protocolo de Seguridad',
      color: 'from-amber-500 to-amber-600',
      href: '#',
      active: accessLoading ? false : Boolean(access?.psitac)
    },
    {
      id: 'ops',
      title: 'OPS',
      description: 'Operaciones y Mantenimiento',
      color: 'from-red-500 to-red-600',
      href: '#',
      active: accessLoading ? false : Boolean(access?.forge_ops)
    }
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login')
  }

  return (
    <div>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">O-Forge</h1>
            <p className="text-gray-400">Centro de Operaciones SIOM</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => module.active && navigate(module.href)}
              className={`relative group cursor-pointer ${
                module.active ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className={`
                bg-gray-900 rounded-2xl p-6 border border-gray-800 
                transition-all duration-300 group-hover:scale-105
                ${module.active ? 'hover:border-gray-600' : ''}
              `}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      module.active 
                        ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800' 
                        : 'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}>
                      {module.active ? 'Activo' : 'Bloqueado'}
                    </span>
                    
                    {module.active && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Bienvenido al Centro de Operaciones
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Selecciona un módulo para comenzar. AIR está activo y listo para tu auditoría inicial de rendimiento.
          </p>
        </div>
      </div>
    </div>
  )
}
