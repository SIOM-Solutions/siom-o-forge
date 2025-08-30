import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ExcelsiorHost() {
  const location = useLocation()

  const hideOn = [/^\/performance\/forja/, /^\/ops\/sesion/, /^\/lab\/eleven/, /^\/lab\/realtime/]
  const hidden = hideOn.some((re) => re.test(location.pathname))

  useEffect(() => {
    if (hidden) return

    const scriptId = 'elevenlabs-convai-script'
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
      s.async = true
      s.id = scriptId
      document.body.appendChild(s)
    }

    const agentId = (import.meta.env as any).VITE_EXCELSIOR_AGENT_ID as string | undefined
    if (!agentId) return

    const elId = 'siom-eleven-widget'
    let conv = document.getElementById(elId) as HTMLElement | null
    if (!conv) {
      conv = document.createElement('elevenlabs-convai') as unknown as HTMLElement
      conv.id = elId
      conv.setAttribute('agent-id', agentId)
      // No forzamos estilos: dejamos que el widget use su configuración (placement/variant)
      document.body.appendChild(conv)
    }

    return () => {
      try {
        const n = document.getElementById(elId)
        if (n) document.body.removeChild(n)
      } catch {}
    }
  }, [hidden, location.pathname])

  return null
}


