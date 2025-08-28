let activePc: RTCPeerConnection | null = null
let activeLocalStream: MediaStream | null = null
let serverDc: RTCDataChannel | null = null

export async function startRealtime(): Promise<boolean> {
  try {
    const endpoint = import.meta.env.VITE_OPENAI_REALTIME_ENDPOINT || '/api/openai/ephemeral'
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error('Failed to fetch ephemeral token')
    const data = await res.json()
    const clientSecret = data?.client_secret?.value
    const sessionModel: string = data?.model || 'gpt-4o-realtime-preview-2025-06-03'
    if (!clientSecret) throw new Error('Missing client secret in session')

    // WebRTC peer connection
    const pc = new RTCPeerConnection()
    activePc = pc
    console.log('Realtime: creating RTCPeerConnection')

    // Local mic
    const local = await navigator.mediaDevices.getUserMedia({ audio: true })
    console.log('Realtime: got local media stream')
    activeLocalStream = local
    local.getTracks().forEach((t) => pc.addTrack(t, local))

    pc.onconnectionstatechange = () => {
      console.log('Realtime connection state:', pc.connectionState)
    }

    // Data channel (cliente)
    const dc = pc.createDataChannel('oai-events')
    dc.onopen = () => {
      console.log('Realtime: data channel open')
      try {
        // Semilla inicial para forzar salida de voz
        dc.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: 'Hola, preséntate brevemente.' }],
          },
        }))
        dc.send(JSON.stringify({ type: 'response.create', response: { modalities: ['audio','text'] } }))
      } catch (e) {
        console.warn('Realtime: response.create send failed', e)
      }
    }
    dc.onmessage = (ev) => {
      try { const j = JSON.parse(String(ev.data)); if (j?.type) console.log('Realtime event:', j.type) } catch {}
    }

    // Data channel que pueda abrir el servidor
    pc.ondatachannel = (e) => {
      serverDc = e.channel
      console.log('Realtime: server data channel:', serverDc.label)
      serverDc.onmessage = (ev) => {
        try { const j = JSON.parse(String(ev.data)); if (j?.type) console.log('Realtime srv event:', j.type) } catch {}
      }
      serverDc.onopen = () => {
        try {
          // Asegurar voz + audio
          serverDc?.send(JSON.stringify({ type: 'session.update', session: { modalities: ['audio','text'] } }))
          serverDc?.send(JSON.stringify({ type: 'response.create', response: { modalities: ['audio','text'] } }))
        } catch (e) {
          console.warn('Realtime: srv response.create failed', e)
        }
      }
    }

    // Remote audio
    const remoteAudio = document.getElementById('openai-remote-audio') as HTMLAudioElement | null
    if (remoteAudio) {
      remoteAudio.setAttribute('playsinline', 'true')
      remoteAudio.setAttribute('autoplay', 'true')
      remoteAudio.muted = false
    }
    pc.ontrack = (event) => {
      const [stream] = event.streams
      console.log('Realtime: received remote track')
      if (remoteAudio) {
        remoteAudio.srcObject = stream
        remoteAudio.play().catch((err) => console.warn('Audio play blocked:', err))
      }
    }

    const offer = await pc.createOffer({ offerToReceiveAudio: true })
    await pc.setLocalDescription(offer)

    const baseUrl = 'https://api.openai.com/v1/realtime'
    const sdpRes = await fetch(`${baseUrl}?model=${encodeURIComponent(sessionModel)}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        'Content-Type': 'application/sdp',
        'OpenAI-Beta': 'realtime=v1',
      },
    })
    if (!sdpRes.ok) throw new Error(`SDP exchange failed: ${sdpRes.status}`)
    const answer = { type: 'answer', sdp: await sdpRes.text() } as RTCSessionDescriptionInit
    await pc.setRemoteDescription(answer)

    // Reintento de inicio de habla tras establecer la descripción remota
    setTimeout(() => {
      const ch = serverDc && serverDc.readyState === 'open' ? serverDc : (dc.readyState === 'open' ? dc : null)
      try { ch?.send(JSON.stringify({ type: 'response.create', response: { modalities: ['audio','text'] } })) } catch {}
    }, 500)

    return true
  } catch (e) {
    console.error('OpenAI Realtime start error:', e)
    stopRealtime()
    return false
  }
}

export function stopRealtime() {
  try {
    if (activePc) {
      try {
        activePc.getSenders().forEach((s) => {
          try { s.track?.stop() } catch {}
        })
      } catch {}
      activePc.close()
      activePc = null
    }
    if (activeLocalStream) {
      try {
        activeLocalStream.getTracks().forEach((t) => {
          try { t.stop() } catch {}
        })
      } catch {}
      activeLocalStream = null
    }
    console.log('Realtime: stopped')
  } catch (e) {
    console.warn('OpenAI Realtime stop error:', e)
  }
}


