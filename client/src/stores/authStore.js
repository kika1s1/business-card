import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(devtools((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,

  // Actions
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      const { user, token } = response.data;
      
      // Store token in memory (not localStorage for security)
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });

      // Store token in localStorage for persistence
      localStorage.setItem('auth-token', token);

      // Set axios default header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      return { success: false, error: errorMessage };
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.post('/api/auth/register', userData);
      
      const { user, token } = response.data;
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        loading: false 
      });

      // Store token in localStorage for persistence
      localStorage.setItem('auth-token', token);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem('auth-token');
    
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null 
    });
    
    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
  },

  refreshToken: async () => {
    try {
      const { token } = get();
      if (!token) return false;

      const response = await api.post('/api/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { token: newToken, user } = response.data;
      
      set({ token: newToken, user });
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return true;
    } catch (error) {
      get().logout();
      return false;
    }
  },

  clearError: () => set({ error: null }),

  // Initialize auth state from token if available
  initialize: async () => {
    try {
      // Only try to initialize if we have a token
      const token = localStorage.getItem('auth-token');
      if (!token) {
        // No token, ensure we're logged out
        get().logout();
        return;
      }

      const response = await api.get('/api/auth/me');
      const user = response.data;
      
      set({ 
        user, 
        token,
        isAuthenticated: true 
      });
    } catch (error) {
      // Token is invalid or expired, clear everything
      localStorage.removeItem('auth-token');
      get().logout();
    }
  }
}), { name: 'auth-store' }));

export default useAuthStore; 