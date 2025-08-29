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

    const url = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`
    const upstream = await fetch(url, { headers: { 'xi-api-key': apiKey } })
    const text = await upstream.text()
    let data: any = null
    try { data = JSON.parse(text) } catch { data = null }

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: 'Upstream error', details: data || text }), {
        status: upstream.status,
        headers: { ...cors, 'content-type': 'application/json' },
      })
    }

    const signed = data?.signed_url || data?.ws_url || data?.websocket_url || data?.url
    if (!signed) {
      return new Response(JSON.stringify({ error: 'No signed_url in upstream response', details: data || text }), {
        status: 502,
        headers: { ...cors, 'content-type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ws_url: signed }), {
      status: 200,
      headers: { ...cors, 'content-type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), {
      status: 500,
      headers: { ...cors, 'content-type': 'application/json' },
    })
  }
}


