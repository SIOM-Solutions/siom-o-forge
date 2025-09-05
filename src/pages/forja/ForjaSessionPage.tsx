import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getSessionContent, type LpItemContent } from '../../lib/getSessionContent'
import { useAuth } from '../../contexts/AuthContext'
import { loadUserLearningPath, type LpMateria } from '../../services/lp'

export default function ForjaSessionPage() {
  const { materiaSlug, dimensionSlug, sessionSlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<{ session?: any; dimension?: any; materia?: any } | null>(null)
  const [assets, setAssets] = useState<Array<{ kind: string; title?: string; url: string; position?: number }>>([])
  const [kpis, setKpis] = useState<Array<{ id: number; position: number; text: string; required: boolean }>>([])
  const [kpiDone, setKpiDone] = useState<Set<number>>(new Set())
  const [sideOpen, setSideOpen] = useState(false)
  const [sidePinned, setSidePinned] = useState(false)
  const [activeType, setActiveType] = useState<'gamma'|'video'|'link'|'document'|'all'|'lp'>('all')
  const [activeIdx, setActiveIdx] = useState(0)
  const [lpMaterias, setLpMaterias] = useState<LpMateria[]>([])
  const [lpLoading, setLpLoading] = useState(false)

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
          const content: LpItemContent = await getSessionContent(sessionSlug)
          a = Array.isArray(content.assets)
            ? content.assets.map((x: any, idx: number) => ({
                kind: resolveKind(x.type, x.url),
                title: x.title,
                url: x.url,
                position: x.position ?? idx,
              }))
            : []
          k = Array.isArray(content.kpis) ? content.kpis : []
        } catch {
          // Fallback a tabla plana si la RPC no existe o falla
          try {
            const { data: tabAssets, error: aErr } = await (supabase as any)
              .from('session_assets')
              .select('kind, title, url, position')
              .eq('session_id', sc.id)
              .order('position', { ascending: true })
            if (!aErr && Array.isArray(tabAssets) && tabAssets.length) {
              a = tabAssets.map((x: any, idx: number) => ({
                kind: resolveKind(x.kind, x.url),
                title: x.title,
                url: x.url,
                position: x.position ?? idx,
              }))
            }
          } catch {}
        }

        if (!cancelled) {
          setContext({ session: sc, dimension: dc, materia: mc })
          setAssets(a || [])
          setKpis(k || [])
          try { if (sessionSlug) localStorage.setItem(`kpiPlan:${sessionSlug}`, String((k || []).length || 0)) } catch {}
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

  // Cargar KPIs completados (local) por sesión
  useEffect(() => {
    try {
      if (!sessionSlug) return
      const raw = localStorage.getItem(`kpiDone:${sessionSlug}`)
      if (raw) setKpiDone(new Set(JSON.parse(raw)))
      else setKpiDone(new Set())
    } catch { setKpiDone(new Set()) }
  }, [sessionSlug])

  const toggleKpi = (id: number) => {
    try {
      const next = new Set(kpiDone)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      setKpiDone(next)
      if (sessionSlug) localStorage.setItem(`kpiDone:${sessionSlug}` , JSON.stringify(Array.from(next)))
    } catch {}
  }

  // Cargar snapshot del LP del usuario para la pestaña "LP"
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!user?.id) return
      setLpLoading(true)
      try {
        const data = await loadUserLearningPath(user.id)
        if (!cancelled) setLpMaterias(data)
      } catch {
        if (!cancelled) setLpMaterias([])
      } finally {
        if (!cancelled) setLpLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [user?.id])

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

  const toYouTubeEmbed = (url: string) => {
    try {
      const u = new URL(url)
      let id = ''
      let start = 0
      if (u.hostname.includes('youtu.be')) {
        id = u.pathname.slice(1)
        const t = u.searchParams.get('t')
        if (t) start = parseYTTimeToSeconds(t)
      } else if (u.hostname.includes('youtube.com')) {
        if (u.pathname.includes('/watch')) {
          id = u.searchParams.get('v') || ''
          const t = u.searchParams.get('t')
          const s = u.searchParams.get('start')
          if (t) start = parseYTTimeToSeconds(t)
          else if (s) start = parseInt(s, 10) || 0
        } else if (u.pathname.includes('/embed/')) {
          id = u.pathname.split('/embed/')[1]
          const s = u.searchParams.get('start')
          if (s) start = parseInt(s, 10) || 0
        }
      }
      if (!id) return url
      const qs = start > 0 ? `?start=${start}` : ''
      return `https://www.youtube.com/embed/${id}${qs}`
    } catch { return url }
  }

  const parseYTTimeToSeconds = (t: string) => {
    // accepts formats like '90', '90s', '1m30s', '1h2m3s'
    if (/^\d+$/.test(t)) return parseInt(t, 10)
    const re = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i
    const m = t.match(re)
    if (!m) return 0
    const h = parseInt(m[1] || '0', 10)
    const mnt = parseInt(m[2] || '0', 10)
    const s = parseInt(m[3] || '0', 10)
    return h * 3600 + mnt * 60 + s
  }

  const resolveKind = (type: string, url: string): 'gamma'|'video'|'link'|'document' => {
    const t = (type || '').toLowerCase()
    const raw = (url || '').trim()
    const u = raw.replace(/^@+/, '').toLowerCase()
    if (u.includes('gamma.app') || t.includes('gamma')) return 'gamma'
    if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com') || /\.(mp4|webm|mov)(\?|$)/.test(u) || t.includes('video')) return 'video'
    if (u.endsWith('.pdf') || t.includes('document') || t.includes('pdf')) return 'document'
    return 'link'
  }

  const renderAsset = (asset?: { kind: string; url: string }) => {
    if (!asset || !asset.url) return (
      <div className="h-[60vh] bg-gray-900 flex items-center justify-center text-gray-500">(Sin contenido asignado)</div>
    )
    const kind = (asset.kind || '').toLowerCase()
    const url = asset.url.replace(/^@+/, '')
    const isYouTube = /youtube\.com|youtu\.be/.test(url)
    if (kind === 'gamma' || (kind === 'link' && /gamma\.app/.test(url))) {
      const embed = toGammaEmbed(url)
      return <iframe src={embed} className="w-full h-[60vh]" allow="fullscreen; clipboard-write;" allowFullScreen />
    }
    if (kind === 'video' || (kind === 'link' && isYouTube)) {
      if (isYouTube) {
        const ytUrl = toYouTubeEmbed(url)
        return <iframe src={ytUrl} className="w-full h-[60vh]" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      }
      return <video className="w-full h-[60vh] bg-black" controls src={url} />
    }
    // link genérico
    return <iframe src={url} className="w-full h-[60vh]" />
  }

  const groupedAssets = useMemo(() => {
    const groups: Record<string, Array<{ idx: number; title: string }>> = {}
    assets.forEach((a, idx) => {
      const k = (a.kind || 'otros').toLowerCase()
      const title = a.title || `${k} #${(a.position ?? idx)+1}`
      if (!groups[k]) groups[k] = []
      groups[k].push({ idx, title })
    })
    return groups
  }, [assets])

  const kindLabel = (k: string) => {
    const t = k.toLowerCase()
    if (t === 'gamma') return 'Gamma'
    if (t === 'video') return 'Vídeos'
    if (t === 'link') return 'Enlaces'
    if (t === 'document' || t === 'pdf') return 'Documentos'
    return 'Otros'
  }

  const getProgramMeta = (materiaSlugLocal: string) => {
    const match = materiaSlugLocal?.match(/^M(\d+)_/)
    const idx = match ? parseInt(match[1], 10) : 999
    if (idx >= 1 && idx <= 3) return { key: 'p1', name: 'Programa 1' }
    if (idx >= 4 && idx <= 6) return { key: 'p2', name: 'Programa 2' }
    if (idx >= 7 && idx <= 9) return { key: 'p3', name: 'Programa 3' }
    if (idx === 10) return { key: 'p4', name: 'Programa 4' }
    return { key: 'px', name: 'Otros' }
  }
  return (
    <>
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
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-semibold">KPIs de la sesión</div>
                <div className="text-xs text-gray-400">{kpiDone.size}/{kpis.length} completados</div>
              </div>
              {kpis.length ? (
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                  {kpis.sort((a,b)=> (a.position??0)-(b.position??0)).map((k)=> (
                    <li key={k.id} className="flex items-start gap-2">
                      <button
                        className={`mt-0.5 w-4 h-4 rounded border ${kpiDone.has(k.id) ? 'bg-emerald-600 border-emerald-500' : 'border-gray-600 bg-gray-900'}`}
                        aria-label={kpiDone.has(k.id) ? 'Quitar completado' : 'Marcar como completado'}
                        onClick={() => toggleKpi(k.id)}
                      />
                      <span className={`${kpiDone.has(k.id)?'text-emerald-300':''}`}>{k.text}</span>
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
    {/* Barra lateral con pestañita (overlay derecha) */}
    <div
      className="fixed top-0 right-0 z-50 h-screen"
      onMouseEnter={() => !sidePinned && setSideOpen(true)}
      onMouseLeave={() => !sidePinned && setSideOpen(false)}
    >
      <div className={`transition-all duration-300 ease-out ${sideOpen ? 'w-[32rem]' : 'w-4'} h-full bg-gray-950/90 border-l border-gray-800 backdrop-blur-md rounded-l-xl overflow-hidden shadow-xl`}>
        {/* Pestañita visible siempre */}
        {!sideOpen && (
          <div className="h-40 w-3 flex items-center justify-center cursor-pointer">
            <div className="rotate-180 writing-vertical-lr text-[10px] text-gray-400 select-none" style={{ writingMode: 'vertical-rl' }}>Contenidos</div>
          </div>
        )}
        {sideOpen && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-400">Contenidos de la sesión</div>
              <button className={`text-[10px] px-2 py-0.5 rounded border ${sidePinned?'border-emerald-700 text-emerald-300':'border-gray-700 text-gray-400'}`} onClick={()=>setSidePinned(v=>!v)}>{sidePinned?'Fijado':'Fijar'}</button>
            </div>

            {/* Tabs de tipo */}
            <div className="flex items-center gap-2 mb-3">
              {['all','gamma','video','link','document','lp'].map((t) => (
                <button key={t} onClick={()=>setActiveType(t as any)} className={`text-[11px] px-2 py-0.5 rounded border ${activeType===t?'border-cyan-700 text-cyan-300 bg-cyan-900/10':'border-gray-700 text-gray-400 hover:text-gray-300'}`}>{t==='all'?'Todos':(t==='lp'?'LP':kindLabel(t))}</button>
              ))}
            </div>
            {Object.keys(groupedAssets).length === 0 && (
              <div className="text-xs text-gray-500">Sin contenidos</div>
            )}
            <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
              {Object.entries(groupedAssets).filter(([k])=> activeType==='all' || k===activeType).map(([k, items]) => (
                <div key={k}>
                  <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{kindLabel(k)}</div>
                  <ul className="space-y-1">
                    {items.map(({ idx, title }) => (
                      <li key={`${k}-${idx}`}>
                        <button
                          className={`w-full text-left px-2 py-1 rounded border ${idx===activeIdx ? 'border-cyan-700 text-cyan-300 bg-cyan-900/10' : 'border-gray-700 text-gray-300 bg-gray-900/60 hover:bg-gray-900'}`}
                          onClick={() => setActiveIdx(idx)}
                        >
                          <span className="text-xs">{title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {activeType==='lp' && (
                <div className="space-y-2">
                  {lpLoading && (<div className="text-xs text-gray-500">Cargando LP…</div>)}
                  {!lpLoading && lpMaterias.length === 0 && (<div className="text-xs text-gray-500">(LP vacío)</div>)}
                  {!lpLoading && lpMaterias.length > 0 && (
                    <div className="space-y-3">
                      {lpMaterias.map((m) => (
                        <div key={m.id}>
                          <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{getProgramMeta(m.slug).name} · {m.name}</div>
                          <ul className="space-y-1">
                            {m.dimensions.map((d) => (
                              <li key={d.id}>
                                <div className="text-[11px] text-gray-400 mb-1">{d.name}</div>
                                <div className="grid grid-cols-1 gap-1">
                                  {d.sessions.map((s) => (
                                    <button key={s.id} className="w-full text-left px-2 py-1 rounded border border-gray-700 text-gray-300 bg-gray-900/60 hover:bg-gray-900"
                                            onClick={() => navigate(`/forja/${m.slug}/${d.slug}/${s.slug}`)}>
                                      <span className="text-xs">{s.name}</span>
                                    </button>
                                  ))}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}


