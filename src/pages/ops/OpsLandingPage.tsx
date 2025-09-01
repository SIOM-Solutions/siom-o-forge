export default function OpsLandingPage() {
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
        </div>

        {/* Áreas de Asesoría */}
        <div className="hud-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Áreas de Asesoría</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900/60 border border-amber-800 rounded-lg p-4">
              <div className="text-white font-semibold mb-1">Negociación de Alto Impacto</div>
              <p className="text-gray-300 text-sm">Arquitectura de concesiones, anclas, BATNA, guiones; preparación táctica para reuniones críticas.</p>
            </div>
            <div className="bg-gray-900/60 border border-amber-800 rounded-lg p-4">
              <div className="text-white font-semibold mb-1">Análisis Táctico de la Personalidad</div>
              <p className="text-gray-300 text-sm">Perfiles, señales conductuales, escalada/desescalada y lectura del otro con precisión operativa.</p>
            </div>
            <div className="bg-gray-900/60 border border-amber-800 rounded-lg p-4">
              <div className="text-white font-semibold mb-1">Núcleos de Poder y Redes de Influencia</div>
              <p className="text-gray-300 text-sm">Mapear stakeholders, priorizar actores clave y trazar rutas de acceso con ventaja política.</p>
            </div>
            <div className="bg-gray-900/60 border border-amber-800 rounded-lg p-4">
              <div className="text-white font-semibold mb-1">Pensamiento Estratégico y Problemas Complejos</div>
              <p className="text-gray-300 text-sm">Opciones, COAs, wargaming y marcos de decisión para contextos de alta incertidumbre.</p>
            </div>
          </div>
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


