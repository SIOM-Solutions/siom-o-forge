import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fetchUserAlias } from '../../services/profile'

export default function PsitacPartIIPage() {
  const { user } = useAuth()
  const [alias, setAlias] = useState<string>('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) return
      const prof = await fetchUserAlias(user.id)
      if (mounted) setAlias(prof?.alias ?? user.email ?? '')
    }
    load()
    return () => { mounted = false }
  }, [user?.id])

  const url = useMemo(() => {
    const base = 'https://fn2811wjgw1.typeform.com/to/yIJKAML8'
    const params = new URLSearchParams()
    if (user?.id) params.set('user_id', user.id)
    if (user?.email) params.set('email', user.email)
    if (alias) params.set('alias', alias)
    // placeholders avanzados; si existen en vuestra DB, podemos rellenar
    // assignment_id, materia, project_id, cohort, form_version, lang
    params.set('lang', 'es')
    return `${base}#${params.toString()}`
  }, [user?.email, user?.id, alias])

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-white mb-2">PSITAC — Parte II: Patrones de influencia y liderazgo</h1>
          <p className="text-gray-400">Cargando cuestionario… Si no aparece, <a className="text-blue-400 underline" href={url} target="_blank" rel="noreferrer">ábrelo en una nueva ventana</a>.</p>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
          <iframe title="PSITAC Parte II — Patrones de influencia y liderazgo" src={url} className="w-full h-[70vh]" allow="camera; microphone; autoplay; encrypted-media;" />
        </div>
      </div>
    </div>
  )
}


