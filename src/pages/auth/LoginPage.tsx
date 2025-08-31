import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import TechBackground from '../../components/TechBackground'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message)
      } else {
        navigate('/welcome')
      }
    } catch (err: any) {
      setError('Error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-950">
      <TechBackground />
      <div className="relative z-10 max-w-7xl mx-auto min-h-screen grid md:grid-cols-2 gap-8 items-center place-items-center p-6">
        <div className="hidden md:block justify-self-start text-center">
          <img src="/brand/logo-oro.png" alt="SIOM Solutions" className="mx-auto mb-6 h-[28rem] w-auto logo-hero animate-float" />
          <h1 className="text-4xl font-bold text-white mb-2">O‑Forge</h1>
          <p className="text-gray-400 max-w-md mx-auto">El ecosistema de inteligencia híbrida de élite de SIOM Solutions</p>
        </div>

        <div className="w-full max-w-md md:ml-auto justify-self-end">
          <div className="relative rounded-2xl p-8 border border-gray-700/60 bg-gray-900/70 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ maskImage: 'radial-gradient(60% 40% at 100% 0%, rgba(255,255,255,0.2), transparent)' }} />
            <div className="text-center mb-6">
              <p className="text-gray-300">Acceso Operador — O‑Forge</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z" stroke="currentColor" strokeWidth="1.5"/><path d="M4 7l7.2 5.4a2.25 2.25 0 0 0 2.7 0L21 7" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-transparent transition-all duration-200"
                  placeholder="tucorreo@dominio.com"
                  required
                />
                <label htmlFor="email" className="absolute left-10 -top-2.5 bg-gray-900/60 px-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:bg-gray-900/60 peer-focus:text-cyan-300">
                  Correo electrónico
                </label>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6.75" y="10.5" width="10.5" height="8.25" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9 10.5V7.875A3.375 3.375 0 0 1 12.375 4.5v0A3.375 3.375 0 0 1 15.75 7.875V10.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <label htmlFor="password" className="absolute left-10 -top-2.5 bg-gray-900/60 px-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:bg-gray-900/60 peer-focus:text-cyan-300">
                  Contraseña
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5"><path d="M12 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="16.5" r="1" fill="currentColor"/></svg>
                  <p className="text-sm">{error.includes('Invalid login') ? 'Credenciales no válidas. Revisa tu correo y contraseña.' : error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="relative w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-cyan-800 disabled:to-cyan-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:translate-y-px"
              >
                {loading ? (
                  <>
                    <div className="h-1 w-16 bg-white/60 rounded-full overflow-hidden absolute top-0 left-1/2 -translate-x-1/2">
                      <div className="h-full w-1/3 bg-white animate-pulse" />
                    </div>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Verificando...
                  </>
                ) : (
                  'Acceder a la Forja'
                )}
              </button>
              <div className="text-center">
                <a href="#" className="text-sm text-gray-400 hover:text-gray-200">¿Has olvidado tu contraseña?</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
