import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../stores/adminStore';
import useUIStore from '../stores/uiStore';
import { useAuth } from './useAuth';
import { SUCCESS_MESSAGES } from '../utils/constants';

export const useAdmin = () => {
  const {
    analytics,
    users,
    systemMetrics,
    loading,
    error,
    fetchAnalytics,
    fetchUsers,
    fetchSystemMetrics,
    fetchTemplateAnalytics,
    updateUserStatus,
    getDashboardSummary,
    getActiveUsersChart,
    clearError
  } = useAdminStore();

  const { showSuccess, showError } = useUIStore();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Check admin access
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      showError('Access denied. Admin privileges required.');
    }
  }, [isAdmin, navigate, showError]);

  // Handle analytics loading
  const loadAnalytics = async () => {
    try {
      await fetchAnalytics();
      await fetchSystemMetrics();
      await fetchTemplateAnalytics();
    } catch (err) {
      showError('Failed to load analytics data');
    }
  };

  // Handle user management
  const handleUpdateUserStatus = async (userId, status) => {
    try {
      const result = await updateUserStatus(userId, status);
      if (result.success) {
        showSuccess(`User status updated to ${status}`);
        return true;
      } else {
        showError(result.error || 'Failed to update user status');
        return false;
      }
    } catch (err) {
      showError('Failed to update user status');
      return false;
    }
  };

  // Handle user search
  const searchUsers = async (searchTerm, page = 1, limit = 20) => {
    try {
      const result = await fetchUsers(page, limit, searchTerm);
      return result;
    } catch (err) {
      showError('Failed to search users');
      return { users: [], total: 0 };
    }
  };

  // Export user data
  const exportUsers = async (format = 'csv') => {
    try {
      // This would typically call an API endpoint
      // For now, we'll create a simple CSV export
      const csvContent = users.map(user => 
        `${user.firstName},${user.lastName},${user.email},${user.role},${user.status},${user.cardsCount},${user.createdAt}`
      ).join('\n');
      
      const header = 'First Name,Last Name,Email,Role,Status,Cards Count,Created At\n';
      const fullContent = header + csvContent;
      
      const blob = new Blob([fullContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      showSuccess('Users exported successfully');
      return true;
    } catch (err) {
      showError('Failed to export users');
      return false;
    }
  };

  // Generate analytics report
  const generateAnalyticsReport = async () => {
    try {
      const reportData = {
        summary: getDashboardSummary(),
        activeUsers: getActiveUsersChart(),
        popularTemplates: analytics.popularTemplates,
        systemMetrics: systemMetrics,
        generatedAt: new Date().toISOString()
      };
      
      const jsonContent = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      showSuccess('Analytics report generated successfully');
      return true;
    } catch (err) {
      showError('Failed to generate analytics report');
      return false;
    }
  };

  // Get chart data for different time ranges
  const getChartData = (type, timeRange = '30d') => {
    switch (type) {
      case 'userGrowth':
        return analytics.chartData?.userGrowth || [];
      case 'cardCreation':
        return analytics.chartData?.cardCreation || [];
      case 'templateUsage':
        return analytics.chartData?.templateUsage || [];
      default:
        return [];
    }
  };

  // Get system health status
  const getSystemHealth = () => {
    if (!systemMetrics.performance) return 'unknown';
    
    const uptime = systemMetrics.performance.uptime || 0;
    const errorRate = systemMetrics.performance.errorRate || 0;
    
    if (uptime >= 99.5 && errorRate < 0.5) return 'healthy';
    if (uptime >= 98 && errorRate < 1) return 'warning';
    return 'critical';
  };

  // Get error summary
  const getErrorSummary = () => {
    const errors = systemMetrics.errors || [];
    const totalErrors = errors.reduce((sum, error) => sum + (error.count || 0), 0);
    const criticalErrors = errors.filter(error => error.type === 'Critical Error').length;
    
    return {
      total: totalErrors,
      critical: criticalErrors,
      recent: errors.length
    };
  };

  // Clear admin errors
  const handleClearError = () => {
    clearError();
  };

  return {
    // State
    analytics,
    users,
    systemMetrics,
    loading,
    error,
    
    // Derived state
    dashboardSummary: getDashboardSummary(),
    activeUsersChart: getActiveUsersChart(),
    systemHealth: getSystemHealth(),
    errorSummary: getErrorSummary(),
    
    // Actions
    loadAnalytics,
    searchUsers,
    updateUserStatus: handleUpdateUserStatus,
    exportUsers,
    generateAnalyticsReport,
    getChartData,
    clearError: handleClearError
  };
};

export default useAdmin; 