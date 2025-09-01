import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { loadUserLearningPath, type LpMateria } from '../../services/lp'

export default function PerformanceLandingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [materias, setMaterias] = useState<LpMateria[]>([])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const data = await loadUserLearningPath(user.id)
        if (!cancelled) setMaterias(data)
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'No se pudo cargar el Learning Path')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [user?.id])

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-white mb-2">SIOM Performance™ — Mi Learning Path</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Entrenamientos y protocolos aplicados para operar bajo presión. Vista por <span className="text-white font-semibold">materias → dimensiones → sesiones</span>.</p>
        </div>

        {loading && (
          <div className="hud-card p-6 text-center text-gray-400">Cargando tu Learning Path…</div>
        )}
        {error && (
          <div className="hud-card p-6 text-center text-red-300">{error}</div>
        )}

        {!loading && !error && materias.map((m) => (
          <div key={m.id} className="hud-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-white">{m.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${m.hasAi ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>{m.hasAi ? 'IA disponible' : 'IA no asignada'}</span>
            </div>
            <div className="space-y-4">
              {m.dimensions.map((d) => (
                <div key={d.id} className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-2">{d.name}</div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {d.sessions.map((s) => (
                      <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                        <div className="text-white font-semibold text-sm mb-1">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.slug}</div>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full border ${m.hasAi ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{m.hasAi ? '✓ IA Voz/Chat' : 'IA inactiva'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


