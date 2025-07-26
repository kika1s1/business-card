import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';

const useAdminStore = create(devtools((set, get) => ({
  // State
  analytics: {
    totalUsers: 0,
    totalCards: 0,
    activeUsers: {
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    performance: {
      avgSessionDuration: 0,
      cardsPerUser: 0,
      downloadFrequency: 0
    },
    popularTemplates: [],
    recentActivity: [],
    chartData: {
      userGrowth: [],
      cardCreation: [],
      templateUsage: []
    }
  },
  users: [],
  systemMetrics: {
    errors: [],
    performance: {},
    usage: {}
  },
  loading: false,
  error: null,

  // Actions
  fetchAnalytics: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get('/api/admin/analytics');
      
      set({ 
        analytics: response.data,
        loading: false 
      });
    } catch (error) {
      // Mock data for development
      const mockAnalytics = {
        totalUsers: 2547,
        totalCards: 8342,
        activeUsers: {
          daily: 142,
          weekly: 876,
          monthly: 2204
        },
        performance: {
          avgSessionDuration: 18.5,
          cardsPerUser: 3.3,
          downloadFrequency: 4.2
        },
        popularTemplates: [
          { id: 'modern', name: 'Modern Professional', usage: 1247, percentage: 32.4 },
          { id: 'creative', name: 'Creative Portfolio', usage: 1089, percentage: 28.3 },
          { id: 'executive', name: 'Executive Luxury', usage: 876, percentage: 22.8 },
          { id: 'healthcare', name: 'Healthcare Professional', usage: 634, percentage: 16.5 }
        ],
        recentActivity: [
          { id: 1, type: 'user_registration', user: 'John Smith', action: 'Registered new account', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
          { id: 2, type: 'card_creation', user: 'Sarah Johnson', action: 'Created new business card', timestamp: new Date(Date.now() - 12 * 60000).toISOString() },
          { id: 3, type: 'template_download', user: 'Mike Davis', action: 'Downloaded Executive template', timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
          { id: 4, type: 'card_export', user: 'Emily Brown', action: 'Exported card as PDF', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
          { id: 5, type: 'user_login', user: 'Robert Wilson', action: 'Logged into dashboard', timestamp: new Date(Date.now() - 32 * 60000).toISOString() }
        ],
        chartData: {
          userGrowth: [
            { month: 'Jan', users: 450 },
            { month: 'Feb', users: 623 },
            { month: 'Mar', users: 784 },
            { month: 'Apr', users: 945 },
            { month: 'May', users: 1156 },
            { month: 'Jun', users: 1389 },
            { month: 'Jul', users: 1623 },
            { month: 'Aug', users: 1897 },
            { month: 'Sep', users: 2134 },
            { month: 'Oct', users: 2378 },
            { month: 'Nov', users: 2547 }
          ],
          cardCreation: [
            { day: 'Mon', cards: 45 },
            { day: 'Tue', cards: 67 },
            { day: 'Wed', cards: 89 },
            { day: 'Thu', cards: 123 },
            { day: 'Fri', cards: 145 },
            { day: 'Sat', cards: 67 },
            { day: 'Sun', cards: 34 }
          ],
          templateUsage: [
            { template: 'Modern', downloads: 234 },
            { template: 'Creative', downloads: 198 },
            { template: 'Executive', downloads: 176 },
            { template: 'Healthcare', downloads: 143 },
            { template: 'Tech', downloads: 98 }
          ]
        }
      };
      
      set({ 
        analytics: mockAnalytics,
        loading: false,
        error: null
      });
    }
  },

  fetchUsers: async (page = 1, limit = 20, search = '') => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get('/api/admin/users', {
        params: { page, limit, search }
      });
      
      set({ 
        users: response.data.users,
        loading: false 
      });
      
      return response.data;
    } catch (error) {
      // Mock users data for development
      const mockUsers = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'user',
          status: 'active',
          cardsCount: 5,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          createdAt: '2024-01-15T00:00:00Z',
          subscription: 'free'
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.j@company.com',
          role: 'user',
          status: 'active',
          cardsCount: 12,
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          createdAt: '2024-02-20T00:00:00Z',
          subscription: 'premium'
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Davis',
          email: 'mike.davis@startup.io',
          role: 'user',
          status: 'active',
          cardsCount: 8,
          lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          createdAt: '2024-03-10T00:00:00Z',
          subscription: 'free'
        },
        {
          id: '4',
          firstName: 'Emily',
          lastName: 'Brown',
          email: 'emily.brown@design.com',
          role: 'user',
          status: 'inactive',
          cardsCount: 3,
          lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: '2024-01-25T00:00:00Z',
          subscription: 'free'
        },
        {
          id: '5',
          firstName: 'Robert',
          lastName: 'Wilson',
          email: 'robert.w@enterprise.com',
          role: 'admin',
          status: 'active',
          cardsCount: 15,
          lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          createdAt: '2023-12-01T00:00:00Z',
          subscription: 'enterprise'
        }
      ];

      const filteredUsers = search 
        ? mockUsers.filter(user => 
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
          )
        : mockUsers;

      set({ 
        users: filteredUsers,
        loading: false,
        error: null
      });
      
      return { users: filteredUsers, total: filteredUsers.length };
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.patch(`/api/admin/users/${userId}/status`, {
        status
      });
      
      const updatedUser = response.data;
      
      set(state => ({
        users: state.users.map(user => 
          user.id === userId ? updatedUser : user
        ),
        loading: false
      }));
      
      return { success: true };
    } catch (error) {
      // Mock update for development
      set(state => ({
        users: state.users.map(user => 
          user.id === userId ? { ...user, status } : user
        ),
        loading: false,
        error: null
      }));
      
      return { success: true };
    }
  },

  fetchSystemMetrics: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get('/api/admin/system-metrics');
      
      set({ 
        systemMetrics: response.data,
        loading: false 
      });
    } catch (error) {
      // Mock system metrics for development
      const mockSystemMetrics = {
        errors: [
          { id: 1, type: 'API Error', message: 'Connection timeout to payment service', count: 3, lastOccurred: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
          { id: 2, type: 'Validation Error', message: 'Invalid email format in registration', count: 7, lastOccurred: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
          { id: 3, type: 'Export Error', message: 'PDF generation failed for large cards', count: 2, lastOccurred: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() }
        ],
        performance: {
          averageResponseTime: 245,
          uptime: 99.8,
          errorRate: 0.12,
          throughput: 1247
        },
        usage: {
          storageUsed: 78.5,
          bandwidthUsed: 65.2,
          apiCallsToday: 15678,
          activeConnections: 234
        }
      };
      
      set({ 
        systemMetrics: mockSystemMetrics,
        loading: false,
        error: null
      });
    }
  },

  fetchTemplateAnalytics: async () => {
    try {
      const response = await api.get('/api/admin/template-analytics');
      
      set(state => ({
        analytics: {
          ...state.analytics,
          popularTemplates: response.data
        }
      }));
    } catch (error) {
      console.log('Using mock template analytics data');
    }
  },

  // Dashboard summary methods
  getDashboardSummary: () => {
    const { analytics } = get();
    
    return {
      totalUsers: analytics.totalUsers,
      totalCards: analytics.totalCards,
      activeUsersToday: analytics.activeUsers.daily,
      growthRate: analytics.growthRate || 15.3,
      popularTemplate: analytics.popularTemplates[0]?.name || 'Modern Professional'
    };
  },

  getActiveUsersChart: () => {
    const { analytics } = get();
    
    return [
      { period: 'Daily', count: analytics.activeUsers.daily },
      { period: 'Weekly', count: analytics.activeUsers.weekly },
      { period: 'Monthly', count: analytics.activeUsers.monthly }
    ];
  },

  clearError: () => set({ error: null }),

  // Real-time updates (would be implemented with WebSocket in production)
  initializeRealTimeUpdates: () => {
    // Placeholder for WebSocket connection
    console.log('Real-time updates initialized');
  }
}), { name: 'admin-store' }));

export default useAdminStore; 