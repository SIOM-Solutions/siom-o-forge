let ws: WebSocket | null = null
let mediaStream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null

async function getWsUrl(): Promise<string | null> {
  const base = (import.meta.env as any).VITE_CONSOLE_BASE_URL as string | undefined
  const agentId = (import.meta.env as any).VITE_EXCELSIOR_AGENT_ID as string | undefined
  if (!base || !agentId) return null
  const res = await fetch(`${base}/api/eleven/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ agent_id: agentId }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data?.ws_url || null
}

export async function startElevenWS(): Promise<boolean> {
  try {
    if (ws) return true
    const url = await getWsUrl()
    if (!url) throw new Error('WS URL no configurada (VITE_ELEVENLABS_WS_URL o VITE_EXCELSIOR_AGENT_ID)')

    // Permisos de micrófono
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // Conexión WS
    ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'

    ws.onopen = () => {
      // Iniciar envío de audio como chunks (webm/opus)
      if (!mediaStream) return
      try {
        mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm;codecs=opus' })
      } catch {
        mediaRecorder = new MediaRecorder(mediaStream)
      }
      mediaRecorder.ondataavailable = (e) => {
        if (ws && ws.readyState === WebSocket.OPEN && e.data && e.data.size > 0) {
          e.data.arrayBuffer().then((buf) => {
            try { ws?.send(buf) } catch {}
          })
        }
      }
      mediaRecorder.start(250)
    }

    // Reproducir audio remoto
    ws.onmessage = (ev) => {
      const audioEl = document.getElementById('eleven-remote-audio') as HTMLAudioElement | null
      if (!audioEl) return
      const data = ev.data
      if (data instanceof ArrayBuffer) {
        const blob = new Blob([data], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        audioEl.src = url
        audioEl.play().catch(() => {})
      } else if (typeof data === 'string') {
        // Mensajes de control opcionales
        // console.log('WS control:', data)
      }
    }

    ws.onerror = () => {
      stopElevenWS()
    }
    ws.onclose = () => {
      stopElevenWS()
    }

    return true
  } catch (e) {
    console.error('ElevenLabs WS error:', e)
    stopElevenWS()
    return false
  }
}

export function stopElevenWS() {
  try {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      try { mediaRecorder.stop() } catch {}
    }
  } catch {}
  mediaRecorder = null

  try {
    mediaStream?.getTracks().forEach((t) => { try { t.stop() } catch {} })
  } catch {}
  mediaStream = null

  try {
    if (ws && ws.readyState === WebSocket.OPEN) {
      try { ws.close() } catch {}
    }
  } catch {}
  ws = null
}


