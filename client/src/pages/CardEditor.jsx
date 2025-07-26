import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Download, 
  Eye, 
  Palette, 
  Type,
  Image as ImageIcon,
  ArrowLeft,
  RotateCcw,
  FileImage,
  FileText
} from 'lucide-react';
import { useCards } from '../hooks/useCards';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, LoadingSpinner } from '../components/ui';
import TemplateGallery from '../components/templates/TemplateGallery';
import { getTemplateById } from '../components/templates/TemplateData';
import { validateForm, cardContentSchema } from '../utils/validation';
import { COLOR_SCHEMES, FONT_OPTIONS } from '../utils/constants';
import cardExport from '../services/cardExport';
import simpleCardExport from '../services/simpleCardExport';

const CardEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCardById, createCard, updateCard } = useCards();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cardData, setCardData] = useState({
    name: 'Untitled Card',
    content: {
      name: user?.firstName + ' ' + user?.lastName || '',
      title: '',
      company: '',
      email: user?.email || '',
      phone: '',
      website: '',
      address: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        instagram: '',
        facebook: ''
      }
    },
    design: {
      colors: COLOR_SCHEMES.PROFESSIONAL.colors,
      fonts: {
        primary: 'Inter',
        secondary: 'Inter'
      },
      fontSize: {
        name: 18,
        title: 14,
        contact: 12
      }
    }
  });
  const [errors, setErrors] = useState({});

  // Load existing card if editing
  useEffect(() => {
    if (id && id !== 'new') {
      const existingCard = getCardById(id);
      if (existingCard) {
        setCardData(existingCard);
        setSelectedTemplate(getTemplateById(existingCard.templateId));
        setCurrentStep(2); // Skip template selection for existing cards
      }
    }
  }, [id, getCardById]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCardData(prev => ({
      ...prev,
      design: {
        ...prev.design,
        colors: template.colors,
        fonts: template.fonts
      }
    }));
    setCurrentStep(2);
  };

  const handleContentChange = (field, value) => {
    setCardData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
    
    // Clear field error
    if (errors[`content.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`content.${field}`]: ''
      }));
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setCardData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        socialLinks: {
          ...prev.content.socialLinks,
          [platform]: value
        }
      }
    }));
  };

  const handleDesignChange = (category, field, value) => {
    setCardData(prev => ({
      ...prev,
      design: {
        ...prev.design,
        [category]: {
          ...prev.design[category],
          [field]: value
        }
      }
    }));
  };

  const handleColorSchemeChange = (colorScheme) => {
    setCardData(prev => ({
      ...prev,
      design: {
        ...prev.design,
        colors: colorScheme.colors
      }
    }));
  };

  const handleSave = async () => {
    const validation = validateForm(cardContentSchema, cardData.content);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const cardToSave = {
        ...cardData,
        templateId: selectedTemplate?.id,
        category: selectedTemplate?.category
      };

      let result;
      if (id && id !== 'new') {
        result = await updateCard(id, cardToSave);
      } else {
        result = await createCard(cardToSave);
      }

      if (result.success) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format = 'png') => {
    const cardElement = document.getElementById('card-preview');
    
    // Enhanced debugging
    console.log('Export attempt:', { format, cardElement, cardData });
    
    if (!cardElement) {
      console.error('Card preview element not found');
      alert('Card preview not found. Please make sure a template is selected.');
      return;
    }

    // Check if element is visible
    const rect = cardElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.error('Card element has no dimensions:', rect);
      alert('Card preview is not visible. Please ensure the card is properly loaded.');
      return;
    }

    setExporting(true);
    try {
      console.log('Starting export process...');
      
      if (format === 'png') {
        try {
          // Try simple export first (more reliable)
          const result = await simpleCardExport.exportPNG(cardElement, `${cardData.name || 'business-card'}.png`);
          console.log('Simple PNG export successful:', result);
        } catch (simpleError) {
          console.warn('Simple PNG export failed, trying advanced method:', simpleError);
          try {
            const result = await cardExport.exportAsPNG(cardElement, `${cardData.name || 'business-card'}.png`);
            console.log('Advanced PNG export successful:', result);
          } catch (advancedError) {
            console.warn('Advanced PNG export failed, trying ultra-simple fallback:', advancedError);
            const result = await simpleCardExport.exportFallback(cardElement, `${cardData.name || 'business-card'}.png`);
            console.log('Fallback PNG export successful:', result);
          }
        }
      } else if (format === 'pdf') {
        try {
          // Try simple PDF export first
          const result = await simpleCardExport.exportPDF(cardElement, `${cardData.name || 'business-card'}.pdf`);
          console.log('Simple PDF export successful:', result);
        } catch (simplePdfError) {
          console.warn('Simple PDF export failed, trying advanced method:', simplePdfError);
          const result = await cardExport.exportAsPDF(cardElement, `${cardData.name || 'business-card'}.pdf`);
          console.log('Advanced PDF export successful:', result);
        }
      }
      
      // Show success message
      alert('Export completed successfully!');
    } catch (error) {
      console.error('All export methods failed:', error);
      alert(`Export failed: ${error.message || 'Unknown error'}. Please check the console for details and try again.`);
    } finally {
      setExporting(false);
    }
  };

  // CardPreview Component - Credit Card Style with proper proportions
  const CardPreview = () => {
    if (!selectedTemplate) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Preview</h3>
          <p className="text-gray-600">Select a template to see your business card preview</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h3>
          <p className="text-sm text-gray-600">Credit card sized business card (3.5" × 2")</p>
        </div>
        
        <div className="flex justify-center mb-6">
          {/* Credit Card Container with proper aspect ratio */}
          <div className="relative perspective-1000">
            <div 
              id="card-preview"
              className="relative w-96 h-60 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 hover:rotate-1 transition-all duration-300 cursor-pointer"
              style={{ 
                background: `linear-gradient(135deg, ${cardData.design.colors.secondary}, ${cardData.design.colors.primary}20)`,
                fontFamily: cardData.design.fonts.primary,
                aspectRatio: '1.6 / 1' // Credit card proportions
              }}
            >
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20"></div>
                <div className="absolute top-4 right-16 w-8 h-8 rounded-full bg-white/15"></div>
              </div>

              {/* Card Content */}
              {selectedTemplate?.layout?.type === 'split' ? (
                <div className="relative flex h-full p-6 z-10">
                  {/* Left side */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Top section with logo/initials */}
                    <div className="flex items-start justify-between">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        style={{ 
                          backgroundColor: cardData.design.colors.primary,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      >
                        {cardData.content.name ? 
                          cardData.content.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                          'YN'
                        }
                      </div>
                      {/* Chip design like credit cards */}
                      <div className="w-8 h-6 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-sm opacity-80"></div>
                    </div>

                    {/* Name and Title */}
                    <div className="space-y-1">
                      <h2 
                        className="font-bold leading-tight tracking-wide truncate max-w-full"
                        style={{ 
                          color: cardData.design.colors.text,
                          fontSize: `${Math.min(cardData.design.fontSize.name, 20)}px`,
                          fontFamily: cardData.design.fonts.primary,
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}
                        title={cardData.content.name || 'Your Name'}
                      >
                        {cardData.content.name || 'Your Name'}
                      </h2>
                      <p 
                        className="font-medium uppercase tracking-wider text-xs truncate max-w-full"
                        style={{ 
                          color: cardData.design.colors.accent,
                          fontSize: `${Math.min(cardData.design.fontSize.title, 14)}px`,
                          fontFamily: cardData.design.fonts.secondary
                        }}
                        title={cardData.content.title || 'Your Title'}
                      >
                        {cardData.content.title || 'Your Title'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Right side - Contact Info */}
                  <div className="flex-1 flex flex-col justify-center space-y-2 text-right">
                    <div 
                      className="space-y-1 text-xs font-medium"
                      style={{ color: cardData.design.colors.accent }}
                    >
                      {cardData.content.company && (
                        <p className="font-semibold truncate max-w-full" title={cardData.content.company}>
                          {cardData.content.company}
                        </p>
                      )}
                      {cardData.content.email && (
                        <p className="truncate max-w-full" title={cardData.content.email}>
                          {cardData.content.email}
                        </p>
                      )}
                      {cardData.content.phone && (
                        <p className="font-mono tracking-wider truncate max-w-full" title={cardData.content.phone}>
                          {cardData.content.phone}
                        </p>
                      )}
                      {cardData.content.website && (
                        <p className="truncate max-w-full" title={cardData.content.website}>
                          {cardData.content.website.replace(/^https?:\/\//, '')}
                        </p>
                      )}
                      {cardData.content.address && (
                        <p className="text-xs leading-tight truncate max-w-full" title={cardData.content.address}>
                          {cardData.content.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Centered layout - Modern credit card style
                <div className="relative flex flex-col h-full p-6 z-10">
                  {/* Top section */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                      style={{ 
                        backgroundColor: cardData.design.colors.primary,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    >
                      {cardData.content.name ? 
                        cardData.content.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                        'YN'
                      }
                    </div>
                    {/* Credit card chip */}
                    <div className="w-8 h-6 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-sm opacity-80"></div>
                  </div>

                  {/* Center content */}
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    <div className="text-center">
                      <h2 
                        className="font-bold tracking-wide truncate max-w-full"
                        style={{ 
                          color: cardData.design.colors.text,
                          fontSize: `${Math.min(cardData.design.fontSize.name, 22)}px`,
                          fontFamily: cardData.design.fonts.primary,
                          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}
                        title={cardData.content.name || 'Your Name'}
                      >
                        {cardData.content.name || 'Your Name'}
                      </h2>
                      <p 
                        className="font-medium uppercase tracking-wider text-sm mt-1 truncate max-w-full"
                        style={{ 
                          color: cardData.design.colors.accent,
                          fontSize: `${Math.min(cardData.design.fontSize.title, 16)}px`,
                          fontFamily: cardData.design.fonts.secondary
                        }}
                        title={cardData.content.title || 'Your Title'}
                      >
                        {cardData.content.title || 'Your Title'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom section - Contact details */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1" style={{ color: cardData.design.colors.accent }}>
                      {cardData.content.email && (
                        <p className="truncate max-w-full font-medium" title={cardData.content.email}>
                          📧 {cardData.content.email}
                        </p>
                      )}
                      {cardData.content.phone && (
                        <p className="truncate max-w-full font-mono" title={cardData.content.phone}>
                          📞 {cardData.content.phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 text-right" style={{ color: cardData.design.colors.accent }}>
                      {cardData.content.website && (
                        <p className="truncate max-w-full" title={cardData.content.website}>
                          🌐 {cardData.content.website.replace(/^https?:\/\//, '')}
                        </p>
                      )}
                      {cardData.content.company && (
                        <p className="truncate max-w-full font-semibold" title={cardData.content.company}>
                          🏢 {cardData.content.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Card shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Export buttons in preview panel */}
        {selectedTemplate && (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('png')}
              disabled={exporting}
              className="w-full"
            >
              <FileImage className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export as PNG'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </div>
        )}
      </div>
    );
  };

  const steps = [
    { number: 1, title: 'Choose Template', description: 'Select a professional template' },
    { number: 2, title: 'Add Content', description: 'Fill in your information' },
    { number: 3, title: 'Customize Design', description: 'Personalize colors and fonts' },
    { number: 4, title: 'Preview & Save', description: 'Review and save your card' }
  ];

  if (loading && !selectedTemplate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading card editor..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 border-l border-gray-300" />
              <h1 className="text-lg font-semibold text-gray-900">
                {id && id !== 'new' ? 'Edit Card' : 'Create New Card'}
              </h1>
              {selectedTemplate && (
                <span className="text-sm text-gray-500">
                  • {selectedTemplate.name}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  disabled={!selectedTemplate && currentStep === 1}
                  size="sm"
                >
                  Next Step
                  <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                </Button>
              ) : (
                <Button onClick={handleSave} disabled={loading || !selectedTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Card'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Steps */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Mobile Step Indicator */}
          <div className="md:hidden mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep - 1].title}</h3>
              <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
          </div>

          {/* Desktop Step Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full z-0">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
              
              {steps.map((step, index) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                const isAccessible = selectedTemplate || step.number === 1;
                
                return (
                  <div key={step.number} className="relative z-10 flex flex-col items-center group">
                    {/* Step Circle */}
                    <button
                      onClick={() => isAccessible && setCurrentStep(step.number)}
                      disabled={!isAccessible}
                      className={`
                        relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                        transition-all duration-300 transform group-hover:scale-110
                        ${isCompleted 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25' 
                          : isActive 
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 ring-4 ring-primary-100'
                            : isAccessible
                              ? 'bg-white border-2 border-gray-300 text-gray-600 hover:border-primary-300 hover:text-primary-600 shadow-md'
                              : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span>{step.number}</span>
                      )}
                      
                      {/* Active Step Pulse */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-20"></div>
                      )}
                    </button>
                    
                    {/* Step Content */}
                    <div className="mt-3 text-center max-w-32">
                      <h3 className={`
                        text-sm font-semibold transition-colors duration-200
                        ${isActive ? 'text-primary-700' : isCompleted ? 'text-green-700' : 'text-gray-600'}
                      `}>
                        {step.title}
                      </h3>
                      <p className={`
                        text-xs mt-1 transition-colors duration-200
                        ${isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                      `}>
                        {step.description}
                      </p>
                    </div>

                    {/* Step Status Badge */}
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Actions */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    className="flex items-center space-x-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-xs text-gray-500">
                  Step {currentStep} of {steps.length}
                </div>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    disabled={!selectedTemplate && currentStep === 1}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <span>Continue</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSave} 
                    disabled={loading || !selectedTemplate}
                    className="flex items-center space-x-1"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Complete & Save'}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose a Template</h2>
                  <p className="text-gray-600">Select a professional template for your business card</p>
                </div>
                <TemplateGallery
                  onSelectTemplate={handleTemplateSelect}
                  selectedTemplate={selectedTemplate}
                />
              </div>
            )}

            {currentStep === 2 && selectedTemplate && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Card Information</h2>
                  <p className="text-gray-600">Fill in your business card details</p>
                </div>

                <div className="space-y-6">
                  <Input
                    label="Card Name"
                    value={cardData.name}
                    onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Business Card"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      value={cardData.content.name}
                      onChange={(e) => handleContentChange('name', e.target.value)}
                      error={errors['content.name']}
                      required
                    />
                    <Input
                      label="Job Title"
                      value={cardData.content.title}
                      onChange={(e) => handleContentChange('title', e.target.value)}
                      placeholder="e.g. Senior Developer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Company"
                      value={cardData.content.company}
                      onChange={(e) => handleContentChange('company', e.target.value)}
                      placeholder="Company Name"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={cardData.content.email}
                      onChange={(e) => handleContentChange('email', e.target.value)}
                      error={errors['content.email']}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone"
                      value={cardData.content.phone}
                      onChange={(e) => handleContentChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                    <Input
                      label="Website"
                      value={cardData.content.website}
                      onChange={(e) => handleContentChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <Input
                    label="Address"
                    value={cardData.content.address}
                    onChange={(e) => handleContentChange('address', e.target.value)}
                    placeholder="123 Main St, City, State 12345"
                  />

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Social Links (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="LinkedIn"
                        value={cardData.content.socialLinks.linkedin}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                      />
                      <Input
                        label="Twitter"
                        value={cardData.content.socialLinks.twitter}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/username"
                      />
                      <Input
                        label="Instagram"
                        value={cardData.content.socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/username"
                      />
                      <Input
                        label="Facebook"
                        value={cardData.content.socialLinks.facebook}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(3)}>
                      Next: Customize Design
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Design Customization</h2>
                  <p className="text-gray-600">Personalize your card's appearance</p>
                </div>

                <div className="space-y-8">
                  {/* Color Schemes */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <Palette className="h-4 w-4 mr-2" />
                      Color Schemes
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                        <button
                          key={key}
                          onClick={() => handleColorSchemeChange(scheme)}
                          className={`p-3 border rounded-lg text-left hover:border-primary-300 transition-colors ${
                            JSON.stringify(cardData.design.colors) === JSON.stringify(scheme.colors)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex space-x-1 mb-2">
                            {Object.values(scheme.colors).slice(0, 4).map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-gray-900">{scheme.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fonts */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <Type className="h-4 w-4 mr-2" />
                      Typography
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Font
                        </label>
                        <select
                          value={cardData.design.fonts.primary}
                          onChange={(e) => handleDesignChange('fonts', 'primary', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {FONT_OPTIONS.map(font => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Font
                        </label>
                        <select
                          value={cardData.design.fonts.secondary}
                          onChange={(e) => handleDesignChange('fonts', 'secondary', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {FONT_OPTIONS.map(font => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(4)}>
                      Next: Preview
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Final Review</h2>
                  <p className="text-gray-600">Review your business card before saving</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Card Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600">Card Name:</span>
                          <span className="ml-2 font-medium">{cardData.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Template:</span>
                          <span className="ml-2 font-medium">{selectedTemplate?.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">{cardData.content.name || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Title:</span>
                          <span className="ml-2 font-medium">{cardData.content.title || 'Not set'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600">Company:</span>
                          <span className="ml-2 font-medium">{cardData.content.company || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{cardData.content.email || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <span className="ml-2 font-medium">{cardData.content.phone || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Website:</span>
                          <span className="ml-2 font-medium">{cardData.content.website || 'Not set'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(3)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => handleExport('png')}
                        disabled={exporting}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {exporting ? 'Exporting...' : 'Export'}
                      </Button>
                      <Button onClick={handleSave} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Card'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CardPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditor; 