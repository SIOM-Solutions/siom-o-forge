export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') || '*'
  const cors = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...cors, 'content-type': 'application/json' },
    })
  }

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing ELEVENLABS_API_KEY' }), {
        status: 500,
        headers: { ...cors, 'content-type': 'application/json' },
      })
    }

    const body = await req.json().catch(() => ({} as any))
    const agentId = (body && body.agent_id) || process.env.VITE_EXCELSIOR_AGENT_ID
    if (!agentId) {
      return new Response(JSON.stringify({ error: 'Missing agent_id' }), {
        status: 400,
        headers: { ...cors, 'content-type': 'application/json' },
      })
    }

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
      return new Response(j ? JSON.stringify(j) : JSON.stringify({ error: 'Upstream error', details: text }), {
        status: r.status,
        headers: { ...cors, 'content-type': 'application/json' },
      })
    }

    const wsUrl = j?.websocket_url || j?.ws_url || j?.url || j?.signed_url
    return new Response(JSON.stringify({ ws_url: wsUrl }), {
      status: 200,
      headers: { ...cors, 'content-type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...cors, 'content-type': 'application/json' },
    })
  }
}


