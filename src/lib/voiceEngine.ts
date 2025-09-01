// Integración OpenAI Realtime movida a examples/voice/orbClient.ts.
// Stub seguro para mantener el build verde sin la dependencia.
async function startOrbRealtime(): Promise<boolean> { return true }
function stopOrbRealtime(): void {}

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


