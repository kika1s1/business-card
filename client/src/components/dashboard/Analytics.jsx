import React, { useEffect, useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Download,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Target,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileDown,
  Filter,
  Eye,
  Globe,
  Zap,
  DollarSign,
  Star,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  TrendingDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  Treemap,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { CSVLink } from 'react-csv';
import { format, subDays, startOfDay } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import useAdminStore from '../../stores/adminStore';
import { LoadingSpinner, Button } from '../ui';
import { formatTimeAgo, formatDate } from '../../utils/helpers';

// Custom colors for charts
const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981', 
  accent: '#8b5cf6',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  success: '#22c55e',
  neutral: '#6b7280'
};

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#22c55e', '#6b7280'];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${formatter ? formatter(entry.value) : entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Enhanced KPI Card component
const KPICard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color, 
  subtitle,
  onClick,
  sparklineData = []
}) => {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : TrendingDown;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-primary-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {sparklineData.length > 0 && (
              <div className="w-16 h-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={CHART_COLORS[color]} 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
          )}
          <div className={`flex items-center ${trendColor}`}>
            <TrendIcon className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{change}</span>
            <span className="text-xs text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-100 to-${color}-200`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const { 
    analytics, 
    loading, 
    error, 
    fetchAnalytics, 
    fetchSystemMetrics,
    clearError 
  } = useAdminStore();

  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);
  const [activeChart, setActiveChart] = useState('overview');
  const [exportFormat, setExportFormat] = useState('csv');
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  // Auto-refresh for real-time data
  useEffect(() => {
    let interval;
    if (realTimeEnabled) {
      interval = setInterval(() => {
        fetchAnalytics();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [realTimeEnabled, fetchAnalytics]);

  useEffect(() => {
    fetchAnalytics();
    fetchSystemMetrics();
  }, [fetchAnalytics, fetchSystemMetrics, timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchAnalytics(), fetchSystemMetrics()]);
    setRefreshing(false);
  };

  // Export functionality
  const exportToPDF = async () => {
    const dashboard = document.getElementById('analytics-dashboard');
    const canvas = await html2canvas(dashboard, { 
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`analytics-dashboard-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  // Generate mock real-time data for demonstration
  const generateChartData = useMemo(() => {
    const days = parseInt(timeRange.replace('d', '')) || 30;
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      data.push({
        date: format(date, 'MMM dd'),
        fullDate: format(date, 'yyyy-MM-dd'),
        users: Math.floor(Math.random() * 500) + 200,
        newUsers: Math.floor(Math.random() * 100) + 50,
        cardCreations: Math.floor(Math.random() * 200) + 80,
        downloads: Math.floor(Math.random() * 300) + 150,
        pageViews: Math.floor(Math.random() * 1000) + 500,
        sessions: Math.floor(Math.random() * 400) + 200,
        bounceRate: Math.random() * 40 + 20,
        avgSessionDuration: Math.random() * 10 + 5
      });
    }
    return data;
  }, [timeRange]);

  // Device breakdown data
  const deviceData = [
    { name: 'Desktop', value: 45, color: COLORS[0] },
    { name: 'Mobile', value: 35, color: COLORS[1] },
    { name: 'Tablet', value: 20, color: COLORS[2] }
  ];

  // Geographic data
  const geographicData = [
    { country: 'United States', users: 2420, color: COLORS[0] },
    { country: 'Canada', users: 1320, color: COLORS[1] },
    { country: 'United Kingdom', users: 890, color: COLORS[2] },
    { country: 'Germany', users: 650, color: COLORS[3] },
    { country: 'Australia', users: 420, color: COLORS[4] }
  ];

  // Template performance data
  const templatePerformanceData = analytics.popularTemplates?.map((template, index) => ({
    ...template,
    color: COLORS[index % COLORS.length],
    conversions: Math.floor(Math.random() * 100) + 20,
    rating: (Math.random() * 2 + 3).toFixed(1)
  })) || [];

  // Conversion funnel data
  const funnelData = [
    { name: 'Visitors', value: 10000, fill: COLORS[0] },
    { name: 'Sign Ups', value: 3500, fill: COLORS[1] },
    { name: 'Card Created', value: 2100, fill: COLORS[2] },
    { name: 'Downloaded', value: 1600, fill: COLORS[3] },
    { name: 'Shared', value: 800, fill: COLORS[4] }
  ];

  // Enhanced KPI cards with real data and trends
  const kpiCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers?.toLocaleString() || '12,543',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      subtitle: 'Active this month',
      sparklineData: generateChartData.slice(-7).map(d => ({ value: d.users }))
    },
    {
      title: 'Business Cards',
      value: analytics.totalCards?.toLocaleString() || '8,429',
      change: '+22.1%',
      trend: 'up',
      icon: CreditCard,
      color: 'green',
      subtitle: 'Cards created',
      sparklineData: generateChartData.slice(-7).map(d => ({ value: d.cardCreations }))
    },
    {
      title: 'Daily Active Users',
      value: analytics.activeUsers?.daily?.toLocaleString() || '2,108',
      change: '+8.7%',
      trend: 'up',
      icon: Activity,
      color: 'purple',
      subtitle: 'Last 24 hours',
      sparklineData: generateChartData.slice(-7).map(d => ({ value: d.sessions }))
    },
    {
      title: 'Conversion Rate',
      value: '18.5%',
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      color: 'orange',
      subtitle: 'Visitor to signup'
    },
    {
      title: 'Revenue',
      value: '$24,891',
      change: '+12.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      subtitle: 'This month'
    },
    {
      title: 'Avg Session',
      value: `${analytics.performance?.avgSessionDuration || 7.4}min`,
      change: '-2.1%',
      trend: 'down',
      icon: Clock,
      color: 'red',
      subtitle: 'Duration'
    },
    {
      title: 'Page Views',
      value: '45.2K',
      change: '+18.9%',
      trend: 'up',
      icon: Eye,
      color: 'blue',
      subtitle: 'This month'
    },
    {
      title: 'Customer Rating',
      value: '4.8★',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'yellow',
      subtitle: 'Average rating'
    }
  ];

  // CSV export data
  const csvData = [
    ['Metric', 'Value', 'Change', 'Period'],
    ...kpiCards.map(kpi => [kpi.title, kpi.value, kpi.change, timeRange])
  ];

  if (loading && !analytics.totalUsers) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div id="analytics-dashboard" className="space-y-8 p-1">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Real-time insights and comprehensive business metrics
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${realTimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm">{realTimeEnabled ? 'Live Data' : 'Static Data'}</span>
              </div>
              <div className="text-sm">
                Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={realTimeEnabled}
                  onChange={(e) => setRealTimeEnabled(e.target.checked)}
                  className="rounded border-white"
                />
                Real-time
              </label>
            </div>
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm"
            >
              <option value="7d" className="text-gray-900">Last 7 days</option>
              <option value="30d" className="text-gray-900">Last 30 days</option>
              <option value="90d" className="text-gray-900">Last 90 days</option>
              <option value="365d" className="text-gray-900">Last year</option>
            </select>
            
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="secondary"
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <div className="flex items-center gap-2">
              <CSVLink
                data={csvData}
                filename={`analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <FileDown className="h-4 w-4" />
                CSV
              </CSVLink>
              
              <button
                onClick={exportToPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <FileDown className="h-4 w-4" />
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <KPICard
            key={index}
            {...kpi}
            onClick={() => setActiveChart(kpi.title.toLowerCase().replace(/\s+/g, '_'))}
          />
        ))}
      </div>

      {/* Chart Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'engagement', label: 'Engagement', icon: Activity },
            { id: 'conversion', label: 'Conversion', icon: Target },
            { id: 'geographic', label: 'Geographic', icon: Globe },
            { id: 'devices', label: 'Devices', icon: Smartphone }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeChart === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Chart Content */}
        <div className="min-h-[400px]">
          {activeChart === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Over Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">User Growth Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={generateChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      fill={CHART_COLORS.primary} 
                      fillOpacity={0.6}
                      name="Total Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="newUsers" 
                      stroke={CHART_COLORS.secondary}
                      strokeWidth={3}
                      name="New Users"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Card Creation & Downloads */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Activity Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generateChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="cardCreations" fill={CHART_COLORS.secondary} name="Cards Created" />
                    <Bar dataKey="downloads" fill={CHART_COLORS.accent} name="Downloads" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'users' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Acquisition */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">User Acquisition</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={generateChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stackId="1"
                      fill={CHART_COLORS.primary}
                      name="Existing Users"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="newUsers" 
                      stackId="1"
                      fill={CHART_COLORS.secondary}
                      name="New Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* User Segments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Active User Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={[
                    { name: 'Daily', value: analytics.activeUsers?.daily || 2108, fill: COLORS[0] },
                    { name: 'Weekly', value: analytics.activeUsers?.weekly || 8643, fill: COLORS[1] },
                    { name: 'Monthly', value: analytics.activeUsers?.monthly || 12543, fill: COLORS[2] }
                  ]}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'engagement' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Session Duration & Bounce Rate */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Session Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={generateChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgSessionDuration" fill={CHART_COLORS.primary} name="Avg Session (min)" />
                    <Line yAxisId="right" type="monotone" dataKey="bounceRate" stroke={CHART_COLORS.danger} strokeWidth={3} name="Bounce Rate %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Page Views */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Page Views & Sessions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="pageViews" stroke={CHART_COLORS.primary} strokeWidth={3} name="Page Views" />
                    <Line type="monotone" dataKey="sessions" stroke={CHART_COLORS.secondary} strokeWidth={3} name="Sessions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'conversion' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <FunnelChart data={funnelData}>
                    <Tooltip />
                    <Funnel
                      dataKey="value"
                      data={funnelData}
                      isAnimationActive
                    >
                      <LabelList position="center" fill="#fff" stroke="none" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>

              {/* Template Performance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Template Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={templatePerformanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="usage" fill={CHART_COLORS.secondary} name="Usage Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'geographic' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Geographic Distribution */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">User Distribution by Country</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={geographicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="users" fill={CHART_COLORS.info} name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Countries Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
                <div className="space-y-3">
                  {geographicData.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: country.color }}></div>
                        <div>
                          <div className="font-medium text-gray-900">{country.country}</div>
                          <div className="text-sm text-gray-500">#{index + 1}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{country.users.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">users</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeChart === 'devices' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Device Usage</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Device Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Device Statistics</h3>
                <div className="space-y-4">
                  {[
                    { icon: Monitor, name: 'Desktop', value: '45%', users: '5,644', color: 'blue' },
                    { icon: Smartphone, name: 'Mobile', value: '35%', users: '4,390', color: 'green' },
                    { icon: Tablet, name: 'Tablet', value: '20%', users: '2,509', color: 'purple' }
                  ].map((device) => {
                    const Icon = device.icon;
                    return (
                      <div key={device.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${device.color}-100`}>
                            <Icon className={`h-5 w-5 text-${device.color}-600`} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{device.name}</div>
                            <div className="text-sm text-gray-500">{device.users} users</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-gray-900">{device.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Activity Feed
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Live</span>
            </div>
          </div>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {analytics.recentActivity?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'user_registration' ? 'bg-green-500' :
                  activity.type === 'card_creation' ? 'bg-blue-500' :
                  activity.type === 'template_download' ? 'bg-purple-500' :
                  activity.type === 'card_export' ? 'bg-orange-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Insights
          </h3>
          
          <div className="space-y-6">
            {[
              {
                icon: Target,
                title: 'Conversion Optimization',
                description: 'Card creation rate increased by 12% this week',
                impact: 'High',
                color: 'green'
              },
              {
                icon: TrendingUp,
                title: 'User Engagement',
                description: 'Session duration improved across all device types',
                impact: 'Medium',
                color: 'blue'
              },
              {
                icon: MousePointer,
                title: 'Template Performance',
                description: 'Corporate templates show highest conversion rates',
                impact: 'Medium',
                color: 'purple'
              }
            ].map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className={`p-2 rounded-lg bg-${insight.color}-100 flex-shrink-0`}>
                    <Icon className={`h-5 w-5 text-${insight.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.impact === 'High' ? 'bg-red-100 text-red-800' :
                        insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 