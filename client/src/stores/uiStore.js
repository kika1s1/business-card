import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useUIStore = create(devtools((set, get) => ({
  // State
  loading: false,
  error: null,
  notifications: [],
  sidebarOpen: false,
  theme: 'light',

  // Actions
  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  addNotification: (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 4000,
      ...notification
    };
    
    set(state => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Auto remove notification after duration
    setTimeout(() => {
      get().removeNotification(id);
    }, newNotification.duration);
    
    return id;
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id)
    }));
  },

  clearNotifications: () => set({ notifications: [] }),

  // Sidebar management
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Theme management
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
  },

  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      set({ theme: savedTheme });
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set({ theme: prefersDark ? 'dark' : 'light' });
    }
  },

  // Utility methods for notifications
  showSuccess: (message) => {
    return get().addNotification({
      type: 'success',
      message
    });
  },

  showError: (message) => {
    return get().addNotification({
      type: 'error',
      message,
      duration: 6000 // Longer duration for errors
    });
  },

  showWarning: (message) => {
    return get().addNotification({
      type: 'warning',
      message
    });
  },

  showInfo: (message) => {
    return get().addNotification({
      type: 'info',
      message
    });
  }
}), { name: 'ui-store' }));

export default useUIStore; 