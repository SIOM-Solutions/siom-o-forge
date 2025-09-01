import { useEffect, useState } from 'react'
import { connectConvaiClean, disconnectConvaiClean } from '../../lib/eleven/convai-clean'

export default function ElevenCleanPage() {
  const [on, setOn] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    console.log('[ElevenCleanPage] mounted')
    return () => {
      console.log('[ElevenCleanPage] unmounted')
      try { disconnectConvaiClean() } catch {}
    }
  }, [])

  const start = async () => {
    if (busy) return
    setBusy(true)
    console.log('[UI] Iniciar clic')
    try { await new Audio().play().catch(() => {}) } catch {}
    try {
      const r = await fetch('/api/eleven/sessions', { method: 'POST' })
      const txt = await r.text()
      console.log('[UI] probe /api/eleven/sessions:', r.status, txt)
      if (!r.ok || !txt.includes('ws_url')) throw new Error(`sessions probe failed (${r.status})`)
    } catch (e) {
      console.error('[UI] probe FAIL', e)
      setBusy(false)
      return
    }
    try {
      await connectConvaiClean()
      console.log('[UI] connectConvaiClean OK')
      setOn(true)
    } catch (e) {
      console.error('[UI] connectConvaiClean FAIL', e)
      setOn(false)
    } finally {
      setBusy(false)
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
          <button onClick={start} disabled={on || busy} style={{ padding: '12px 18px', borderRadius: 10, border: '1px solid #0ea5e9', background: '#0ea5e9', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Iniciar</button>
          <button onClick={stop} disabled={!on && !busy} style={{ padding: '12px 18px', borderRadius: 10, border: '1px solid #ef4444', background: '#fff', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Colgar</button>
        </div>
        <p style={{ opacity: .7, marginTop: 12 }}>
          Pulsa <b>Iniciar</b>, concede el micrófono y habla; puedes <b>interrumpir</b> hablando encima (barge-in).
        </p>
      </div>
    </main>
  )
}

