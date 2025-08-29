export const config = { runtime: 'nodejs' }

export default async function handler(req: any, res: any) {
  // Cabeceras JSON por defecto
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
  } catch {}
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
    if (!body) {
      // Fallback para builders que no parsean automáticamente
      const raw = await new Promise<string>((resolve, reject) => {
        try {
          let data = ''
          req.on('data', (c: Buffer) => { data += c.toString() })
          req.on('end', () => resolve(data))
          req.on('error', reject)
        } catch (e) { resolve('') }
      })
      try { body = raw ? JSON.parse(raw) : {} } catch { body = {} }
    } else if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch { body = {} }
    }
    const agentId = (body && body.agent_id) || process.env.VITE_EXCELSIOR_AGENT_ID
    if (!agentId) {
      res.status(400).json({ error: 'Missing agent_id' })
      return
    }

    // Endpoint oficial: GET get-signed-url
    const url = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`
    const r = await fetch(url, { headers: { 'xi-api-key': apiKey } })
    const text = await r.text()
    let data: any = null
    try { data = JSON.parse(text) } catch { data = null }

    if (!r.ok) {
      res.status(r.status).json({ error: 'Upstream error', details: data || text })
      return
    }

    const signed = data?.signed_url || data?.ws_url || data?.websocket_url || data?.url
    if (!signed) {
      res.status(502).json({ error: 'No signed_url in upstream response', details: data || text })
      return
    }

    res.status(200).json({ ws_url: signed })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unknown error' })
  }
}


