export async function createRealtimeConnection(): Promise<MediaStream | null> {
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
    console.log('Realtime: creating RTCPeerConnection')

    // Local mic
    const local = await navigator.mediaDevices.getUserMedia({ audio: true })
    console.log('Realtime: got local media stream')
    local.getTracks().forEach((t) => pc.addTrack(t, local))

    pc.onconnectionstatechange = () => {
      console.log('Realtime connection state:', pc.connectionState)
    }

    // Remote audio
    const remoteAudio = document.getElementById('openai-remote-audio') as HTMLAudioElement | null
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

    return local
  } catch (e) {
    console.error('OpenAI Realtime error:', e)
    return null
  }
}


