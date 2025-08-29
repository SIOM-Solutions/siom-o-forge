export const config = { runtime: 'nodejs22.x' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) return new Response('Missing ELEVENLABS_API_KEY', { status: 500 })

    const body = await req.json().catch(() => ({}))
    const agentId = (body && body.agent_id) || process.env.VITE_EXCELSIOR_AGENT_ID
    if (!agentId) return new Response('Missing agent_id', { status: 400 })

    // Solicitar la URL de WS para el agente (Convai)
    const r = await fetch('https://api.elevenlabs.io/v1/convai/connections', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agent_id: agentId }),
    })
    const j = await r.json()
    if (!r.ok) return new Response(JSON.stringify(j), { status: r.status, headers: { 'content-type': 'application/json' } })

    return new Response(JSON.stringify({ ws_url: j?.websocket_url || j?.ws_url || j?.url }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}


