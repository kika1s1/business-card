import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';
import { ROUTES } from '../../utils/constants';

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  redirectTo = ROUTES.LOGIN 
}) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check admin requirements
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">403 - Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
          <a 
            href={ROUTES.DASHBOARD}
            className="btn-primary"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 