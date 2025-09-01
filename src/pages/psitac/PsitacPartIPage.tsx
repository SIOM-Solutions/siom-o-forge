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
    if (alias) params.set('alias', alias)
    params.set('lang', 'es')
    return `${base}#${params.toString()}`
  }, [user?.email, user?.id, alias])

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] px-2 py-0.5 rounded-full border bg-violet-900/20 text-violet-300 border-violet-800">PSITAC</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full border bg-gray-800 text-gray-300 border-gray-700">Confidencial</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full border bg-gray-800 text-gray-300 border-gray-700">Tiempo variable</span>
          </div>
          <h1 className="text-3xl font-semibold text-white mb-1">PSITAC — Parte I: Personalidad bajo presión</h1>
          <p className="text-gray-300">Tu perfil conductual cuando la presión sube. <span className="text-cyan-300 font-semibold">Base para dirigir e influir con precisión</span>.</p>
        </div>

        <div className="hud-card p-5 mb-6">
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-cyan-300 mb-1">Qué mide</div>
              <ul className="text-gray-300 list-disc list-inside space-y-1">
                <li>Rasgos dominantes y motivadores</li>
                <li>Respuesta al estrés</li>
              </ul>
            </div>
            <div>
              <div className="text-cyan-300 mb-1">Para qué sirve</div>
              <ul className="text-gray-300 list-disc list-inside space-y-1">
                <li>Mejor autogobierno</li>
                <li>Comunicación efectiva</li>
              </ul>
            </div>
            <div>
              <div className="text-cyan-300 mb-1">Formato</div>
              <ul className="text-gray-300 list-disc list-inside space-y-1">
                <li>Cuestionario online (~50 preguntas)</li>
                <li>Realízalo sin interrupciones</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
          <iframe title="PSITAC Parte I — Personalidad bajo presión" src={url} className="w-full h-[70vh]" allow="camera; microphone; autoplay; encrypted-media;" />
        </div>
      </div>
    </div>
  )
}


