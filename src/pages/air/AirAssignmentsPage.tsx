import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { fetchMateriasWithUserAssignments, type UserMateriaAssignment } from '../../services/air'

export default function AirAssignmentsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState<UserMateriaAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchMateriasWithUserAssignments(user.id)
        if (!cancelled) setItems(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Error cargando materias')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user?.id])

  const progress = useMemo(() => {
    const totalAssigned = items.filter(i => !!i.assignment).length
    const completed = items.filter(i => i.assignment?.status === 'sent').length
    const percent = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0
    return { completed, totalAssigned, percent }
  }, [items])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-emerald-900/20 text-emerald-400 border-emerald-800'
      case 'completed':
        return 'bg-blue-900/20 text-blue-300 border-blue-800'
      case 'blocked':
        return 'bg-gray-800 text-gray-500 border-gray-700'
      default:
        return 'bg-gray-800 text-gray-500 border-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'Asignada'
      case 'completed':
        return 'Completada'
      case 'blocked':
        return 'Bloqueada'
      default:
        return 'Pendiente'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando materias...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 max-w-lg text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg">Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Materias AIR</h1>
              <p className="text-gray-400">Tu catálogo de auditorías disponibles</p>
            </div>
            <button
              onClick={() => navigate('/air')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200"
            >
              ← Volver a AIR
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Progreso General</span>
              <span className="text-sm text-emerald-400">{progress.completed}/{progress.totalAssigned} Completadas</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${progress.percent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ materia, assignment }) => {
            const status = assignment ? (assignment.status === 'sent' ? 'completed' : 'assigned') : 'blocked'
            return (
            <div
              key={materia.id}
              className={`bg-gray-900 rounded-xl p-6 border border-gray-800 transition-all duration-200 ${
                status === 'assigned' || status === 'completed'
                  ? 'hover:border-emerald-600 cursor-pointer' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => (status === 'assigned' || status === 'completed') && navigate(`/air/assignments/${materia.slug}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{materia.id}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{materia.name}</h3>
              <p className="text-gray-400 text-sm mb-4">Materia {materia.id}</p>

              {status === 'assigned' && (
                <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                  Iniciar Auditoría
                </button>
              )}
              {status === 'completed' && (
                <div className="text-center text-blue-300 text-sm">✅ Enviada</div>
              )}
              {status === 'blocked' && (
                <div className="text-center text-gray-500 text-sm">🔒 No asignada</div>
              )}
            </div>
          )})}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/hub')}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200"
          >
            ← Volver al Hub
          </button>
        </div>
      </div>
    </div>
  )
}
