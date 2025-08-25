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
        navigate('/hub')
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
          <img src="/brand/Pruebas%20Dise%C3%B1o%20Siom%20Solutions.pdf%20(2).png" alt="Logo O‑Forge de SIOM Solutions" className="w-56 opacity-90 mb-6 logo-hero animate-float mx-auto" />
          <h1 className="text-4xl font-bold text-white mb-2">O‑Forge</h1>
          <p className="text-gray-400 max-w-md mx-auto">El ecosistema de inteligencia híbrida de élite de SIOM Solutions</p>
        </div>

        <div className="w-full max-w-md md:ml-auto justify-self-end">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
            <div className="text-center mb-6">
              <p className="text-gray-400">Identifícate para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error.includes('Invalid login') ? 'Credenciales no válidas. Revisa tu correo y contraseña.' : error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
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
