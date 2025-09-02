import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ForjaSessionPage() {
  const { materiaSlug, dimensionSlug, sessionSlug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<{ session?: any; dimension?: any; materia?: any } | null>(null)
  const [assets, setAssets] = useState<Array<{ kind: string; title?: string; url: string; position?: number }>>([])
  const [kpis, setKpis] = useState<Array<{ id: number; position: number; text: string; required: boolean }>>([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!sessionSlug || !materiaSlug || !dimensionSlug) return
      setLoading(true)
      setError(null)
      try {
        // 1) Materia por slug (limit 1 por si hay duplicados)
        const { data: mc, error: eM } = await (supabase as any)
          .from('materias_catalog')
          .select('id, slug, name')
          .eq('slug', materiaSlug)
          .limit(1)
          .maybeSingle()
        if (eM) throw eM
        if (!mc) throw new Error('Materia no encontrada')

        // 2) Dimensión por slug y materia
        const { data: dc, error: eD } = await (supabase as any)
          .from('dimensions_catalog')
          .select('id, slug, name, materia_id')
          .eq('slug', dimensionSlug)
          .eq('materia_id', mc.id)
          .limit(1)
          .maybeSingle()
        if (eD) throw eD
        if (!dc) throw new Error('Dimensión no encontrada')

        // 3) Sesión por slug y dimensión
        const { data: sc, error: eS } = await (supabase as any)
          .from('sessions_catalog')
          .select('id, slug, name, dimension_id')
          .eq('slug', sessionSlug)
          .eq('dimension_id', dc.id)
          .limit(1)
          .maybeSingle()
        if (eS) throw eS
        if (!sc) throw new Error('Sesión no encontrada')

        // Preferir RPC oficial: get_lp_item_content(p_session_slug)
        let a: any[] = []
        let k: any[] = []
        try {
          const { data: content, error: cErr } = await (supabase as any)
            .rpc('get_lp_item_content', { p_session_slug: sessionSlug })
          if (cErr) throw cErr
          if ((content as any)?.error) throw new Error(String((content as any).error))
          if (content) {
            a = Array.isArray(content.assets) ? content.assets.map((x: any) => ({ kind: x.type, title: x.title, url: x.url, position: x.position })) : []
            k = Array.isArray(content.kpis) ? content.kpis : []
          }
        } catch {
          // Fallback a tabla plana si la RPC no existe o falla
          try {
            const { data: tabAssets, error: aErr } = await (supabase as any)
              .from('session_assets')
              .select('kind, title, url, position')
              .eq('session_id', sc.id)
              .order('position', { ascending: true })
            if (!aErr && Array.isArray(tabAssets) && tabAssets.length) a = tabAssets
          } catch {}
        }

        if (!cancelled) {
          setContext({ session: sc, dimension: dc, materia: mc })
          setAssets(a || [])
          setKpis(k || [])
          setActiveIdx(0)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'No se pudo cargar la sesión')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [sessionSlug])

  const breadcrumb = useMemo(() => {
    const m = context?.materia?.slug || materiaSlug
    const d = context?.dimension?.slug || dimensionSlug
    const s = context?.session?.slug || sessionSlug
    return `${m} · ${d} · ${s}`
  }, [context, materiaSlug, dimensionSlug, sessionSlug])

  const activeAsset = assets[activeIdx]

  const toGammaEmbed = (url: string) => {
    // Acepta doc: https://gamma.app/docs/...-<id>  o embed: https://gamma.app/embed/<id>
    try {
      const m = url.match(/([a-z0-9]{14,})$/i)
      if (m && m[1]) return `https://gamma.app/embed/${m[1]}`
    } catch {}
    if (url.includes('/embed/')) return url
    return url
  }

  const renderAsset = (asset?: { kind: string; url: string }) => {
    if (!asset || !asset.url) return (
      <div className="h-[60vh] bg-gray-900 flex items-center justify-center text-gray-500">(Sin contenido asignado)</div>
    )
    const kind = (asset.kind || '').toLowerCase()
    const url = asset.url
    const isYouTube = /youtube\.com|youtu\.be/.test(url)
    if (kind === 'gamma' || (kind === 'link' && /gamma\.app/.test(url))) {
      const embed = toGammaEmbed(url)
      return <iframe src={embed} className="w-full h-[60vh]" allow="fullscreen; clipboard-write;" />
    }
    if (kind === 'video') {
      if (isYouTube) {
        const ytUrl = url.includes('embed') ? url : url.replace('watch?v=', 'embed/')
        return <iframe src={ytUrl} className="w-full h-[60vh]" allow="autoplay; fullscreen; picture-in-picture" />
      }
      return <video className="w-full h-[60vh] bg-black" controls src={url} />
    }
    // link genérico
    return <iframe src={url} className="w-full h-[60vh]" />
  }
  return (
    <div className="px-6 lg:px-12">
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">Sala de Forja</h1>
          <div className="text-gray-400 text-sm">{breadcrumb}</div>
        </div>

        {loading && (<div className="hud-card p-6 text-gray-400">Cargando sesión…</div>)}
        {error && (<div className="hud-card p-6 text-red-300">{error}</div>)}

        {!loading && !error && (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Columna izquierda: Visualizador (2/3) */}
          <div className="md:col-span-2 space-y-4">
            <div className="hud-card p-0 overflow-hidden">
              <div className="bg-gray-950/60 border-b border-gray-800 px-4 py-2 text-sm text-gray-400">Visualizador de contenidos</div>
              {renderAsset(activeAsset)}
            </div>
            {assets.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {assets.map((a, idx) => (
                  <button key={idx} className={`px-2 py-1 rounded border text-xs ${idx===activeIdx?'border-cyan-700 text-cyan-300 bg-cyan-900/10':'border-gray-700 text-gray-300 bg-gray-900/60'}`} onClick={()=>setActiveIdx(idx)}>
                    {a.title || a.kind || `Asset ${idx+1}`}
                  </button>
                ))}
              </div>
            )}

            {/* Chat de texto (debajo, mismo ancho) */}
            <div className="hud-card p-0 overflow-hidden">
              <div className="bg-gray-950/60 border-b border-gray-800 px-4 py-2 text-sm text-gray-400">Chat del instructor (texto)</div>
              <div className="h-64 bg-gray-900 p-4 text-gray-400 text-sm">
                <div className="opacity-70">(UI de chat se integrará en el siguiente paso: authorize + streaming de respuestas)</div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Orbe + Iniciar + KPIs */}
          <div className="space-y-4">
            <div className="hud-card p-5 flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full flex items-center justify-center"
                   style={{ background: 'radial-gradient(closest-side, rgba(34,197,94,0.15), rgba(0,0,0,0))', boxShadow: '0 0 30px rgba(34,197,94,0.15)' }}>
                <div className="w-28 h-28 rounded-full bg-gray-900 border border-emerald-800/60 shadow-inner" />
              </div>
              <button className="btn btn-secondary mt-4">Iniciar instructor</button>
              <div className="mt-2 text-xs text-gray-500">El orbe es visual; inicia con el botón.</div>
            </div>

            <div className="hud-card p-4">
              <div className="text-white font-semibold mb-2">KPIs de la sesión</div>
              {kpis.length ? (
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                  {kpis.sort((a,b)=> (a.position??0)-(b.position??0)).map((k)=> (
                    <li key={k.id} className="flex items-start gap-2">
                      <span>{k.text}</span>
                      {k.required && (<span className="text-amber-300 text-xs">(obligatorio)</span>)}
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-sm text-gray-400">(Sin KPIs configurados)</div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}


