import { useLocation } from 'react-router-dom'
import ExcelsiorWidget from './ExcelsiorWidget'

export default function ExcelsiorHost() {
  const location = useLocation()

  // Rutas donde ocultar Excelsior (reservado para futuros asistentes específicos)
  const hideOn = [
    /^\/performance\/forja/,
    /^\/ops\/sesion/,
  ]

  const hidden = hideOn.some((re) => re.test(location.pathname))

  if (hidden) return null

  // Montamos siempre (invisible) para poder activarlo con el Orb en el mismo gesto
  return <ExcelsiorWidget invisible={true} />
}


