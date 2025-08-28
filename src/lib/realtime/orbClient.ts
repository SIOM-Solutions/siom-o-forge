let activePc: RTCPeerConnection | null = null
let activeLocalStream: MediaStream | null = null

const DEFAULT_VOICE = ((import.meta.env as any).VITE_OPENAI_REALTIME_VOICE as string) || 'ash'
const DEFAULT_INSTRUCTIONS = (
  (import.meta.env as any).VITE_EXCELSIOR_INSTRUCTIONS as string
) || 'Eres Excelsior, la guía experta de O-Forge de SIOM Solutions. Habla en español (España), tono ejecutivo y directo, orientado a impacto. No compartas detalles técnicos internos. Si la pregunta sale del alcance, reconduce y ofrece el siguiente paso útil dentro de la plataforma.'

export async function startOrbRealtime(): Promise<boolean> {
  try {
    console.log('[orb] start')
    // 1) Token efímero
    const endpoint = (import.meta.env as any).VITE_OPENAI_REALTIME_ENDPOINT || '/api/openai/ephemeral'
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error(`ephemeral failed: ${res.status}`)
    const data = await res.json()
    const clientSecret: string | undefined = data?.client_secret?.value || data?.client_secret
    const sessionModel: string = data?.model || 'gpt-realtime'
    if (!clientSecret) throw new Error('Missing client secret')
    console.log('[orb] ephemeral ok, model=', sessionModel)

    // 2) Micrófono local
    const local = await navigator.mediaDevices.getUserMedia({ audio: true })
    console.log('[orb] mic ok')

    // 3) RTCPeerConnection
    const pc = new RTCPeerConnection()
    activePc = pc
    activeLocalStream = local
    try { pc.addTransceiver('audio', { direction: 'recvonly' }) } catch {}
    console.log('[orb] transceiver added')
    local.getTracks().forEach((t) => pc.addTrack(t, local))
    console.log('[orb] pc tracks added')

    // 4) Audio remoto
    const remoteAudio = document.getElementById('openai-remote-audio') as HTMLAudioElement | null
    if (remoteAudio) {
      remoteAudio.setAttribute('playsinline', 'true')
      remoteAudio.setAttribute('autoplay', 'true')
      remoteAudio.muted = false
    }
    pc.ontrack = (e) => {
      const [stream] = e.streams
      if (remoteAudio) {
        remoteAudio.srcObject = stream
        remoteAudio.play().catch(() => {})
      }
      console.log('[orb] ontrack (remote audio)')
    }

    // 5) DataChannel y arranque de conversación
    const dc = pc.createDataChannel('oai-events')
    dc.onopen = () => {
      console.log('[orb] dc open')
      try {
        // session.update antes de pedir respuesta
        dc.send(
          JSON.stringify({
            type: 'session.update',
            session: {
              modalities: ['audio', 'text'],
              voice: DEFAULT_VOICE,
              turn_detection: { type: 'server_vad' },
              instructions: DEFAULT_INSTRUCTIONS,
            },
          }),
        )

        // Mensaje inicial breve para obligar a primera salida de voz
        dc.send(
          JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'message',
              role: 'user',
              content: [{ type: 'input_text', text: 'Hola, preséntate brevemente.' }],
            },
          }),
        )
        dc.send(JSON.stringify({ type: 'response.create', response: { modalities: ['audio', 'text'] } }))
      } catch {}
    }

    // 6) SDP → POST /v1/realtime
    const offer = await pc.createOffer({ offerToReceiveAudio: true })
    await pc.setLocalDescription(offer)
    const sdpRes = await fetch(`https://api.openai.com/v1/realtime?model=${encodeURIComponent(sessionModel)}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        'Content-Type': 'application/sdp',
        'OpenAI-Beta': 'realtime=v1',
      },
    })
    console.log('[orb] SDP status', sdpRes.status)
    if (!sdpRes.ok) {
      const txt = await sdpRes.text().catch(() => '')
      console.warn('[orb] SDP error body:', txt.slice(0, 200))
      throw new Error(`SDP exchange failed: ${sdpRes.status}`)
    }
    const answer = await sdpRes.text()
    await pc.setRemoteDescription({ type: 'answer', sdp: answer })
    console.log('[orb] remote description set')

    return true
  } catch (e) {
    console.error('[orb] start error', e)
    stopOrbRealtime()
    return false
  }
}

export function stopOrbRealtime() {
  try {
    if (activePc) {
      try { activePc.getSenders().forEach((s) => { try { s.track?.stop() } catch {} }) } catch {}
      try { activePc.close() } catch {}
      activePc = null
    }
    if (activeLocalStream) {
      try { activeLocalStream.getTracks().forEach((t) => { try { t.stop() } catch {} }) } catch {}
      activeLocalStream = null
    }
    // console.log('orb:stopped')
  } catch {}
}


