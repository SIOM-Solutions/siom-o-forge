import { useEffect, useState } from 'react'
import { connectConvaiClean, disconnectConvaiClean } from '../../lib/eleven/convai-clean'

export default function ElevenCleanPage() {
  const [on, setOn] = useState(false)

  useEffect(() => () => { try { disconnectConvaiClean() } catch {} }, [])
  useEffect(() => { console.log('[ElevenCleanPage] mounted'); return () => console.log('[ElevenCleanPage] unmounted') }, [])

  const start = async () => {
    console.log('[UI] Iniciar clic')
    try { await new Audio().play().catch(() => {}) } catch {}
    try {
      if (typeof connectConvaiClean !== 'function') {
        console.error('connectConvaiClean no es función (¿import correcto?)')
        return
      }
      await connectConvaiClean()
      console.log('[UI] connectConvaiClean OK')
      setOn(true)
    } catch (e) {
      console.error('[UI] connectConvaiClean FAIL', e)
      setOn(false)
    }
  }

  const stop = () => {
    console.log('[UI] Colgar clic')
    try { disconnectConvaiClean() } catch (e) { console.warn('disconnect error', e) }
    setOn(false)
  }

  return (
    <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 16 }}>ElevenLabs — Conversación Nativa (Clean)</h1>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={start} disabled={on} style={{ padding: '12px 18px', borderRadius: 10, border: '1px solid #0ea5e9', background: '#0ea5e9', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Iniciar</button>
          <button onClick={stop} disabled={!on} style={{ padding: '12px 18px', borderRadius: 10, border: '1px solid #ef4444', background: '#fff', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Colgar</button>
        </div>
        <p style={{ opacity: .7, marginTop: 12 }}>Pulsa Iniciar, concede el micrófono y habla; el agente responderá en voz (manos libres).</p>
      </div>
    </main>
  )
}


