export const config = { runtime: 'nodejs' }

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      res.status(500).json({ error: 'Missing ELEVENLABS_API_KEY' })
      return
    }

    let body = req.body
    if (!body || typeof body === 'string') {
      try { body = body ? JSON.parse(body) : {} } catch { body = {} }
    }
    const agentId = (body && body.agent_id) || process.env.VITE_EXCELSIOR_AGENT_ID
    if (!agentId) {
      res.status(400).json({ error: 'Missing agent_id' })
      return
    }

    // Solicitar la URL de WS para el agente (Convai)
    const r = await fetch('https://api.elevenlabs.io/v1/convai/connections', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agent_id: agentId }),
    })
    const text = await r.text()
    let j: any = null
    try { j = JSON.parse(text) } catch { j = null }

    if (!r.ok) {
      res
        .status(r.status)
        .setHeader('content-type', 'application/json')
        .send(j ? JSON.stringify(j) : JSON.stringify({ error: 'Upstream error', details: text }))
      return
    }

    const wsUrl = j?.websocket_url || j?.ws_url || j?.url || j?.signed_url
    res.status(200).json({ ws_url: wsUrl })
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}


