export const config = { runtime: 'edge' }

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
  const voice = process.env.OPENAI_REALTIME_VOICE || 'ash'

  // Instrucciones por defecto (Excelsior guía de plataforma) si no se proveen aún
  const defaultInstructions = `Eres SIOM Excelsior, guía de la plataforma O‑Forge. Tu función es ayudar a navegar, explicar secciones y derivar a instructores o asesores para contenidos de materias. No reveles detalles técnicos internos ni arquitectura. Mantén el tono ejecutivo y preciso. Idioma: español (España).`
  const instructions = process.env.OPENAI_EXCELSIOR_INSTRUCTIONS || defaultInstructions

  try {
    const r = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'realtime=v1',
      },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model,
          voice,
          modalities: ['audio', 'text'],
          output_audio_format: 'pcm16',
          instructions,
        },
      }),
    })

    if (!r.ok) {
      const text = await r.text()
      return new Response(text, { status: r.status, headers: { ...cors, 'content-type': 'application/json' } })
    }
    const data = await r.json()
    return new Response(JSON.stringify(data), {
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


