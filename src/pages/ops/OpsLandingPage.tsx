export default function OpsLandingPage() {
  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-white mb-3">SIOM OPS™ — Centro de Operaciones Estratégicas</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Auditoría y despliegue de sistemas, automatizaciones e IA aplicada para reducir fricción operativa y escalar productividad.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Solicitar auditoría OPS</h3>
            <a className="btn btn-ops" href="mailto:contacto@siomsolutions.com?subject=Solicitud%20auditor%C3%ADa%20OPS">Contactar</a>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Casos de uso</h3>
            <p className="text-gray-400">Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}


