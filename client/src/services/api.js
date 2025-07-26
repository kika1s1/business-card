import axios from 'axios';
import { API } from '../utils/constants';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from memory (via Zustand store)
    const token = localStorage.getItem('auth-token'); // Fallback for debugging
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshResponse = await api.post('/api/auth/refresh');
        const { token } = refreshResponse.data;
        
        // Update stored token
        localStorage.setItem('auth-token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth-token');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  refresh: () => api.post('/api/auth/refresh'),
  me: () => api.get('/api/auth/me'),
};

export const cardsAPI = {
  getAll: () => api.get('/api/cards'),
  getById: (id) => api.get(`/api/cards/${id}`),
  create: (cardData) => api.post('/api/cards', cardData),
  update: (id, cardData) => api.put(`/api/cards/${id}`, cardData),
  delete: (id) => api.delete(`/api/cards/${id}`),
};

export const templatesAPI = {
  getAll: () => api.get('/api/templates'),
  getById: (id) => api.get(`/api/templates/${id}`),
};

export const adminAPI = {
  getAnalytics: () => api.get('/api/admin/analytics'),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  updateUserStatus: (userId, status) => api.patch(`/api/admin/users/${userId}/status`, { status }),
  getSystemMetrics: () => api.get('/api/admin/system-metrics'),
  getTemplateAnalytics: () => api.get('/api/admin/template-analytics'),
};

export default api; 