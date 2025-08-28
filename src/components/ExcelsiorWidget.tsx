import { useEffect } from 'react'

export default function ExcelsiorWidget({ invisible = true }: { invisible?: boolean }) {
  useEffect(() => {
    const scriptId = 'elevenlabs-convai-script'
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
      s.async = true
      s.type = 'text/javascript'
      s.id = scriptId
      document.body.appendChild(s)
    }

    const agentId = (import.meta.env as any).VITE_EXCELSIOR_AGENT_ID || 'agent_4001k1vabwfxfzx9jtvy76sm0jd5'

    // Crear el custom element de forma imperativa para evitar UI visible y tipos TSX
    const conv = document.createElement('elevenlabs-convai') as any
    conv.setAttribute('agent-id', agentId)
    const style = conv.style as CSSStyleDeclaration
    style.position = 'fixed'
    style.bottom = '88px'
    style.right = '20px'
    style.width = invisible ? '1px' : '360px'
    style.height = invisible ? '1px' : '480px'
    style.opacity = invisible ? '0' : '1'
    style.pointerEvents = invisible ? 'none' : 'auto'
    style.zIndex = '50'
    document.body.appendChild(conv)

    // Observador para ocultar cualquier UI inyectada por el widget
    const hideNode = (node: HTMLElement) => {
      const t = `${node.tagName} ${node.className} ${node.id}`
      if (/elevenlabs|convai/i.test(t)) {
        node.style.opacity = '0'
        node.style.pointerEvents = 'none'
        node.style.width = '1px'
        node.style.height = '1px'
        node.style.overflow = 'hidden'
        node.style.position = 'fixed'
        node.style.bottom = '0'
        node.style.right = '0'
        node.style.zIndex = '0'
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement && invisible) hideNode(n)
        })
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // Intentar exponer controles si el widget los define (start/stop)
    const start = () => {
      try { (conv as any)?.start?.() } catch {}
      try { (conv as any)?.open?.() } catch {}
    }
    const stop = () => {
      try { (conv as any)?.stop?.() } catch {}
      try { (conv as any)?.close?.() } catch {}
    }
    const onOpen = () => start()
    const onClose = () => stop()
    window.addEventListener('siom-orb-open', onOpen)
    window.addEventListener('siom-orb-close', onClose)

    return () => {
      observer.disconnect()
      window.removeEventListener('siom-orb-open', onOpen)
      window.removeEventListener('siom-orb-close', onClose)
      try { document.body.removeChild(conv) } catch {}
    }
  }, [invisible])

  return null
}


