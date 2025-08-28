import { useEffect, useRef, useState } from 'react'

type RealtimeConnection = {
  pc: RTCPeerConnection
  dc: RTCDataChannel
  localStream: MediaStream
}

export default function RealtimeLabPage() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const connRef = useRef<RealtimeConnection | null>(null)
  const [connected, setConnected] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [text, setText] = useState('Hola, preséntate brevemente.')

  const log = (line: string) => setLogs((s) => [line, ...s].slice(0, 300))

  useEffect(() => {
    return () => {
      try {
        if (connRef.current) {
          const { pc, localStream } = connRef.current
          try { pc.getSenders().forEach((s) => { try { s.track?.stop() } catch {} }) } catch {}
          try { pc.close() } catch {}
          try { localStream.getTracks().forEach((t) => { try { t.stop() } catch {} }) } catch {}
        }
      } catch {}
      connRef.current = null
      setConnected(false)
    }
  }, [])

  async function handleConnect() {
    try {
      if (!audioRef.current) return

      // 1) Token efímero (crea sesión con prompt si está configurado en el backend)
      const tokenRes = await fetch('/api/openai/ephemeral')
      if (!tokenRes.ok) {
        log(`Error /api/openai/ephemeral: ${tokenRes.status}`)
        return
      }
      const tokenJson = await tokenRes.json()
      const clientSecret: string | undefined = tokenJson?.client_secret?.value || tokenJson?.client_secret
      const model: string = tokenJson?.model || 'gpt-realtime'
      if (!clientSecret) {
        log('Falta client_secret en la respuesta del endpoint efímero')
        return
      }

      // 2) Micrófono local
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // 3) RTCPeerConnection + pistas
      const pc = new RTCPeerConnection()
      pc.onconnectionstatechange = () => log(`pc.state=${pc.connectionState}`)
      try { pc.addTransceiver('audio', { direction: 'recvonly' }) } catch {}
      localStream.getTracks().forEach((t) => pc.addTrack(t, localStream))

      // 4) Audio remoto
      pc.ontrack = (e) => {
        const [stream] = e.streams
        if (audioRef.current) {
          audioRef.current.srcObject = stream
          audioRef.current.autoplay = true
          audioRef.current.muted = false
          audioRef.current.play().catch(() => {})
        }
        log('ontrack: received remote')
      }

      // 5) DataChannel para eventos
      const dc = pc.createDataChannel('oai-events')
      dc.onopen = () => {
        log('data channel open')
        // Configurar sesión (voz/instrucciones) y pedir primera respuesta
        try {
          dc.send(
            JSON.stringify({
              type: 'session.update',
              session: {
                modalities: ['audio', 'text'],
                voice: 'ash',
                turn_detection: { type: 'server_vad' },
              },
            }),
          )
          dc.send(
            JSON.stringify({
              type: 'conversation.item.create',
              item: { type: 'message', role: 'user', content: [{ type: 'input_text', text }] },
            }),
          )
          dc.send(JSON.stringify({ type: 'response.create', response: { modalities: ['audio', 'text'] } }))
        } catch {}
      }
      dc.onmessage = (ev) => {
        try {
          const j = JSON.parse(String(ev.data))
          if (j?.type) log(`evt: ${j.type}`)
        } catch {}
      }

      // 6) SDP offer → POST /v1/realtime (Bearer client_secret)
      const offer = await pc.createOffer({ offerToReceiveAudio: true })
      await pc.setLocalDescription(offer)
      const resp = await fetch(`https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${clientSecret}`,
          'Content-Type': 'application/sdp',
          'OpenAI-Beta': 'realtime=v1',
        },
      })
      if (!resp.ok) {
        log(`/v1/realtime SDP failed: ${resp.status}`)
        return
      }
      const answerSdp = await resp.text()
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })

      connRef.current = { pc, dc, localStream }
      setConnected(true)
      log('Conectado')
    } catch (e: any) {
      log(`connect error: ${String(e?.message || e)}`)
    }
  }

  function handleSend() {
    const dc = connRef.current?.dc
    if (!dc || !text.trim()) return
    try {
      dc.send(
        JSON.stringify({
          type: 'conversation.item.create',
          item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: text.trim() }] },
        }),
      )
      dc.send(JSON.stringify({ type: 'response.create' }))
      setText('')
    } catch {}
  }

  function handleDisconnect() {
    try {
      const cur = connRef.current
      if (cur) {
        try { cur.dc.close() } catch {}
        try { cur.pc.getSenders().forEach((s) => { try { s.track?.stop() } catch {} }) } catch {}
        try { cur.pc.close() } catch {}
        try { cur.localStream.getTracks().forEach((t) => { try { t.stop() } catch {} }) } catch {}
      }
    } catch {}
    connRef.current = null
    setConnected(false)
    log('Desconectado')
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-2">Lab · Realtime (WebRTC)</h1>
      <div className="flex items-center gap-2 mb-3">
        <button className="px-3 py-2 rounded bg-cyan-500 text-black disabled:opacity-50" onClick={handleConnect} disabled={connected}>
          Conectar
        </button>
        <button className="px-3 py-2 rounded bg-zinc-700 text-white disabled:opacity-50" onClick={handleDisconnect} disabled={!connected}>
          Desconectar
        </button>
        <audio ref={audioRef} autoPlay playsInline />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Escribe un mensaje para que responda por voz"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!connected}
        />
        <button className="px-3 py-2 rounded bg-emerald-500 text-black disabled:opacity-50" onClick={handleSend} disabled={!connected}>
          Enviar
        </button>
      </div>

      <pre className="text-xs bg-black/60 p-3 rounded overflow-auto h-80">{logs.map((l, i) => (
        <div key={i}>{l}</div>
      ))}</pre>
    </div>
  )
}


