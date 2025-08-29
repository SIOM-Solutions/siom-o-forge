import { useState } from 'react'
import { preflightMicReset, startOrbRealtime, stopOrbRealtime } from '../lib/realtime/orbClient'

export default function ExcelsiorConnectButton() {
  const [connected, setConnected] = useState(false)

  const handleClick = async () => {
    if (!connected) {
      try { await preflightMicReset() } catch {}
      try {
        const a = document.getElementById('openai-remote-audio') as HTMLAudioElement | null
        if (a) {
          a.hidden = false
          a.muted = false
          a.volume = 1
          await a.play().catch(() => {})
          a.hidden = true
        }
      } catch {}
      const ok = await startOrbRealtime()
      setConnected(ok)
    } else {
      stopOrbRealtime()
      setConnected(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={connected}
      aria-label={connected ? 'Desconectar voz' : 'Consulta a Excelsior'}
      title={connected ? 'Desconectar voz' : 'Consulta a Excelsior'}
      className={`pointer-events-auto px-4 py-2 rounded-lg font-semibold transition-colors ${
        connected ? 'bg-emerald-500 text-black' : 'bg-cyan-500 text-black hover:bg-cyan-400'
      }`}
    >
      {connected ? 'Desconectar' : 'Consulta a Excelsior'}
    </button>
  )
}


