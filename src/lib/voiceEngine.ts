type StartFn = () => Promise<boolean>
type StopFn = () => void

export interface VoiceEngine {
  start: StartFn
  stop: StopFn
  provider: 'elevenlabs' | 'openai' | 'gemini'
}

// Implementaciones existentes
import { startElevenWS, stopElevenWS } from './elevenlabsWS'
import { startRealtime as startOpenAI, stopRealtime as stopOpenAI } from './openaiRealtime'

function pickProvider(): VoiceEngine['provider'] {
  const env = (import.meta.env as any).VITE_VOICE_PROVIDER as VoiceEngine['provider'] | undefined
  if (env === 'openai' || env === 'gemini') return env
  return 'elevenlabs'
}

export const voiceEngine: VoiceEngine = {
  provider: pickProvider(),
  start: async () => {
    const provider = pickProvider()
    if (provider === 'openai') {
      return startOpenAI()
    }
    // gemini (placeholder futuro) → fallback a elevenlabs por ahora
    return startElevenWS()
  },
  stop: () => {
    const provider = pickProvider()
    if (provider === 'openai') {
      return stopOpenAI()
    }
    // gemini (placeholder futuro)
    return stopElevenWS()
  },
}


