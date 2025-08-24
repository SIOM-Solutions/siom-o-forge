import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import HubPage from './pages/HubPage'
import AirLandingPage from './pages/air/AirLandingPage'
import AirAssignmentsPage from './pages/air/AirAssignmentsPage'
import AirAssignmentDetailPage from './pages/air/AirAssignmentDetailPage'
import ProtectedRoute from './components/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-gray-100">
          <Routes>
            {/* Ruta raíz redirige a login */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            
            {/* Login público */}
            <Route path="/auth/login" element={<LoginPage />} />
            
            {/* Rutas protegidas */}
            <Route path="/hub" element={
              <ProtectedRoute>
                <HubPage />
              </ProtectedRoute>
            } />
            
            <Route path="/air" element={
              <ProtectedRoute>
                <AirLandingPage />
              </ProtectedRoute>
            } />
            
            <Route path="/air/assignments" element={
              <ProtectedRoute>
                <AirAssignmentsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/air/assignments/:slug" element={
              <ProtectedRoute>
                <AirAssignmentDetailPage />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
