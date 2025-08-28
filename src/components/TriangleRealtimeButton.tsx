import { useState } from 'react'
import { startOrbRealtime, stopOrbRealtime } from '../lib/realtime/orbClient'

export default function TriangleRealtimeButton() {
  const [connected, setConnected] = useState(false)

  const handleClick = async () => {
    if (!connected) {
      try { await navigator.mediaDevices.getUserMedia({ audio: true }) } catch {}
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
      aria-label={connected ? 'Desconectar voz' : 'Conectar voz'}
      title={connected ? 'Desconectar voz' : 'Conectar voz'}
      className="pointer-events-auto"
      style={{
        width: '3rem',
        height: '3rem',
        WebkitClipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
        clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
        background: connected
          ? 'linear-gradient(135deg, rgba(34,211,238,0.9), rgba(8,145,178,0.9))'
          : 'linear-gradient(135deg, rgba(34,211,238,0.6), rgba(8,145,178,0.6))',
        boxShadow: connected
          ? '0 0 24px rgba(34,211,238,0.55), inset 0 0 12px rgba(34,211,238,0.35)'
          : 'inset 0 0 12px rgba(34,211,238,0.25)',
        transition: 'transform 200ms ease, box-shadow 200ms ease, background 200ms ease',
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
      onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.0)' }}
    />
  )
}


