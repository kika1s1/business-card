import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Crown, Tag, Sparkles, Zap, Star, Layout } from 'lucide-react';
import { Button, Input, Modal } from '../ui';
import TemplateCard from './TemplateCard';
import TemplatePreview from './TemplatePreview';
import { TEMPLATES, getTemplatesByCategory } from './TemplateData';
import { CARD_CATEGORIES, CATEGORY_LABELS } from '../../utils/constants';

const TemplateGallery = ({ 
  onSelectTemplate, 
  selectedTemplate,
  showSelectionControls = true,
  maxSelection = 1 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Filter templates based on search, category, and premium status
  const filteredTemplates = useMemo(() => {
    let filtered = getTemplatesByCategory(selectedCategory);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.features.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Premium filter
    if (showPremiumOnly) {
      filtered = filtered.filter(template => template.isPremium);
    }

    return filtered;
  }, [searchTerm, selectedCategory, showPremiumOnly]);

  const handleTemplateSelect = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const getCategoryCount = (category) => {
    return getTemplatesByCategory(category).length;
  };

  const getPremiumCount = () => {
    return TEMPLATES.filter(t => t.isPremium).length;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      corporate: '🏢',
      creative: '🎨',
      healthcare: '🏥',
      technology: '💻',
      legal: '⚖️',
      consultant: '💼'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-blue-50 rounded-full">
          <Layout className="h-5 w-5 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">Choose Your Perfect Template</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Business Card Templates</h2>
          <p className="text-gray-600">
            Browse our collection of {TEMPLATES.length} professionally designed templates, 
            including {getPremiumCount()} premium options
          </p>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates by name, style, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 focus:bg-white transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                All Templates
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {TEMPLATES.length}
                </span>
              </button>

              {Object.entries(CARD_CATEGORIES).map(([key, category]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {CATEGORY_LABELS[category]}
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {getCategoryCount(category)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">Premium only</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    {getPremiumCount()}
                  </span>
                </div>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">View:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || selectedCategory !== 'all' || showPremiumOnly) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-800 font-medium">
                Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedCategory !== 'all' && ` in ${CATEGORY_LABELS[selectedCategory]}`}
                {showPremiumOnly && ` (Premium only)`}
              </span>
            </div>
            {(searchTerm || selectedCategory !== 'all' || showPremiumOnly) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setShowPremiumOnly(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={handleTemplateSelect}
              onPreview={handlePreview}
              className={viewMode === 'list' ? 'flex-row' : ''}
            />
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setShowPremiumOnly(false);
                }}
              >
                Clear all filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {filteredTemplates.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">{filteredTemplates.length}</div>
              <div className="text-sm text-gray-500">Templates Found</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {filteredTemplates.filter(t => t.isPremium).length}
              </div>
              <div className="text-sm text-gray-500">Premium Options</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {new Set(filteredTemplates.map(t => t.category)).size}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {filteredTemplates.filter(t => !t.isPremium).length}
              </div>
              <div className="text-sm text-gray-500">Free Templates</div>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={`Preview: ${previewTemplate.name}`}
          size="lg"
        >
          <TemplatePreview
            template={previewTemplate}
            onSelect={() => {
              handleTemplateSelect(previewTemplate);
              setPreviewTemplate(null);
            }}
            onClose={() => setPreviewTemplate(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default TemplateGallery; 