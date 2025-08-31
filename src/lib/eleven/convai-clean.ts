// src/lib/eleven/convai-clean.ts
let ws: WebSocket | null = null;
let connecting = false; // evita conexiones duplicadas
let audioCtx: AudioContext | null = null;
let media: MediaStream | null = null;
let source: MediaStreamAudioSourceNode | null = null;
let processor: ScriptProcessorNode | null = null;

let nextAudioStart = 0; // cola de reproducción para evitar solapes
const SR_TARGET = 16000;

function floatToPcm16le(float32: Float32Array): Uint8Array {
  const out = new Uint8Array(float32.length * 2);
  let o = 0;
  for (let i = 0; i < float32.length; i++) {
    let s = Math.max(-1, Math.min(1, float32[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7FFF;
    out[o++] = s & 0xFF;
    out[o++] = (s >> 8) & 0xFF;
  }
  return out;
}
function downsampleTo16k(input: Float32Array, inRate: number): Float32Array {
  if (inRate === SR_TARGET) return input;
  const ratio = inRate / SR_TARGET;
  const outLen = Math.round(input.length / ratio);
  const out = new Float32Array(outLen);
  let pos = 0;
  for (let i = 0; i < outLen; i++) {
    const next = Math.round((i + 1) * ratio);
    let sum = 0, count = 0;
    for (; pos < next && pos < input.length; pos++) { sum += input[pos]; count++; }
    out[i] = count ? (sum / count) : 0;
  }
  return out;
}
function u8ToB64(u8: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
  return btoa(bin);
}
function rms(buf: Float32Array): number {
  let s = 0;
  for (let i = 0; i < buf.length; i++) { const v = buf[i]; s += v * v; }
  return Math.sqrt(s / buf.length);
}

async function getSignedUrl(agentId?: string) {
  console.log('[convai-clean] fetching /api/eleven/sessions with agentId:', agentId)
  const r = await fetch('/api/eleven/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: agentId ? JSON.stringify({ agent_id: agentId }) : undefined
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '')
    console.error('[convai-clean] sessions failed', r.status, body)
    throw new Error(`sessions ${r.status}`)
  }
  return r.json() as Promise<{ ws_url: string }>;
}

export async function connectConvaiClean() {
  console.log('[convai-clean] start connect');
  if (connecting) { console.log('[convai-clean] connecting in progress'); return; }
  if (ws && ws.readyState === WebSocket.OPEN) { console.log('[convai-clean] already connected'); return; }
  connecting = true;
  let signed: { ws_url: string };
  try {
    signed = await getSignedUrl((import.meta as any).env?.VITE_EXCELSIOR_AGENT_ID);
  } catch (e) {
    connecting = false;
    throw e;
  }
  console.log('[convai-clean] sessions JSON:', signed);
  const { ws_url } = signed;
  if (!ws_url) throw new Error('No ws_url from /api/eleven/sessions');

  console.log('[convai-clean] opening WS:', ws_url);
  ws = new WebSocket(ws_url);
  ws.binaryType = 'arraybuffer';

  ws.onopen = async () => {
    console.log('[convai-clean] WS open');
    connecting = false;
    try {
      ws?.send(JSON.stringify({
        type: 'session.update',
        session: {
          input_audio_format:  { type: 'pcm16', sample_rate_hz: 16000 },
          output_audio_format: { type: 'pcm16', sample_rate_hz: 16000 },
          language: 'es',
          turn_detection: { type: 'server_vad' }
        }
      }));
      console.log('[convai-clean] session.update sent');
    } catch (e) {
      console.warn('[convai-clean] session.update error', e);
    }

    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ latencyHint: 'interactive' });
    try { await audioCtx.resume(); } catch {}
    media = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    source = audioCtx.createMediaStreamSource(media);
    processor = audioCtx.createScriptProcessor(2048, 1, 1);
    source.connect(processor);
    // NECESARIO: conectar el processor al destino para que onaudioprocess dispare
    processor.connect(audioCtx.destination);
    nextAudioStart = audioCtx.currentTime;

    processor.onaudioprocess = (e) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const inBuf = e.inputBuffer.getChannelData(0);
      const level = rms(inBuf);
      const speaking = level > 0.01;
      if (!speaking) return;
      const ds = downsampleTo16k(inBuf, audioCtx!.sampleRate);
      const pcm = floatToPcm16le(ds);
      const b64 = u8ToB64(pcm);
      try { ws.send(JSON.stringify({ user_audio_chunk: b64 })); console.log('[WS ->] user_audio_chunk', { bytes: pcm.byteLength }); } catch (err) { console.warn('[convai-clean] send user_audio_chunk error', err); }
    };
  };

  ws.onmessage = (ev) => {
    if (ev.data instanceof ArrayBuffer) return;
    let msg: any;
    try { msg = JSON.parse(String(ev.data)); } catch { console.warn('[convai-clean] non-JSON message'); return; }

    if (msg?.type === 'ping' && msg?.ping_event?.event_id) {
      try { ws?.send(JSON.stringify({ type: 'pong', event_id: msg.ping_event.event_id })); console.log('[convai-clean] pong sent'); } catch {}
    }
    if (msg?.type === 'agent_response') {
      console.log('[WS <-] agent_response');
    }
    if (msg?.type === 'response.completed') {
      console.log('[convai-clean] response.completed');
      if (audioCtx) nextAudioStart = audioCtx.currentTime; // reset cola si aplica
    }
    if (msg?.type === 'audio' && msg?.audio_event?.audio_base_64) {
      console.log('[WS <-] audio chunk');
      // console.log('[convai-clean] audio chunk len:', msg.audio_event.audio_base_64.length);
      if (!audioCtx) return;
      const bin = atob(msg.audio_event.audio_base_64);
      const u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      const i16 = new Int16Array(u8.buffer, u8.byteOffset, u8.byteLength / 2);
      const f32 = new Float32Array(i16.length);
      for (let i = 0; i < i16.length; i++) f32[i] = Math.max(-1, Math.min(1, i16[i] / 32768));
      const buf = audioCtx.createBuffer(1, f32.length, 16000);
      buf.copyToChannel(f32, 0);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(audioCtx.destination);
      const startAt = Math.max(audioCtx.currentTime, nextAudioStart);
      try { src.start(startAt) } catch { try { src.start() } catch {} }
      nextAudioStart = startAt + buf.duration;
      src.onended = () => { /* cola liberada automáticamente por nextAudioStart */ };
    }
  };

  ws.onclose = (e) => { console.log('[convai-clean] WS close', e.code, e.reason); connecting = false; cleanup(); };
  ws.onerror = (e) => { console.warn('[convai-clean] WS error', e); connecting = false; cleanup(); };
}

// Exponer para depuración manual en consola del navegador
;(globalThis as any).connectConvaiClean = connectConvaiClean
;(globalThis as any).disconnectConvaiClean = disconnectConvaiClean

export function disconnectConvaiClean() {
  try { ws?.close(1000, 'bye'); } catch {}
  cleanup();
}

function cleanup() {
  try { processor?.disconnect(); } catch {}
  try { source?.disconnect(); } catch {}
  try { media?.getTracks()?.forEach(t => { try { t.stop(); } catch {} }); } catch {}
  try { audioCtx?.close(); } catch {}
  ws = null; audioCtx = null; media = null; source = null; processor = null;
  connecting = false;
}
