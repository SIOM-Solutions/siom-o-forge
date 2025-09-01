import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence } from 'framer-motion'

import { AuthProvider } from './contexts/AuthContext'
import { AccessProvider } from './contexts/AccessContext'
import LoginPage from './pages/auth/LoginPage'
import HubPage from './pages/HubPage'
import AirLandingPage from './pages/air/AirLandingPage'
import AirAssignmentsPage from './pages/air/AirAssignmentsPage'
import AirAssignmentDetailPage from './pages/air/AirAssignmentDetailPage'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedLayout from './components/ProtectedLayout'
import NotFoundPage from './pages/NotFoundPage'
import PsitacLandingPage from './pages/psitac/PsitacLandingPage'
import PsitacPartIPage from './pages/psitac/PsitacPartIPage'
import PsitacPartIIPage from './pages/psitac/PsitacPartIIPage'
import PerformanceLandingPage from './pages/performance/PerformanceLandingPage'
import OpsLandingPage from './pages/ops/OpsLandingPage'
import WelcomeScreen from './components/WelcomeScreen'
import ExcelsiorHost from './components/ExcelsiorHost'
import { ExcelsiorProvider } from './contexts/ExcelsiorContext'
import ExcelsiorHUD from './components/ExcelsiorHUD'
// Labs eliminados del build
import ExcelsiorConnectButton from './components/ExcelsiorConnectButton'

function App() {
  return (
    <AuthProvider>
      <AccessProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-gray-100">
          <ExcelsiorProvider>
            <ExcelsiorMounts />
            <GlobalCornerLogo />
          </ExcelsiorProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Ruta raíz redirige a login */}
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
              
              {/* Login público */}
              <Route path="/auth/login" element={<LoginPage />} />
              
              {/* Pantalla de bienvenida tras login (protegida, sin layout superior) */}
              <Route path="/welcome" element={<ProtectedRoute><WelcomeScreen /></ProtectedRoute>} />

              {/* Rutas protegidas con layout */}
              <Route element={<ProtectedLayout />}>
                <Route path="/hub" element={<HubPage />} />
                {/* Rutas de laboratorio eliminadas */}
                <Route path="/air" element={<ProtectedRoute requiredAccess="air"><AirLandingPage /></ProtectedRoute>} />
                <Route path="/air/assignments" element={<ProtectedRoute requiredAccess="air"><AirAssignmentsPage /></ProtectedRoute>} />
                <Route path="/air/assignments/:slug" element={<ProtectedRoute requiredAccess="air"><AirAssignmentDetailPage /></ProtectedRoute>} />

                {/* PSITAC */}
                <Route path="/psitac" element={<ProtectedRoute requiredAccess="psitac"><PsitacLandingPage /></ProtectedRoute>} />
                <Route path="/psitac/parte-i" element={<ProtectedRoute requiredAccess="psitac"><PsitacPartIPage /></ProtectedRoute>} />
                <Route path="/psitac/parte-ii" element={<ProtectedRoute requiredAccess="psitac"><PsitacPartIIPage /></ProtectedRoute>} />

                {/* Performance y OPS placeholders */}
                <Route path="/performance" element={<ProtectedRoute requiredAccess="forge_performance"><PerformanceLandingPage /></ProtectedRoute>} />
                <Route path="/ops" element={<ProtectedRoute requiredAccess="forge_ops"><OpsLandingPage /></ProtectedRoute>} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
      </AccessProvider>
    </AuthProvider>
  )
}

export default App

function ExcelsiorMounts() {
  const location = useLocation()
  if (location.pathname === '/auth/login') return null
  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 pointer-events-none">
        <ExcelsiorHUD />
        <ExcelsiorHost />
      </div>
    </>
  )
}

function GlobalCornerLogo() {
  const location = useLocation()
  if (location.pathname === '/auth/login') return null
  return (
    <img
      src="/brand/logo-oro.png"
      alt="SIOM Solutions"
      className="fixed bottom-4 left-4 h-12 w-auto opacity-80 logo-electric"
      style={{ zIndex: 38 }}
    />
  )
}
