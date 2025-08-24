export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold text-white mb-2">Página no encontrada</h1>
        <p className="text-gray-400 mb-6">La ruta a la que intentas acceder no existe.</p>
        <a href="/hub" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200">Ir al Hub</a>
      </div>
    </div>
  )
}


