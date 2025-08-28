import { useLocation } from 'react-router-dom'
import ExcelsiorWidget from './ExcelsiorWidget'
import { useExcelsior } from '../contexts/ExcelsiorContext'

export default function ExcelsiorHost() {
  const location = useLocation()
  const { isOpen } = useExcelsior()

  // Rutas donde ocultar Excelsior (reservado para futuros asistentes específicos)
  const hideOn = [
    /^\/performance\/forja/,
    /^\/ops\/sesion/,
  ]

  const hidden = hideOn.some((re) => re.test(location.pathname))

  if (hidden) return null

  // Visible cuando el orbe está activo; invisible cuando está cerrado
  return <ExcelsiorWidget invisible={!isOpen} />
}


