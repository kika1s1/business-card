import React, { useState } from 'react';
import { User, Mail, Lock, Activity, CreditCard, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCards } from '../hooks/useCards';
import { Button, Input } from '../components/ui';
import { validateForm, profileUpdateSchema } from '../utils/validation';
import { formatDate } from '../utils/helpers';

const Profile = () => {
  const { user } = useAuth();
  const { getCardStats } = useCards();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const stats = getCardStats();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const validation = validateForm(profileUpdateSchema, formData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    // API call would go here
    setTimeout(() => {
      setLoading(false);
      // Show success message
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Password & Security', icon: Lock },
    { id: 'activity', label: 'Account Activity', icon: Activity },
    { id: 'subscription', label: 'Subscription', icon: CreditCard }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account information and preferences.
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500">
              Member since {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cards</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Week</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.recentlyCreated}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Account Type</p>
              <p className="text-2xl font-semibold text-gray-900">Free</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
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
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  required
                />
              </div>
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                error={errors.currentPassword}
                required
              />
              
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={errors.newPassword}
              />
              
              <Input
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                error={errors.confirmNewPassword}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Change Password'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created "Marketing Card"</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Updated profile information</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Exported "Business Card v2"</p>
                      <p className="text-sm text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Free Plan</h4>
                      <p className="text-gray-600">5 cards per month</p>
                    </div>
                    <Button>Upgrade to Pro</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 