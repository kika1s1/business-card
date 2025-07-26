import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from './components/ui';
import useUIStore from './stores/uiStore';
import useAuthStore from './stores/authStore';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CardEditor from './pages/CardEditor';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AnalyticsPage from './pages/Analytics';

// Import components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Import constants
import { ROUTES } from './utils/constants';

function App() {
  const { notifications, removeNotification, initializeTheme, loading } = useUIStore();
  const { initialize, isAuthenticated, user } = useAuthStore();

  // Initialize app on mount
  useEffect(() => {
    initializeTheme();
    initialize();
  }, [initializeTheme, initialize]);

  // Show loading spinner during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route 
              path={ROUTES.LOGIN} 
              element={
                isAuthenticated ? (
                  <Navigate to={ROUTES.DASHBOARD} replace />
                ) : (
                  <Login />
                )
              } 
            />
            <Route 
              path={ROUTES.REGISTER} 
              element={
                isAuthenticated ? (
                  <Navigate to={ROUTES.DASHBOARD} replace />
                ) : (
                  <Register />
                )
              } 
            />

            {/* Protected routes */}
            <Route 
              path={ROUTES.DASHBOARD} 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={ROUTES.CARD_EDITOR} 
              element={
                <ProtectedRoute>
                  <CardEditor />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/card-editor/:templateId" 
              element={
                <ProtectedRoute>
                  <CardEditor />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/card-editor/:cardId/edit" 
              element={
                <ProtectedRoute>
                  <CardEditor />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path={ROUTES.PROFILE} 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/:section" 
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute requireAdmin>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />

            {/* Redirects */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast notifications */}
        <ToastContainer 
          notifications={notifications}
          onRemove={removeNotification}
        />
      </div>
    </Router>
  );
}

export default App;
