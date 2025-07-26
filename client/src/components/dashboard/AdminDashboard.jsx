import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  BarChart3,
  Shield,
  Settings,
  AlertTriangle,
  Eye,
  Download,
  UserCheck,
  Calendar,
  Clock,
  Plus
} from 'lucide-react';
import useAdminStore from '../../stores/adminStore';
import { Button, LoadingSpinner } from '../ui';
import { formatTimeAgo, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const { 
    analytics, 
    users, 
    systemMetrics, 
    loading, 
    error, 
    fetchAnalytics, 
    fetchUsers,
    fetchSystemMetrics,
    getDashboardSummary,
    clearError 
  } = useAdminStore();

  useEffect(() => {
    fetchAnalytics();
    fetchUsers(1, 5); // Get first 5 users for quick view
    fetchSystemMetrics();
  }, [fetchAnalytics, fetchUsers, fetchSystemMetrics]);

  if (loading && !analytics.totalUsers) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const summary = getDashboardSummary();

  const quickStats = [
    {
      title: 'Total Users',
      value: summary.totalUsers?.toLocaleString() || '0',
      icon: Users,
      color: 'blue',
      change: '+15.3%',
      link: '/admin/users'
    },
    {
      title: 'Total Cards',
      value: summary.totalCards?.toLocaleString() || '0',
      icon: CreditCard,
      color: 'green',
      change: '+22.1%',
      link: '/admin/analytics'
    },
    {
      title: 'Active Today',
      value: summary.activeUsersToday?.toLocaleString() || '0',
      icon: Activity,
      color: 'purple',
      change: '+8.7%',
      link: '/admin/analytics'
    },
    {
      title: 'Growth Rate',
      value: `+${summary.growthRate}%`,
      icon: TrendingUp,
      color: 'orange',
      change: 'Monthly',
      link: '/admin/analytics'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
            <p className="text-blue-100 mt-1">
              Monitor your business card platform performance
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Last updated</div>
            <div className="text-lg font-semibold">{formatDate(new Date())}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800">
              <Eye className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {formatTimeAgo(user.createdAt)}
                </div>
              </div>
            ))}
          </div>
          
          <Link
            to="/admin/users"
            className="block w-full text-center py-2 mt-4 text-sm text-blue-600 hover:text-blue-800 border-t border-gray-100"
          >
            View all users
          </Link>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <Link to="/admin/system" className="text-blue-600 hover:text-blue-800">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">API Status</span>
              </div>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Database</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                {systemMetrics.performance?.uptime || 99.8}% uptime
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Storage</span>
              </div>
              <span className="text-sm font-medium text-yellow-600">
                {systemMetrics.usage?.storageUsed || 78}% used
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Active Connections</span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {systemMetrics.usage?.activeConnections || 234}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <Link
              to="/admin/analytics"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">View Analytics</span>
            </Link>
            
            <Link
              to="/admin/users"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <UserCheck className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Manage Users</span>
            </Link>
            
            <button className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 w-full">
              <Download className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Export Reports</span>
            </button>
            
            <Link
              to="/admin/system"
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Shield className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">System Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity & Errors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {analytics.recentActivity?.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user_registration' ? 'bg-green-500' :
                  activity.type === 'card_creation' ? 'bg-blue-500' :
                  activity.type === 'template_download' ? 'bg-purple-500' :
                  activity.type === 'card_export' ? 'bg-orange-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Errors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Errors</h3>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          
          <div className="space-y-3">
            {systemMetrics.errors?.slice(0, 3).map((error) => (
              <div key={error.id} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900">{error.type}</p>
                  <p className="text-xs text-red-600 mt-1">{error.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-red-500">Count: {error.count}</span>
                    <span className="text-xs text-red-500">
                      {formatTimeAgo(error.lastOccurred)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {(!systemMetrics.errors || systemMetrics.errors.length === 0) && (
            <div className="text-center py-4">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recent errors</p>
            </div>
          )}
        </div>
      </div>

      {/* Popular Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Popular Templates</h3>
          <Link to="/admin/analytics" className="text-blue-600 hover:text-blue-800 text-sm">
            View details
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.popularTemplates?.slice(0, 4).map((template, index) => (
            <div key={template.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{template.name}</span>
                <span className="text-xs text-gray-500">{template.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-${['blue', 'green', 'purple', 'orange'][index % 4]}-500`}
                  style={{ width: `${template.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {template.usage?.toLocaleString()} uses
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 