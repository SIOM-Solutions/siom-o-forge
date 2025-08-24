import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { UserAccess } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface AccessContextType {
  access: UserAccess | null
  loading: boolean
  error: string | null
  refreshAccess: () => Promise<void>
}

const AccessContext = createContext<AccessContextType | undefined>(undefined)

const defaultAccess: Omit<UserAccess, 'user_id'> = {
  air: false,
  forge_performance: false,
  forge_ops: false,
  psitac: false,
}

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [access, setAccess] = useState<UserAccess | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccess = async () => {
    if (!user) {
      setAccess(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { data, error: qError } = await supabase
        .from('user_access')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (qError) {
        // Si hay error de consulta, registramos pero no rompemos la app
        setError(qError.message)
      }

      if (data) {
        setAccess(data as UserAccess)
      } else {
        // Sin registro: negar todo por defecto
        setAccess({ user_id: user.id, ...defaultAccess })
      }
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar permisos')
      setAccess(user ? { user_id: user.id, ...defaultAccess } : null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const value = useMemo<AccessContextType>(() => ({
    access,
    loading,
    error,
    refreshAccess: fetchAccess,
  }), [access, loading, error])

  return (
    <AccessContext.Provider value={value}>
      {children}
    </AccessContext.Provider>
  )
}

export function useAccess() {
  const ctx = useContext(AccessContext)
  if (!ctx) throw new Error('useAccess must be used within an AccessProvider')
  return ctx
}


