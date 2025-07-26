import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  Settings,
  Shield,
  Search,
  Filter,
  Download,
  UserPlus,
  AlertTriangle,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAdminStore from '../stores/adminStore';
import { Button, LoadingSpinner, Input, Modal } from '../components/ui';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import Analytics from '../components/dashboard/Analytics';
import { formatTimeAgo, formatDate } from '../utils/helpers';

const Admin = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { 
    users, 
    systemMetrics, 
    loading, 
    error,
    fetchUsers,
    fetchSystemMetrics,
    updateUserStatus,
    clearError 
  } = useAdminStore();

  const [activeSection, setActiveSection] = useState(section || 'dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  useEffect(() => {
    if (section && section !== activeSection) {
      setActiveSection(section);
    }
  }, [section, activeSection]);

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers(1, 20, searchTerm);
    }
    if (activeSection === 'system') {
      fetchSystemMetrics();
    }
  }, [activeSection, searchTerm, fetchUsers, fetchSystemMetrics]);

  // Access control
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="mt-4"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSectionChange = (newSection) => {
    setActiveSection(newSection);
    navigate(`/admin/${newSection}`);
  };

  const handleUserStatusUpdate = async (userId, newStatus) => {
    const result = await updateUserStatus(userId, newStatus);
    if (result.success) {
      // Refresh users list
      fetchUsers(1, 20, searchTerm);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'system', label: 'System', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-2">
          Manage your business card platform and monitor performance.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSectionChange(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeSection === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeSection === 'dashboard' && <AdminDashboard />}
          
          {activeSection === 'analytics' && <Analytics />}

          {activeSection === 'users' && (
            <div className="space-y-6">
              {/* Users Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={() => {}}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
                  </Button>
                  <Button onClick={() => {}}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* Users Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                  />
                </div>
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cards
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.cardsCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {user.status === 'inactive' && <XCircle className="h-3 w-3 mr-1" />}
                            {user.status === 'banned' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimeAgo(user.lastActive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleUserStatusUpdate(
                                user.id, 
                                user.status === 'active' ? 'inactive' : 'active'
                              )}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'No users match the current filters.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'system' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">System Monitoring</h3>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </div>

              {/* System Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-green-800">API Status</h4>
                      <p className="text-sm text-green-600">Operational</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-green-800">Database</h4>
                      <p className="text-sm text-green-600">{systemMetrics.performance?.uptime || 99.8}% uptime</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-yellow-800">Storage</h4>
                      <p className="text-sm text-yellow-600">{systemMetrics.usage?.storageUsed || 78}% used</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-blue-600" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">Active Connections</h4>
                      <p className="text-sm text-blue-600">{systemMetrics.usage?.activeConnections || 234}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Errors */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Errors</h4>
                
                {systemMetrics.errors && systemMetrics.errors.length > 0 ? (
                  <div className="space-y-4">
                    {systemMetrics.errors.map((error) => (
                      <div key={error.id} className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-red-900">{error.type}</h5>
                            <span className="text-xs text-red-600">Count: {error.count}</span>
                          </div>
                          <p className="text-sm text-red-700 mt-1">{error.message}</p>
                          <p className="text-xs text-red-600 mt-2">
                            Last occurred: {formatTimeAgo(error.lastOccurred)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Recent Errors</h3>
                    <p className="mt-1 text-sm text-gray-500">System is running smoothly.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl font-medium">
                {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <p className="text-sm text-gray-500">Role: {selectedUser.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cards Created</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.cardsCount}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subscription</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.subscription}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowUserModal(false)}
              >
                Close
              </Button>
              <Button
                variant={selectedUser.status === 'active' ? 'danger' : 'primary'}
                onClick={() => {
                  handleUserStatusUpdate(
                    selectedUser.id,
                    selectedUser.status === 'active' ? 'inactive' : 'active'
                  );
                  setShowUserModal(false);
                }}
              >
                {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'} User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Admin; 