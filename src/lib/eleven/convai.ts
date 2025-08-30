let ws: WebSocket | null = null
let audioCtx: AudioContext | null = null
let micStream: MediaStream | null = null
let micSource: MediaStreamAudioSourceNode | null = null
let micProcessor: ScriptProcessorNode | null = null
let micBuffer: Float32Array[] = []
let nextAudioStart = 0

async function getSignedWsUrl(): Promise<string | null> {
  const agentId = (import.meta.env as any).VITE_EXCELSIOR_AGENT_ID as string | undefined
  if (!agentId) return null
  const res = await fetch(`/api/eleven/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent_id: agentId }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data?.ws_url || null
}

export async function connectConvai(): Promise<boolean> {
  try {
    if (ws) return true

    const url = await getSignedWsUrl()
    if (!url) throw new Error('No se pudo obtener la URL firmada de WebSocket para ElevenLabs')

    // Permisos micrófono
    micStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } })

    // Contexto de audio
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 48000 })
    try { await audioCtx.resume() } catch {}
    nextAudioStart = audioCtx.currentTime

    // Fuente y capturador (simple, sin ganancia ni efectos). Enviamos PCM16 a 16k.
    micSource = audioCtx.createMediaStreamSource(micStream)
    micProcessor = audioCtx.createScriptProcessor(4096, 1, 1)
    micProcessor.onaudioprocess = (ev) => {
      const input = ev.inputBuffer.getChannelData(0)
      micBuffer.push(new Float32Array(input))
    }
    micSource.connect(micProcessor)
    // no conectar a destination → evita feedback

    // Abrir WS
    ws = new WebSocket(url)
    ws.binaryType = 'arraybuffer'

    ws.onopen = () => {
      // Declarar sesión: PCM16/16k + transcripción + VAD servidor
      try {
        ws!.send(JSON.stringify({
          type: 'session.update',
          session: {
            input_audio_format: { type: 'pcm16', sample_rate_hz: 16000 },
            input_audio_transcription: { enabled: true, language: 'es' },
            turn_detection: { type: 'server', silence_duration_ms: 700 },
          },
        }))
      } catch {}

      // Envío periódico de frames (20–40ms). Dejamos a VAD del servidor gestionar turnos.
      const interval = setInterval(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return
        const samples = mergeFloat32(micBuffer)
        micBuffer = []
        if (samples.length === 0 || !audioCtx) return
        const pcm16 = downsampleTo16kPcm16(samples, audioCtx.sampleRate)
        const b64 = base64FromBytes(pcm16)
        try {
          ws!.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64 }))
        } catch {}
      }, 50)
      ;(ws as any)._sendInterval = interval
    }

    ws.onmessage = (ev) => {
      // Procesamos SOLO audio JSON del agente para evitar duplicaciones
      if (typeof ev.data === 'string') {
        try {
          const j = JSON.parse(ev.data)
          if (j?.type === 'audio' && j?.audio_event?.audio_base_64) {
            const bytes = base64ToBytes(j.audio_event.audio_base_64)
            playPcm16(bytes, 16000)
          }
          // Alternativamente algunos agentes usan output_audio_buffer.append/commit
          if (j?.type === 'output_audio_buffer.append' && j?.audio) {
            const bytes = base64ToBytes(j.audio)
            playPcm16(bytes, 16000)
          }
        } catch {}
      }
    }

    ws.onerror = () => disconnectConvai()
    ws.onclose = () => disconnectConvai()

    return true
  } catch (e) {
    console.error('[Convai] Error al conectar:', e)
    disconnectConvai()
    return false
  }
}

export function disconnectConvai() {
  // Parar captura
  try { micStream?.getTracks().forEach((t) => t.stop()) } catch {}
  micStream = null
  try { micProcessor?.disconnect() } catch {}
  try { micSource?.disconnect() } catch {}
  micProcessor = null
  micSource = null
  micBuffer = []

  // Cerrar audio
  if (audioCtx) { try { audioCtx.close() } catch {} }
  audioCtx = null
  nextAudioStart = 0

  // Cerrar WS
  if (ws) {
    try {
      const intId = (ws as any)._sendInterval
      if (intId) clearInterval(intId)
    } catch {}
    try { ws.close() } catch {}
  }
  ws = null
}

// --- Utilidades de audio ---

function mergeFloat32(chunks: Float32Array[]): Float32Array {
  if (chunks.length === 0) return new Float32Array(0)
  let len = 0
  for (const c of chunks) len += c.length
  const out = new Float32Array(len)
  let off = 0
  for (const c of chunks) { out.set(c, off); off += c.length }
  return out
}

function downsampleTo16kPcm16(input: Float32Array, inputRate: number): Uint8Array {
  const target = 16000
  const ratio = inputRate / target
  const outLen = Math.floor(input.length / ratio)
  const out = new Uint8Array(outLen * 2)
  let j = 0
  for (let i = 0; i < outLen; i++) {
    const idx = Math.floor(i * ratio)
    let s = input[idx]
    if (s > 1) s = 1
    if (s < -1) s = -1
    const v = s < 0 ? s * 0x8000 : s * 0x7FFF
    out[j++] = v & 0xff
    out[j++] = (v >> 8) & 0xff
  }
  return out
}

function base64FromBytes(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function playPcm16(bytes: Uint8Array, sampleRateHz: number) {
  if (!audioCtx) return
  const frameCount = bytes.length / 2
  const audioBuffer = audioCtx.createBuffer(1, frameCount, sampleRateHz)
  const channel = audioBuffer.getChannelData(0)
  // PCM16 little-endian → Float32
  for (let i = 0, idx = 0; i < frameCount; i++, idx += 2) {
    const lo = bytes[idx]
    const hi = bytes[idx + 1]
    const val = (hi << 8) | lo
    const signed = val >= 0x8000 ? val - 0x10000 : val
    channel[i] = signed / 0x8000
  }
  const src = audioCtx.createBufferSource()
  src.buffer = audioBuffer
  src.connect(audioCtx.destination)
  const startAt = Math.max(audioCtx.currentTime, nextAudioStart)
  try { src.start(startAt) } catch { try { src.start() } catch {} }
  nextAudioStart = startAt + audioBuffer.duration
}


