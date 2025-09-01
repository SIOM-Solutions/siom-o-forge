import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { loadOpsCoverage, aggregateOpsCoverageByArea } from '../../services/ops'

export default function OpsLandingPage() {
  const { user } = useAuth()
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [areaStatus, setAreaStatus] = useState<Record<string, { enabled: boolean; minutesPerMonth?: number | null; tokensPerMonth?: number | null; minutesRemaining?: number | null; tokensRemaining?: number | null }>>({})

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!user) return
      // Gating OPS
      try {
        const { data } = await (supabase as any)
          .from('user_access')
          .select('forge_ops')
          .eq('user_id', user.id)
          .maybeSingle()
        if (!cancelled) setEnabled(Boolean(data?.forge_ops))
      } catch { if (!cancelled) setEnabled(false) }
      // Cobertura por asesor desde RPC
      try {
        const rows = await loadOpsCoverage()
        if (!cancelled) setAreaStatus(aggregateOpsCoverageByArea(rows))
      } catch {}
    }
    run()
    return () => { cancelled = true }
  }, [user?.id])

  const gated = enabled === false

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-white mb-2">SIOM OPS™ — Centro de Operaciones Estratégicas</h1>
          <p className="text-gray-300 max-w-3xl mx-auto">“<span className="text-amber-300 font-semibold">Del conocimiento a la acción</span> en tiempo real.” Asesores Tácticos en vivo (voz + texto) para resolver <span className="text-white font-semibold">retos críticos</span> con metodologías de INTEL y Operaciones Especiales.</p>
        </div>

        {/* Qué hace único a OPS */}
        <div className="hud-card p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">SIOM OPS — Asesores Tácticos (voz + texto, en vivo)</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Pasa de “saber” a <span className="text-white font-semibold">resolver</span>: el asesor entra en tu caso y te guía con marcos tácticos aplicados a tu situación.</li>
            <li>• Interfaz dual: <span className="text-white font-semibold">orbe conversacional</span> (voz) + <span className="text-white font-semibold">chat</span> (texto) para interactuar de forma natural.</li>
            <li>• Tiempo real: prepara una negociación en 10 minutos o rediseña una jugada política sobre la marcha.</li>
          </ul>
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div className="rounded-xl overflow-hidden border border-amber-800">
              <img src="/images/ops/ops-hero-1.jpg" alt="OPS — Centro de Operaciones Estratégicas, imagen 1" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden border border-amber-800">
              <img src="/images/ops/ops-hero-2.jpg" alt="OPS — Centro de Operaciones Estratégicas, imagen 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Áreas de Asesoría */}
        <div className="hud-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Áreas de Asesoría</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`bg-gray-900/60 border rounded-lg p-4 ${areaStatus.negociacion?.enabled ? 'border-amber-800' : 'border-gray-800 opacity-70'}`}>
              <div className="text-white font-semibold mb-1">Negociación de Alto Impacto</div>
              <p className="text-gray-300 text-sm">Arquitectura de concesiones, anclas, BATNA, guiones; preparación táctica para reuniones críticas.</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full border ${areaStatus.negociacion?.enabled ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>{areaStatus.negociacion?.enabled ? 'Disponible' : 'No asignado'}</span>
                {areaStatus.negociacion?.minutesPerMonth != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Voz: {areaStatus.negociacion.minutesPerMonth} min/mes</span>)}
                {areaStatus.negociacion?.minutesRemaining != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante voz: {areaStatus.negociacion.minutesRemaining} min</span>)}
                {areaStatus.negociacion?.tokensPerMonth != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Chat: {areaStatus.negociacion.tokensPerMonth} tokens/mes</span>)}
                {areaStatus.negociacion?.tokensRemaining != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante chat: {areaStatus.negociacion.tokensRemaining}</span>)}
              </div>
            </div>
            <div className={`bg-gray-900/60 border rounded-lg p-4 ${areaStatus.analisis?.enabled ? 'border-amber-800' : 'border-gray-800 opacity-70'}`}>
              <div className="text-white font-semibold mb-1">Análisis Táctico de la Personalidad</div>
              <p className="text-gray-300 text-sm">Perfiles, señales conductuales, escalada/desescalada y lectura del otro con precisión operativa.</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full border ${areaStatus.analisis?.enabled ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>{areaStatus.analisis?.enabled ? 'Disponible' : 'No asignado'}</span>
                {areaStatus.analisis?.minutesPerMonth != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Voz: {areaStatus.analisis.minutesPerMonth} min/mes</span>)}
                {areaStatus.analisis?.minutesRemaining != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante voz: {areaStatus.analisis.minutesRemaining} min</span>)}
                {areaStatus.analisis?.tokensPerMonth != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Chat: {areaStatus.analisis.tokensPerMonth} tokens/mes</span>)}
                {areaStatus.analisis?.tokensRemaining != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante chat: {areaStatus.analisis.tokensRemaining}</span>)}
              </div>
            </div>
            <div className={`bg-gray-900/60 border rounded-lg p-4 ${areaStatus.nucleos?.enabled ? 'border-amber-800' : 'border-gray-800 opacity-70'}`}>
              <div className="text-white font-semibold mb-1">Núcleos de Poder y Redes de Influencia</div>
              <p className="text-gray-300 text-sm">Mapear stakeholders, priorizar actores clave y trazar rutas de acceso con ventaja política.</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full border ${areaStatus.nucleos?.enabled ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>{areaStatus.nucleos?.enabled ? 'Disponible' : 'No asignado'}</span>
                {areaStatus.nucleos?.minutesPerMonth != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Voz: {areaStatus.nucleos.minutesPerMonth} min/mes</span>)}
                {areaStatus.nucleos?.minutesRemaining != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante voz: {areaStatus.nucleos.minutesRemaining} min</span>)}
                {areaStatus.nucleos?.tokensPerMonth != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Chat: {areaStatus.nucleos.tokensPerMonth} tokens/mes</span>)}
                {areaStatus.nucleos?.tokensRemaining != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante chat: {areaStatus.nucleos.tokensRemaining}</span>)}
              </div>
            </div>
            <div className={`bg-gray-900/60 border rounded-lg p-4 ${areaStatus.estrategia?.enabled ? 'border-amber-800' : 'border-gray-800 opacity-70'}`}>
              <div className="text-white font-semibold mb-1">Pensamiento Estratégico y Problemas Complejos</div>
              <p className="text-gray-300 text-sm">Opciones, COAs, wargaming y marcos de decisión para contextos de alta incertidumbre.</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full border ${areaStatus.estrategia?.enabled ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>{areaStatus.estrategia?.enabled ? 'Disponible' : 'No asignado'}</span>
                {areaStatus.estrategia?.minutesPerMonth != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Voz: {areaStatus.estrategia.minutesPerMonth} min/mes</span>)}
                {areaStatus.estrategia?.minutesRemaining != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante voz: {areaStatus.estrategia.minutesRemaining} min</span>)}
                {areaStatus.estrategia?.tokensPerMonth != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Chat: {areaStatus.estrategia.tokensPerMonth} tokens/mes</span>)}
                {areaStatus.estrategia?.tokensRemaining != null && (<span className="px-2 py-0.5 rounded-full border bg-gray-900/60 text-gray-300 border-gray-800">Restante chat: {areaStatus.estrategia.tokensRemaining}</span>)}
              </div>
            </div>
          </div>
          {gated && (<div className="mt-3 text-xs text-amber-300">Tu acceso a OPS no está activo. Solicita activación para iniciar sesiones con Asesores Tácticos.</div>)}
        </div>

        {/* Entregables inmediatos */}
        <div className="hud-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Entregables inmediatos</h3>
          <ul className="text-gray-300 grid md:grid-cols-2 gap-2">
            <li>• Playbooks y guiones listos para usar en interacciones críticas.</li>
            <li>• Mapas de stakeholders, matrices de influencia y lista de acciones por prioridad.</li>
            <li>• Mensajes clave: qué decir, cómo decirlo y cuándo decirlo.</li>
            <li>• Informe SIOM de cierre con próximos pasos; alimenta la siguiente sesión.</li>
          </ul>
        </div>

        {/* Datos y continuidad */}
        <div className="hud-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Datos, personalización y continuidad</h3>
          <p className="text-gray-300">Contexto único por alumno: resultados AIR, progreso en materias, perfil PSITAC e informes previos para <span className="text-white font-semibold">personalizar</span> cada intervención. Sesión tras sesión, el sistema <span className="text-white font-semibold">recuerda</span> acuerdos, riesgos y próximos hitos; cada Informe SIOM se indexa para dar continuidad estratégica.</p>
          <div className="mt-3 text-xs text-gray-400">Privacidad & Seguridad: datos cifrados, accesos por rol y trazabilidad completa.</div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center gap-3">
          <a className="btn btn-ops" href="#asesores">Explorar Asesores</a>
          <a className="btn btn-secondary" href="#playbooks">Ver Playbooks</a>
        </div>

        {/* Fondo radar sutil (solo OPS) */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-30" style={{
          backgroundImage: `radial-gradient(600px 600px at 85% 20%, rgba(220,38,38,0.12), transparent), radial-gradient(500px 500px at 10% 60%, rgba(234,88,12,0.10), transparent)`,
        }} />
      </div>
    </div>
  )
}


