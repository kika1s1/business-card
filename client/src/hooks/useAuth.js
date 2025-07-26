import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useUIStore from '../stores/uiStore';
import { ROUTES, SUCCESS_MESSAGES } from '../utils/constants';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    initialize
  } = useAuthStore();

  const { showSuccess, showError } = useUIStore();
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    if (!isAuthenticated) {
      initialize();
    }
  }, [initialize, isAuthenticated]);

  const handleLogin = async (credentials) => {
    const result = await login(credentials.email, credentials.password);
    
    if (result.success) {
      showSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      navigate(ROUTES.DASHBOARD);
    } else {
      showError(result.error);
    }
    
    return result;
  };

  const handleRegister = async (userData) => {
    const result = await register(userData);
    
    if (result.success) {
      showSuccess(SUCCESS_MESSAGES.REGISTER_SUCCESS);
      navigate(ROUTES.DASHBOARD);
    } else {
      showError(result.error);
    }
    
    return result;
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    showSuccess('Successfully logged out');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isModerator = () => {
    return user?.role === 'moderator' || user?.role === 'admin';
  };

  const requireAuth = (redirectTo = ROUTES.LOGIN) => {
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate(redirectTo);
      }
    }, [isAuthenticated, loading, navigate, redirectTo]);
  };

  const requireAdmin = (redirectTo = ROUTES.DASHBOARD) => {
    useEffect(() => {
      if (!loading && (!isAuthenticated || !isAdmin())) {
        navigate(redirectTo);
      }
    }, [isAuthenticated, loading, navigate, redirectTo]);
  };

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
    
    // Utilities
    isAdmin,
    isModerator,
    requireAuth,
    requireAdmin,
  };
}; 