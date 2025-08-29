import { useEffect, useState } from 'react'
import { startElevenWS, stopElevenWS } from '../../lib/elevenlabsWS'

export default function ElevenLabPage() {
  const [connected, setConnected] = useState(false)

  useEffect(()=>()=>{ try{ stopElevenWS() }catch{} }, [])

  const handleConnect = async () => {
    try {
      const ok = await startElevenWS()
      setConnected(!!ok)
    } catch {
      setConnected(false)
    }
  }
  const handleDisconnect = () => {
    try { stopElevenWS() } catch {}
    setConnected(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-2">ElevenLabs — Lab (sin widget)</h1>
      <p className="text-sm opacity-80 mb-4">Conecta el agente nativo por WebSocket y prueba voz bidireccional.</p>
      <div className="flex items-center gap-2 mb-4">
        <button className="px-3 py-2 rounded bg-cyan-500 text-black disabled:opacity-50" onClick={handleConnect} disabled={connected}>Conectar</button>
        <button className="px-3 py-2 rounded bg-zinc-700 text-white disabled:opacity-50" onClick={handleDisconnect} disabled={!connected}>Desconectar</button>
      </div>
      <audio id="eleven-remote-audio" autoPlay controls style={{ position: 'fixed', bottom: 12, left: 12 }} />
      <p className="text-xs opacity-70">Agente: usa ELEVENLABS_API_KEY y agent_id (VITE_EXCELSIOR_AGENT_ID) para crear la conexión en /api/eleven/sessions.</p>
    </div>
  )
}


