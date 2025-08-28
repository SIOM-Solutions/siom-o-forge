import { useLocation } from 'react-router-dom'
// Widget desactivado: la conexión es 100% WS propio
import { } from '../contexts/ExcelsiorContext'

export default function ExcelsiorHost() {
  const location = useLocation()

  // Rutas donde ocultar Excelsior (reservado para futuros asistentes específicos)
  const hideOn = [
    /^\/performance\/forja/,
    /^\/ops\/sesion/,
  ]

  const hidden = hideOn.some((re) => re.test(location.pathname))

  if (hidden) return null

  // No renderizamos nada; Excelsior funciona por WS directo
  return null
}


