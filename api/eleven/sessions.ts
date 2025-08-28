export const config = { runtime: 'nodejs18.x' }

function corsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
  }
}

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin')

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders(origin) })
  }

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing ELEVENLABS_API_KEY' }), {
        status: 500,
        headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
      })
    }

    const body = await req.json().catch(() => ({}))
    const agentId: string | undefined = body?.agent_id
    if (!agentId) {
      return new Response(JSON.stringify({ error: 'agent_id is required' }), {
        status: 400,
        headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
      })
    }

    // Intento 1: get_signed_url
    const url1 = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${encodeURIComponent(agentId)}`
    let r = await fetch(url1, { headers: { 'xi-api-key': apiKey } })
    let data: any = null
    if (r.ok) {
      data = await r.json().catch(() => null)
    } else {
      // Intento 2: get-signed-url (variación)
      const url2 = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`
      r = await fetch(url2, { headers: { 'xi-api-key': apiKey } })
      if (r.ok) data = await r.json().catch(() => null)
    }

    const signed = data?.signed_url || data?.ws_url || null
    if (!signed) {
      const text = await r.text()
      return new Response(JSON.stringify({ error: 'Failed to get signed_url', details: text }), {
        status: 502,
        headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
      })
    }

    return new Response(JSON.stringify({ ok: true, ws_url: signed }), {
      status: 200,
      headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
    })
  }
}


