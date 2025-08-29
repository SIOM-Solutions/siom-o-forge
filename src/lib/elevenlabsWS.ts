let ws: WebSocket | null = null
let mediaStream: MediaStream | null = null
let audioCtx: AudioContext | null = null
let sourceNode: MediaStreamAudioSourceNode | null = null
let processorNode: ScriptProcessorNode | null = null
let captureBuffer: Float32Array[] = []
let remotePcmChunks: Uint8Array[] = []
let awaitingResponse = false

async function getWsUrl(): Promise<string | null> {
  const agentId = (import.meta.env as any).VITE_EXCELSIOR_AGENT_ID as string | undefined
  if (!agentId) return null
  // Usamos el endpoint local de O‑Forge para evitar CORS
  const res = await fetch(`/api/eleven/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    // Intentar extraer user_id desde Supabase (si existe)
    let userId: string | undefined
    try {
      const { data } = await (await import('../lib/supabase')).supabase.auth.getUser()
      userId = data?.user?.id
    } catch {}

    // Conexión WS
    ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'
    ws.onopen = () => {
      // Captura PCM y envío como frames JSON
      remotePcmChunks = []
      captureBuffer = []
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 48000 })
      if (!audioCtx) return
      try { audioCtx.resume().catch(() => {}) } catch {}
      sourceNode = audioCtx.createMediaStreamSource(mediaStream!)
      processorNode = audioCtx.createScriptProcessor(4096, 1, 1)
      processorNode.onaudioprocess = (ev) => {
        const input = ev.inputBuffer.getChannelData(0)
        // Copiamos frame
        captureBuffer.push(new Float32Array(input))
      }
      sourceNode.connect(processorNode)
      // No conectamos a destination para evitar eco; basta con procesar frames
      try { processorNode.connect(audioCtx.destination) } catch {}

      // Declarar formato y VAD al servidor (algunos proveedores lo requieren)
      try {
        ws!.send(JSON.stringify({
          type: 'session.update',
          session: {
            input_audio_format: { type: 'pcm16', sample_rate_hz: 16000 },
            input_audio_transcription: { enabled: true, language: 'es' },
            turn_detection: { type: 'server', silence_duration_ms: 700 },
            // Identificador de cliente/usuario si existe
            user_id: userId,
          },
        }))
      } catch {}
      awaitingResponse = false

      // Envío periódico de frames PCM16 (16 kHz)
      const sendInterval = setInterval(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return
        const samples = mergeFloat32(captureBuffer)
        captureBuffer = []
        // Evitar respuestas excesivas: esperar al menos ~200ms de audio (a 48kHz ≈ 9600 muestras)
        const minSamples = 9600
        if (samples.length < minSamples) return
        const pcm16 = downsampleTo16kAndEncodePCM16(samples, audioCtx!.sampleRate)
        const b64 = base64FromArrayBuffer(pcm16.buffer)
        try {
          ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64 }))
          ws.send(JSON.stringify({ type: 'input_audio_buffer.commit' }))
          if (!awaitingResponse) {
            ws.send(JSON.stringify({ type: 'response.create' }))
            awaitingResponse = true
          }
        } catch {}
      }, 300)

      // Guardar para cleanup
      ;(ws as any)._siom_sendInterval = sendInterval
    }

    // Reproducir audio remoto
    ws.onmessage = (ev) => {
      // Asegurar elemento de audio presente
      let audioEl = document.getElementById('eleven-remote-audio') as HTMLAudioElement | null
      if (!audioEl) {
        try {
          audioEl = document.createElement('audio')
          audioEl.id = 'eleven-remote-audio'
          audioEl.autoplay = true
          audioEl.controls = true
          audioEl.setAttribute('playsinline', 'true')
          Object.assign(audioEl.style, { position: 'fixed', bottom: '12px', left: '12px' })
          document.body.appendChild(audioEl)
        } catch {}
      }
      if (ev.data instanceof ArrayBuffer) {
        // Servidor envía audio binario (pcm_16000)
        try {
          const wav = pcm16ToWav(ev.data as ArrayBuffer, 16000)
          if (audioEl) {
            const url = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }))
            audioEl.src = url
            audioEl.play().catch(() => {})
          }
        } catch {}
        // Al recibir audio remoto, permitimos la siguiente petición
        awaitingResponse = false
        return
      }
      const msg = typeof ev.data === 'string' ? ev.data : ''
      if (msg) {
        try {
          const j = JSON.parse(msg)
          // Si el servidor confirma fin de respuesta, desbloquear siguiente
          if (j?.type === 'response.completed' || j?.type === 'output_audio_buffer.commit') {
            awaitingResponse = false
          }
          // Manejo de audio JSON de ElevenLabs: type: 'audio' con audio_event.audio_base_64
          if (j?.type === 'audio' && j?.audio_event?.audio_base_64) {
            try {
              const bytes = base64ToUint8(j.audio_event.audio_base_64)
              remotePcmChunks.push(bytes)
            } catch {}
          }
          // Convenciones típicas: output_audio_buffer.append/commit
          if (j?.type === 'output_audio_buffer.append' && j?.audio) {
            const bytes = base64ToUint8(j.audio)
            remotePcmChunks.push(bytes)
          } else if (j?.type === 'output_audio_buffer.commit' || j?.type === 'agent_response_event') {
            const merged = concatUint8(remotePcmChunks)
            remotePcmChunks = []
            // Asumimos PCM16 mono 16k → creamos WAV para reproducir fácilmente
            const wav = pcm16ToWav(merged.buffer as ArrayBuffer, 16000)
            if (audioEl) {
              const url = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }))
              audioEl.src = url
              audioEl.play().catch(() => {})
            }
          }
        } catch {
          // noop
        }
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
    mediaStream?.getTracks().forEach((t) => { try { t.stop() } catch {} })
  } catch {}
  mediaStream = null

  try {
    if (processorNode) {
      try { processorNode.disconnect() } catch {}
    }
    if (sourceNode) {
      try { sourceNode.disconnect() } catch {}
    }
    if (audioCtx) {
      try { audioCtx.close() } catch {}
    }
  } catch {}
  processorNode = null
  sourceNode = null
  audioCtx = null

  try {
    if (ws && ws.readyState === WebSocket.OPEN) {
      try { ws.close() } catch {}
    }
  } catch {}
  try {
    const intId = (ws as any)?._siom_sendInterval
    if (intId) clearInterval(intId)
  } catch {}
  ws = null
}

function mergeFloat32(chunks: Float32Array[]): Float32Array {
  if (chunks.length === 0) return new Float32Array(0)
  let len = 0
  for (const c of chunks) len += c.length
  const out = new Float32Array(len)
  let off = 0
  for (const c of chunks) { out.set(c, off); off += c.length }
  return out
}

function downsampleTo16kAndEncodePCM16(input: Float32Array, inputRate: number): Uint8Array {
  const targetRate = 16000
  const ratio = inputRate / targetRate
  const outLen = Math.floor(input.length / ratio)
  const pcm = new Uint8Array(outLen * 2)
  let i = 0
  for (let n = 0; n < outLen; n++) {
    const idx = Math.floor(n * ratio)
    let s = Math.max(-1, Math.min(1, input[idx]))
    const v = s < 0 ? s * 0x8000 : s * 0x7FFF
    pcm[i++] = (v as any) & 0xFF
    pcm[i++] = ((v as any) >> 8) & 0xFF
  }
  return pcm
}

function base64FromArrayBuffer(buf: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buf)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function base64ToUint8(b64: string): Uint8Array {
  const binary = atob(b64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function concatUint8(chunks: Uint8Array[]): Uint8Array {
  let len = 0
  for (const c of chunks) len += c.length
  const out = new Uint8Array(len)
  let off = 0
  for (const c of chunks) { out.set(c, off); off += c.length }
  return out
}

function pcm16ToWav(pcm16: ArrayBuffer, sampleRate: number): ArrayBuffer {
  const numChannels = 1
  const bytesPerSample = 2
  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = (pcm16 as ArrayBuffer).byteLength
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  // RIFF header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // PCM chunk size
  view.setUint16(20, 1, true)  // PCM format
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true) // bits per sample
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  // PCM data
  const pcmBytes = new Uint8Array(pcm16)
  for (let i = 0; i < pcmBytes.length; i++) view.setUint8(44 + i, pcmBytes[i])
  return buffer
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
}


