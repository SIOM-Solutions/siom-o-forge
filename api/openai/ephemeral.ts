export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return new Response('Missing OPENAI_API_KEY', { status: 500 })
  }

  const url = new URL(req.url)
  const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2025-06-03'
  const voice = process.env.OPENAI_REALTIME_VOICE || 'ash'

  // Instrucciones por defecto (Excelsior guía de plataforma) si no se proveen aún
  const defaultInstructions = `Eres SIOM Excelsior, guía de la plataforma O‑Forge. Tu función es ayudar a navegar, explicar secciones y derivar a instructores o asesores para contenidos de materias. No reveles detalles técnicos internos ni arquitectura. Mantén el tono ejecutivo y preciso. Idioma: español (España).`
  const instructions = process.env.OPENAI_EXCELSIOR_INSTRUCTIONS || defaultInstructions

  // Vector Stores (materia y/o plataforma) opcionales
  const envStores = (process.env.OPENAI_VECTOR_STORE_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const userStore = url.searchParams.get('user_store') || ''
  const vectorStoreIds = Array.from(new Set([...envStores, userStore].filter(Boolean)))

  try {
    const r = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'realtime=v1',
      },
      body: JSON.stringify({
        model,
        voice,
        instructions,
        ...(vectorStoreIds.length
          ? { tools: [{ type: 'file_search' }], tool_resources: { file_search: { vector_store_ids: vectorStoreIds } } }
          : {}),
      }),
    })

    if (!r.ok) {
      const text = await r.text()
      return new Response(text, { status: r.status })
    }
    const data = await r.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}


