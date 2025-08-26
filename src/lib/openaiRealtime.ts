export async function createRealtimeConnection(): Promise<MediaStream | null> {
  try {
    const endpoint = import.meta.env.VITE_OPENAI_REALTIME_ENDPOINT || '/api/openai/ephemeral'
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error('Failed to fetch ephemeral token')
    const data = await res.json()
    const clientSecret = data?.client_secret?.value
    if (!clientSecret) throw new Error('Missing client secret in session')

    // WebRTC peer connection
    const pc = new RTCPeerConnection()

    // Local mic
    const local = await navigator.mediaDevices.getUserMedia({ audio: true })
    local.getTracks().forEach((t) => pc.addTrack(t, local))

    // Remote audio
    const remoteAudio = document.getElementById('openai-remote-audio') as HTMLAudioElement | null
    pc.ontrack = (event) => {
      const [stream] = event.streams
      if (remoteAudio) {
        remoteAudio.srcObject = stream
        remoteAudio.play().catch(() => {})
      }
    }

    const offer = await pc.createOffer({ offerToReceiveAudio: true })
    await pc.setLocalDescription(offer)

    const baseUrl = 'https://api.openai.com/v1/realtime'
    const model = 'gpt-4o-realtime-preview-2024-12-17'
    const sdpRes = await fetch(`${baseUrl}?model=${model}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        'Content-Type': 'application/sdp',
      },
    })
    const answer = { type: 'answer', sdp: await sdpRes.text() } as RTCSessionDescriptionInit
    await pc.setRemoteDescription(answer)

    return local
  } catch (e) {
    console.error('OpenAI Realtime error:', e)
    return null
  }
}


