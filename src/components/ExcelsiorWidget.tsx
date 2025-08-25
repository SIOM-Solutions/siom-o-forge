import { useEffect } from 'react'

export default function ExcelsiorWidget() {
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
  }, [])

  const agentId = import.meta.env.VITE_EXCELSIOR_AGENT_ID || 'agent_4001k1vabwfxfzx9jtvy76sm0jd5'

  return (
    // @ts-ignore - elemento web personalizado proporcionado por ElevenLabs
    <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
  )
}


