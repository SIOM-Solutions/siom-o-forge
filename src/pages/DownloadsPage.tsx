import { motion } from 'framer-motion'

export default function DownloadsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-2">Mis descargas</h1>
        <p className="text-gray-400 mb-6">Recursos y materiales asociados a tus programas y auditorías.</p>
        <div className="hud-card p-6 text-gray-400">
          <p>Próximamente: listado de recursos disponibles, histórico y seguimiento de descargas.</p>
        </div>
      </div>
    </motion.div>
  )
}


