import { useLocation } from 'react-router-dom'
import ExcelsiorWidget from './ExcelsiorWidget'
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

  // SDK/WS: ocultamos totalmente el widget (no UI externa)
  return <ExcelsiorWidget invisible={true} />
}


