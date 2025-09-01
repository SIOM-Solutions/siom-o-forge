export const config = { runtime: 'nodejs22.x' }

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin') || '*'
  const cors = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: cors })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return new Response('Missing OPENAI_API_KEY', { status: 500, headers: cors })
  }

  const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime'

  try {
    const promptId = process.env.OPENAI_REALTIME_PROMPT_ID
    const promptVersionEnv = process.env.OPENAI_REALTIME_PROMPT_VERSION
    const promptVersion = promptVersionEnv ? Number(promptVersionEnv) : undefined
    const vsEnv = process.env.OPENAI_VECTOR_STORE_IDS
    const vectorStoreIds = vsEnv ? vsEnv.split(',').map(s=>s.trim()).filter(Boolean) : []

    const r = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'realtime=v1',
      },
      body: JSON.stringify({
        model,
        ...(promptId ? { prompt: { id: promptId, ...(Number.isFinite(promptVersion) ? { version: promptVersion } : {}) } } : {}),
      }),
    })

    if (!r.ok) {
      const text = await r.text()
      return new Response(text, { status: r.status, headers: { ...cors, 'content-type': 'application/json' } })
    }
    const data = await r.json()
    // Adjuntamos metadatos útiles para el cliente (no se envían a /sessions)
    const payload = {
      ...data,
      ...(vectorStoreIds.length ? { vector_store_ids: vectorStoreIds } : {}),
    }
    return new Response(JSON.stringify(payload), {
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


git checkout elevenlabs-native-clean
git commit --allow-empty -m "chore(vercel): redeploy preview to load envs"
git push origin elevenlabs-native-clean

