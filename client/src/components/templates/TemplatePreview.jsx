import React from 'react';
import { Crown, Check, X, Palette, Type, Layout, Star } from 'lucide-react';
import { Button, Modal } from '../ui';
import { CATEGORY_LABELS } from '../../utils/constants';

const TemplatePreview = ({ 
  template, 
  isOpen, 
  onClose, 
  onSelect,
  isSelected = false 
}) => {
  if (!template) return null;

  const handleSelect = () => {
    if (onSelect) {
      onSelect(template);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="max-w-4xl"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Preview Section */}
        <div className="lg:w-1/2">
          <div className="aspect-[1.75/1] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 relative">
            {/* Premium badge */}
            {template.isPremium && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Crown className="h-4 w-4 mr-1" />
                  Premium
                </div>
              </div>
            )}

            {/* Large template preview */}
            <div 
              className="w-full h-full rounded-lg shadow-lg p-6 transform scale-100 transition-transform duration-200"
              style={{ 
                backgroundColor: template.colors.secondary,
                color: template.colors.text 
              }}
            >
              {/* Detailed template preview based on layout */}
              {template.layout.type === 'split' && (
                <div className="flex h-full">
                  <div className="flex-1 space-y-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: template.colors.primary }}
                    >
                      JD
                    </div>
                    <div className="space-y-2">
                      <div 
                        className="w-32 h-4 rounded"
                        style={{ backgroundColor: template.colors.text }}
                      />
                      <div 
                        className="w-24 h-3 rounded"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                      <div 
                        className="w-28 h-3 rounded"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-right space-y-2">
                      <div 
                        className="w-20 h-3 rounded ml-auto"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                      <div 
                        className="w-24 h-3 rounded ml-auto"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                      <div 
                        className="w-18 h-3 rounded ml-auto"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                      <div 
                        className="w-22 h-3 rounded ml-auto"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {template.layout.type === 'centered' && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                    style={{ backgroundColor: template.colors.primary }}
                  >
                    JD
                  </div>
                  <div className="space-y-2 text-center">
                    <div 
                      className="w-40 h-4 rounded mx-auto"
                      style={{ backgroundColor: template.colors.text }}
                    />
                    <div 
                      className="w-32 h-3 rounded mx-auto"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                    <div 
                      className="w-36 h-3 rounded mx-auto"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                  </div>
                </div>
              )}

              {/* Default preview for other layouts */}
              {!['split', 'centered'].includes(template.layout.type) && (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: template.colors.primary }}
                    >
                      JD
                    </div>
                    <div className="text-right space-y-2">
                      <div 
                        className="w-20 h-3 rounded"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                      <div 
                        className="w-16 h-2 rounded"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="w-28 h-4 rounded"
                      style={{ backgroundColor: template.colors.text }}
                    />
                    <div 
                      className="w-20 h-3 rounded"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                    <div 
                      className="w-24 h-3 rounded"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Color Palette */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Palette className="h-4 w-4 mr-1" />
              Color Palette
            </h4>
            <div className="flex space-x-2">
              {Object.entries(template.colors).map(([key, color]) => (
                <div key={key} className="text-center">
                  <div 
                    className="w-8 h-8 rounded border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-500 mt-1 block capitalize">
                    {key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{template.name}</h3>
              {template.isPremium && (
                <Crown className="h-6 w-6 text-yellow-600" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {CATEGORY_LABELS[template.category]}
            </p>
            <p className="text-gray-700">{template.description}</p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Key Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {template.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Type className="h-4 w-4 mr-1" />
              Typography
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Primary Font:</span>
                <span className="font-medium">{template.fonts.primary}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Secondary Font:</span>
                <span className="font-medium">{template.fonts.secondary}</span>
              </div>
            </div>
          </div>

          {/* Layout Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Layout className="h-4 w-4 mr-1" />
              Layout Details
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Layout Type:</span>
                <span className="font-medium capitalize">{template.layout.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Orientation:</span>
                <span className="font-medium capitalize">{template.layout.orientation}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Logo Position:</span>
                <span className="font-medium capitalize">{template.layout.logoPosition.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleSelect}
              className="flex-1"
              disabled={isSelected}
            >
              {isSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Selected
                </>
              ) : (
                'Use This Template'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>

          {template.isPremium && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <Crown className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h5 className="text-sm font-medium text-yellow-800">Premium Template</h5>
                  <p className="text-sm text-yellow-700">
                    This template requires a Pro or Business subscription.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TemplatePreview; 