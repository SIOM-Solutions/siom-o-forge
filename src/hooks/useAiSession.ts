export type StartParams = { agentId: string; materiaSlug: string }
export type StartOk = {
  sessionId: string
  jwt: string
  perSessionSecondsMax?: number
  perSessionTokenCap?: number
  remainingMonthlySeconds?: number
  remainingMonthlyTokens?: number
}

export function useAiSession() {
  let timer: number | null = null
  let sessionId = ''
  let jwt = ''

  async function authorize(params: StartParams): Promise<StartOk> {
    // TODO: implementar llamada real a Console
    void params
    throw new Error('authorize: wiring pendiente')
  }

  function startHeartbeat(getDeltas: () => { secondsDelta?: number; tokensDelta?: number }) {
    stopHeartbeat()
    timer = window.setInterval(async () => {
      // Obtener deltas (si se necesita); no desestructurar para evitar TS6198
      void getDeltas?.()
      // TODO: POST heartbeat a Console con Authorization Bearer jwt
      void sessionId; void jwt
    }, 5000)
  }

  function stopHeartbeat() {
    if (timer) { clearInterval(timer); timer = null }
  }

  async function finish(final: { secondsTotal?: number; tokensTotal?: number }) {
    stopHeartbeat()
    // TODO: POST finish a Console con Authorization Bearer jwt
    void final; void sessionId; void jwt
  }

  return { authorize, startHeartbeat, stopHeartbeat, finish }
}


