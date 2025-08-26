import React, { createContext, useContext, useMemo, useState } from 'react'

interface ExcelsiorContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const ExcelsiorContext = createContext<ExcelsiorContextType | undefined>(undefined)

export function ExcelsiorProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((v) => !v)

  const value = useMemo<ExcelsiorContextType>(() => ({ isOpen, open, close, toggle }), [isOpen])

  return (
    <ExcelsiorContext.Provider value={value}>
      {children}
    </ExcelsiorContext.Provider>
  )
}

export function useExcelsior() {
  const ctx = useContext(ExcelsiorContext)
  if (!ctx) throw new Error('useExcelsior must be used within an ExcelsiorProvider')
  return ctx
}


