import { startOrbRealtime, stopOrbRealtime } from './realtime/orbClient'

export interface VoiceEngine {
  start: () => Promise<boolean>
  stop: () => void
  provider: 'openai'
}

function pickProvider(): VoiceEngine['provider'] {
  return 'openai'
}

export const voiceEngine: VoiceEngine = {
  provider: pickProvider(),
  start: async () => {
    return startOrbRealtime()
  },
  stop: () => {
    return stopOrbRealtime()
  },
}


