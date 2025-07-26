import React from 'react';
import { Crown, Check, Eye, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '../ui';
import { CATEGORY_LABELS } from '../../utils/constants';

const TemplateCard = ({ 
  template, 
  isSelected = false, 
  onSelect, 
  onPreview,
  className = '' 
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(template);
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    if (onPreview) {
      onPreview(template);
    }
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

  const getCategoryColor = (category) => {
    const colors = {
      corporate: 'bg-blue-100 text-blue-800',
      creative: 'bg-purple-100 text-purple-800',
      healthcare: 'bg-green-100 text-green-800',
      technology: 'bg-cyan-100 text-cyan-800',
      legal: 'bg-gray-100 text-gray-800',
      consultant: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div 
      className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl ${
        isSelected 
          ? 'border-primary-500 shadow-xl ring-4 ring-primary-100' 
          : 'border-gray-200 hover:border-primary-300 shadow-lg hover:shadow-xl'
      } ${className}`}
      onClick={handleSelect}
    >
      {/* Premium badge with enhanced styling */}
      {template.isPremium && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
            <Crown className="h-3 w-3 mr-1" />
            PRO
          </div>
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-primary-500 text-white p-2 rounded-full shadow-lg ring-4 ring-white">
            <Check className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Enhanced Template Preview with Credit Card Proportions */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl p-6 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary-500"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-accent-500"></div>
        </div>

        {/* Credit card sized preview */}
        <div className="relative mx-auto" style={{ width: '240px', height: '150px' }}>
          <div 
            className="w-full h-full rounded-xl shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-1 relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${template.colors.secondary}, ${template.colors.primary}15)`,
              color: template.colors.text 
            }}
          >
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/30"></div>
              <div className="absolute top-2 right-8 w-4 h-4 rounded-full bg-white/20"></div>
            </div>

            {/* Card Content based on layout type */}
            {template.layout.type === 'split' && (
              <div className="relative flex h-full p-4 z-10">
                {/* Left side */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
                      style={{ backgroundColor: template.colors.primary }}
                    >
                      {template.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    {/* Chip design like credit cards */}
                    <div className="w-4 h-3 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-80"></div>
                  </div>
                  
                  <div className="space-y-1">
                    <div 
                      className="w-20 h-2 rounded"
                      style={{ backgroundColor: template.colors.text }}
                    />
                    <div 
                      className="w-16 h-1 rounded"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                  </div>
                </div>
                
                {/* Right side */}
                <div className="flex-1 flex flex-col justify-center space-y-1 text-right">
                  <div 
                    className="w-12 h-1 rounded ml-auto"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                  <div 
                    className="w-16 h-1 rounded ml-auto"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                  <div 
                    className="w-14 h-1 rounded ml-auto"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                </div>
              </div>
            )}

            {template.layout.type === 'centered' && (
              <div className="relative flex flex-col h-full p-4 z-10">
                {/* Top section */}
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                    style={{ backgroundColor: template.colors.primary }}
                  >
                    {template.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  {/* Credit card chip */}
                  <div className="w-4 h-3 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-80"></div>
                </div>

                {/* Center content */}
                <div className="flex-1 flex flex-col justify-center space-y-2 text-center">
                  <div 
                    className="w-24 h-2 rounded mx-auto"
                    style={{ backgroundColor: template.colors.text }}
                  />
                  <div 
                    className="w-20 h-1 rounded mx-auto"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                </div>

                {/* Bottom section */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div 
                    className="w-8 h-0.5 rounded"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                  <div 
                    className="w-10 h-0.5 rounded ml-auto"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                </div>
              </div>
            )}

            {template.layout.type === 'artistic' && (
              <div className="relative h-full p-4 z-10">
                <div 
                  className="absolute top-2 right-2 w-6 h-6 rounded-full shadow-sm"
                  style={{ backgroundColor: template.colors.primary }}
                />
                <div className="absolute bottom-4 left-4 space-y-1">
                  <div 
                    className="w-18 h-2 rounded transform -rotate-2"
                    style={{ backgroundColor: template.colors.text }}
                  />
                  <div 
                    className="w-14 h-1 rounded transform rotate-1"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                </div>
                <div className="absolute top-8 left-4 w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.accent }}></div>
              </div>
            )}

            {template.layout.type === 'professional' && (
              <div className="relative flex flex-col h-full p-4 z-10">
                <div className="flex justify-center mb-3">
                  <div 
                    className="w-8 h-8 rounded shadow-sm"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-1 text-center">
                  <div 
                    className="w-20 h-2 rounded mx-auto"
                    style={{ backgroundColor: template.colors.text }}
                  />
                  <div 
                    className="w-16 h-1 rounded mx-auto"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                  <div 
                    className="w-18 h-1 rounded mx-auto"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                </div>
                <div className="flex justify-between">
                  <div 
                    className="w-6 h-0.5 rounded"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                  <div 
                    className="w-8 h-0.5 rounded"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                </div>
              </div>
            )}

            {/* Default layout for other types */}
            {!['split', 'centered', 'artistic', 'professional'].includes(template.layout.type) && (
              <div className="relative p-4 space-y-2 z-10">
                <div className="flex justify-between items-start">
                  <div 
                    className="w-6 h-6 rounded-full shadow-sm"
                    style={{ backgroundColor: template.colors.primary }}
                  />
                  <div className="text-right space-y-1">
                    <div 
                      className="w-12 h-1 rounded"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                    <div 
                      className="w-10 h-1 rounded"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div 
                    className="w-16 h-2 rounded"
                    style={{ backgroundColor: template.colors.text }}
                  />
                  <div 
                    className="w-12 h-1 rounded"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                </div>
              </div>
            )}

            {/* Card shine effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Enhanced Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-t-2xl backdrop-blur-sm">
          <div className="text-center space-y-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePreview}
              className="bg-white/90 hover:bg-white text-gray-900 font-semibold shadow-lg transform group-hover:scale-105 transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Card
            </Button>
            <div className="text-white text-xs font-medium">
              Click to preview this template
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Template Info */}
      <div className="p-5">
        {/* Header with category */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getCategoryIcon(template.category)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                {CATEGORY_LABELS[template.category]}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{template.name}</h3>
          </div>
          {template.isPremium && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Crown className="h-4 w-4" />
              <Star className="h-3 w-3" />
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {template.description}
        </p>

        {/* Enhanced Features */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {template.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full font-medium border border-gray-200 hover:shadow-sm transition-shadow"
              >
                {index === 0 && <Sparkles className="h-3 w-3 mr-1" />}
                {index === 1 && <Zap className="h-3 w-3 mr-1" />}
                {index === 2 && <Star className="h-3 w-3 mr-1" />}
                {feature}
              </span>
            ))}
            {template.features.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                +{template.features.length - 3} more features
              </span>
            )}
          </div>

          {/* Template stats */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                Ready to use
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                High quality
              </span>
            </div>
            
            {isSelected ? (
              <div className="text-primary-600 text-xs font-semibold flex items-center gap-1">
                <Check className="h-3 w-3" />
                Selected
              </div>
            ) : (
              <div className="text-gray-400 text-xs">
                Click to select
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced selection overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-primary-400/5 to-primary-600/10 rounded-2xl pointer-events-none">
          <div className="absolute inset-0 border-2 border-primary-400 rounded-2xl animate-pulse"></div>
        </div>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5"></div>
      </div>
    </div>
  );
};

export default TemplateCard; 