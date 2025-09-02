import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ExcelsiorHost() {
  const location = useLocation()

  // Ocultar y PAUSAR solo en salas dedicadas (Forja/OPS) y laboratorios antiguos
  const hideOn = [/^\/auth\/login$/, /^\/forja\//, /^\/ops\/sala\//, /^\/lab\/eleven/, /^\/lab\/realtime/]
  const hidden = hideOn.some((re) => re.test(location.pathname))

  useEffect(() => {
    const scriptId = 'elevenlabs-convai-script'
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
      s.async = true
      s.id = scriptId
      document.body.appendChild(s)
    }

    const elId = 'siom-eleven-widget'
    const agentId = (import.meta.env as any).VITE_EXCELSIOR_AGENT_ID as string | undefined
    if (!agentId) return

    const removeWidget = () => {
      const existing = document.getElementById(elId)
      if (existing) {
        try { document.body.removeChild(existing) } catch {}
      }
    }

    if (hidden) {
      // En login y salas: quitar el elemento para pausar completamente
      removeWidget()
      return
    }

    // Fuera de salas: asegurar que existe (persistente entre rutas)
    let conv = document.getElementById(elId) as HTMLElement | null
    if (!conv) {
      conv = document.createElement('elevenlabs-convai') as unknown as HTMLElement
      conv.id = elId
      conv.setAttribute('agent-id', agentId)
      document.body.appendChild(conv)
    }

    // Al desmontar o cambiar ruta, eliminar si estaba presente
    return () => {
      removeWidget()
    }
  }, [hidden, location.pathname])

  return null
}


