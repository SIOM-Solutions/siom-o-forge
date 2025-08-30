let ws: WebSocket | null = null
let audioCtx: AudioContext | null = null
let micStream: MediaStream | null = null
let micSource: MediaStreamAudioSourceNode | null = null
let micProcessor: ScriptProcessorNode | null = null
let micBuffer: Float32Array[] = []
let nextAudioStart = 0
let agentSpeaking = false
let lastVoiceAt = 0

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
      // Configuración opcional: idioma español. El agente debe tener VAD server ya configurado.
      try {
        ws!.send(JSON.stringify({
          type: 'conversation_initiation_client_data',
          conversation_config_override: {
            agent: { language: 'es' },
          },
        }))
      } catch {}

      // Envío periódico de frames (20–50ms). Solo enviamos mientras el usuario habla y el agente NO está hablando
      const interval = setInterval(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return
        if (!audioCtx) return
        if (agentSpeaking) return
        const samples = mergeFloat32(micBuffer)
        micBuffer = []
        if (samples.length === 0) return
        // VAD local muy simple con RMS para evitar enviar ruido/silencio
        const level = computeRms(samples)
        const now = performance.now()
        if (level > 0.01) lastVoiceAt = now
        if (now - lastVoiceAt > 200) return // sin voz reciente → no enviar

        const pcm16 = downsampleTo16kPcm16(samples, audioCtx.sampleRate)
        const b64 = base64FromBytes(pcm16)
        try {
          ws!.send(JSON.stringify({ user_audio_chunk: b64 }))
        } catch {}
      }, 50)
      ;(ws as any)._sendInterval = interval
    }

    ws.onmessage = (ev) => {
      if (typeof ev.data === 'string') {
        try {
          const j = JSON.parse(ev.data)
          // keep-alive
          if (j?.type === 'ping' && j?.ping_event?.event_id) {
            try { ws!.send(JSON.stringify({ type: 'pong', event_id: j.ping_event.event_id })) } catch {}
          }
          // agente empieza a responder → pausamos envío de micro
          if (j?.type === 'agent_response') {
            agentSpeaking = true
          }
          // audio del agente
          if (j?.type === 'audio' && j?.audio_event?.audio_base_64) {
            agentSpeaking = true
            const bytes = base64ToBytes(j.audio_event.audio_base_64)
            playPcm16(bytes, 16000, () => {
              // al terminar este segmento de audio, permitimos reanudar si no llega más audio
              agentSpeaking = false
              lastVoiceAt = 0
            })
          }
          // algunos agentes podrían enviar señal de fin explícita
          if (j?.type === 'response.completed') {
            agentSpeaking = false
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

function playPcm16(bytes: Uint8Array, sampleRateHz: number, onEnded?: () => void) {
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
  if (onEnded) src.onended = onEnded
}

function computeRms(samples: Float32Array): number {
  let sum = 0
  for (let i = 0; i < samples.length; i++) { const v = samples[i]; sum += v * v }
  return Math.sqrt(sum / (samples.length || 1))
}


