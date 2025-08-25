import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fetchUserAlias } from '../../services/profile'

export default function PsitacPartIPage() {
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
    const base = 'https://fn2811wjgw1.typeform.com/to/S287twfd'
    const params = new URLSearchParams()
    if (user?.email) params.set('email', user.email)
    if (user?.id) params.set('user_id', user.id)
    return `${base}#${params.toString()}`
  }, [user?.email, user?.id])

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-white mb-2">PSITAC — Parte I: Perfil Operativo</h1>
          <p className="text-gray-400">Cargando cuestionario… Si no aparece, <a className="text-blue-400 underline" href={url} target="_blank" rel="noreferrer">ábrelo en una nueva ventana</a>.</p>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
          <iframe title="PSITAC Parte I" src={url} className="w-full h-[70vh]" allow="camera; microphone; autoplay; encrypted-media;" />
        </div>
      </div>
    </div>
  )
}


