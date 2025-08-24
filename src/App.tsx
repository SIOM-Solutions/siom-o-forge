import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

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

function App() {
  return (
    <AuthProvider>
      <AccessProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-gray-100">
          <Routes>
            {/* Ruta raíz redirige a login */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            
            {/* Login público */}
            <Route path="/auth/login" element={<LoginPage />} />
            
            {/* Rutas protegidas con layout */}
            <Route element={<ProtectedLayout />}>
              <Route path="/hub" element={<HubPage />} />
              <Route path="/air" element={<ProtectedRoute requiredAccess="air"><AirLandingPage /></ProtectedRoute>} />
              <Route path="/air/assignments" element={<ProtectedRoute requiredAccess="air"><AirAssignmentsPage /></ProtectedRoute>} />
              <Route path="/air/assignments/:slug" element={<ProtectedRoute requiredAccess="air"><AirAssignmentDetailPage /></ProtectedRoute>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
      </AccessProvider>
    </AuthProvider>
  )
}

export default App
