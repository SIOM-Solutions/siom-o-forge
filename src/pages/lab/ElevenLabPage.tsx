import { useState, useEffect } from 'react'
import { connectConvai, disconnectConvai } from '../../lib/eleven/convai'

export default function ElevenLabPage() {
  const [connected, setConnected] = useState(false)

  useEffect(() => () => { try { disconnectConvai() } catch {} }, [])

  const onConnect = async () => {
    const ok = await connectConvai()
    setConnected(ok)
  }
  const onDisconnect = () => {
    try { disconnectConvai() } catch {}
    setConnected(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-2">ElevenLabs — Lab</h1>
      <p className="text-sm opacity-80 mb-4">Conversational AI nativo: conectar y hablar manos libres (VAD servidor).</p>
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 rounded bg-cyan-500 text-black disabled:opacity-50" onClick={onConnect} disabled={connected}>Conectar</button>
        <button className="px-3 py-2 rounded bg-zinc-700 text-white disabled:opacity-50" onClick={onDisconnect} disabled={!connected}>Desconectar</button>
      </div>
    </div>
  )
}


