import { useEffect } from 'react'
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

  // Notificar al widget los cambios de estado del orbe (para iniciar/parar escucha)
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(isOpen ? 'siom-orb-open' : 'siom-orb-close'))
  }, [isOpen])

  // Siempre montado e invisible: controlamos por eventos (plan B)
  return <ExcelsiorWidget invisible={true} />
}


