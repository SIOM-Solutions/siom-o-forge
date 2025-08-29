import { useRef, useState } from 'react'

export default function ExcelsiorConnectButton() {
  const [connected, setConnected] = useState(false)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localRef = useRef<MediaStream | null>(null)
  // Limpio: sin instrucciones locales; el comportamiento lo dicta el modelo o un prompt asset cuando se active

  const handleClick = async () => {
    if (!connected) {
      try {
        // 1) Token efímero
        const ep = await fetch('/api/openai/ephemeral')
        if (!ep.ok) throw new Error(`ephemeral ${ep.status}`)
        const ej = await ep.json()
        const token: string | undefined = ej?.client_secret?.value || ej?.client_secret
        const model: string = ej?.model || 'gpt-realtime'
        if (!token) throw new Error('missing client secret')

        // 2) RTCPeerConnection y audio remoto
        const pc = new RTCPeerConnection()
        pcRef.current = pc
        const a = document.getElementById('openai-remote-audio') as HTMLAudioElement | null
        pc.ontrack = (e) => {
          if (a) {
            a.srcObject = e.streams[0]
            a.muted = false
            a.play().catch(() => {})
          }
        }
        try { pc.addTransceiver('audio', { direction: 'recvonly' }) } catch {}

        // 3) Micrófono local
        const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
        localRef.current = ms
        ms.getTracks().forEach((t) => pc.addTrack(t, ms))

        // 4) DataChannel y arranque
        const dc = pc.createDataChannel('oai-events')
        dc.onopen = () => {
          try {
            // 1) Adjuntar VS vía session.update (si existe en env backend)
            // El backend no pasa VS en /sessions; lo hacemos aquí
            const vsIdsEnv = (import.meta.env as any).VITE_OPENAI_VECTOR_STORE_IDS as string | undefined
            if (vsIdsEnv) {
              const ids = vsIdsEnv.split(',').map((s)=>s.trim()).filter(Boolean)
              if (ids.length) {
                dc.send(JSON.stringify({
                  type: 'session.update',
                  session: {
                    tools: [{ type: 'file_search' }],
                    tool_resources: { file_search: { vector_store_ids: ids } },
                  },
                }))
              }
            }
            // 2) session.update mínimo (modalities/voice)
            dc.send(JSON.stringify({
              type: 'session.update',
              session: { modalities: ['audio','text'], voice: 'ash' },
            }))
            dc.send(JSON.stringify({ type: 'response.create', response: { modalities: ['audio', 'text'] } }))
          } catch {}
        }

        // 5) SDP → POST /v1/realtime
        const off = await pc.createOffer({ offerToReceiveAudio: true })
        await pc.setLocalDescription(off)
        const r = await fetch(`https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`, {
          method: 'POST',
          body: off.sdp,
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/sdp', 'OpenAI-Beta': 'realtime=v1' },
        })
        if (!r.ok) throw new Error(`sdp ${r.status}`)
        const ans = await r.text()
        await pc.setRemoteDescription({ type: 'answer', sdp: ans })

        setConnected(true)
      } catch (e) {
        // no-op; deja el botón desconectado
        setConnected(false)
      }
    } else {
      try {
        const pc = pcRef.current
        if (pc) {
          try { pc.getSenders().forEach((s) => { try { s.track?.stop() } catch {} }) } catch {}
          try { pc.close() } catch {}
        }
        pcRef.current = null
        const ms = localRef.current
        if (ms) {
          try { ms.getTracks().forEach((t) => { try { t.stop() } catch {} }) } catch {}
        }
        localRef.current = null
      } catch {}
      setConnected(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={connected}
      aria-label={connected ? 'Desconectar voz' : 'Consulta a Excelsior'}
      title={connected ? 'Desconectar voz' : 'Consulta a Excelsior'}
      className={`pointer-events-auto px-4 py-2 rounded-lg font-semibold transition-colors ${
        connected ? 'bg-emerald-500 text-black' : 'bg-cyan-500 text-black hover:bg-cyan-400'
      }`}
    >
      {connected ? 'Desconectar' : 'Consulta a Excelsior'}
    </button>
  )
}


