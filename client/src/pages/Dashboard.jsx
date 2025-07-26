import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  MoreVertical,
  Edit,
  Copy,
  Download,
  Trash2,
  CreditCard,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCards } from '../hooks/useCards';
import { Button, Input, Modal, LoadingSpinner } from '../components/ui';
import { formatTimeAgo, formatDate } from '../utils/helpers';
import { ROUTES, CARD_CATEGORIES, CATEGORY_LABELS } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    cards, 
    loading, 
    searchCards, 
    filterByCategory, 
    deleteCard, 
    duplicateCard,
    getCardStats,
    getRecentCards,
    filters
  } = useCards();

  const [viewMode, setViewMode] = useState('grid');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (searchTerm !== filters.search) {
      searchCards(searchTerm);
    }
  }, [searchTerm, filters.search, searchCards]);

  useEffect(() => {
    if (selectedCategory !== filters.category) {
      filterByCategory(selectedCategory);
    }
  }, [selectedCategory, filters.category, filterByCategory]);

  const stats = getCardStats();
  const recentCards = getRecentCards(3);

  const handleDeleteCard = async () => {
    if (selectedCard) {
      await deleteCard(selectedCard.id);
      setShowDeleteModal(false);
      setSelectedCard(null);
    }
  };

  const handleDuplicateCard = async (card) => {
    await duplicateCard(card.id);
  };

  const handleExportCard = (card) => {
    // This will be implemented when we create the export functionality
    console.log('Export card:', card.id);
  };

  const CardGridView = ({ cards }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          {/* Card Preview */}
          <div className="aspect-[1.75/1] bg-gradient-to-br from-gray-100 to-gray-200 p-4 relative group">
            <div className="w-full h-full bg-white rounded shadow-sm p-3 text-xs">
              <div className="flex justify-between items-start mb-2">
                <div className="w-6 h-6 bg-primary-100 rounded-full"></div>
                <div className="text-right">
                  <div className="w-12 h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="w-10 h-1 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="w-16 h-2 bg-gray-300 rounded"></div>
                <div className="w-12 h-1 bg-gray-200 rounded"></div>
                <div className="w-14 h-1 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
              <Link to={`${ROUTES.CARD_EDITOR}/${card.id}`}>
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => handleExportCard(card)}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Card Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 truncate">{card.name}</h3>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={() => setSelectedCard(card)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                
                {selectedCard?.id === card.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <Link 
                      to={`${ROUTES.CARD_EDITOR}/${card.id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSelectedCard(null)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Card
                    </Link>
                    <button
                      onClick={() => {
                        handleDuplicateCard(card);
                        setSelectedCard(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => {
                        handleExportCard(card);
                        setSelectedCard(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-2">
              {CATEGORY_LABELS[card.category] || card.category}
            </p>
            
            <p className="text-xs text-gray-400">
              Updated {formatTimeAgo(card.updatedAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const CardListView = ({ cards }) => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cards.map((card) => (
            <tr key={card.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{card.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {CATEGORY_LABELS[card.category] || card.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatTimeAgo(card.updatedAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Link 
                  to={`${ROUTES.CARD_EDITOR}/${card.id}`}
                  className="text-primary-600 hover:text-primary-900"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDuplicateCard(card)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    setSelectedCard(card);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your business cards and create new ones.
        </p>
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
              <TrendingUp className="h-8 w-8 text-green-600" />
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
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-2xl font-semibold text-gray-900">
                {cards.length > 0 ? formatDate(cards[0]?.updatedAt) : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-primary-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to create your next business card?
            </h2>
            <p className="text-gray-600">
              Choose from our professional templates and get started in minutes.
            </p>
          </div>
          <Link to={ROUTES.CARD_EDITOR}>
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create New Card
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Cards Section */}
      {recentCards.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Cards</h2>
            <Link to="#" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
              View all
            </Link>
          </div>
          <CardGridView cards={recentCards} />
        </div>
      )}

      {/* All Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Cards</h2>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search your cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards Display */}
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No business cards yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first business card.
            </p>
            <div className="mt-6">
              <Link to={ROUTES.CARD_EDITOR}>
                <Button>
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Card
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <CardGridView cards={cards} />
            ) : (
              <CardListView cards={cards} />
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCard(null);
        }}
        title="Delete Business Card"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedCard?.name}"? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedCard(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCard}
            >
              Delete Card
            </Button>
          </div>
        </div>
      </Modal>

      {/* Click outside to close dropdown */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setSelectedCard(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard; 