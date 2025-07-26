import { CARD_CATEGORIES } from '../../utils/constants';

// Template data with professional designs
export const TEMPLATES = [
  // Corporate/Business Executive Templates
  {
    id: 'corp-executive-1',
    name: 'Executive Classic',
    category: CARD_CATEGORIES.CORPORATE,
    preview: '/api/templates/corp-executive-1/preview.png',
    isPremium: false,
    description: 'Clean and professional design perfect for executives and corporate professionals.',
    colors: {
      primary: '#1e3a8a',
      secondary: '#f8fafc',
      accent: '#3b82f6',
      text: '#1e293b'
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Inter'
    },
    layout: {
      type: 'split',
      orientation: 'horizontal',
      logoPosition: 'top-left',
      alignment: 'left'
    },
    features: ['Logo placement', 'Professional typography', 'Contact details', 'Social links']
  },
  {
    id: 'corp-minimal-1',
    name: 'Corporate Minimal',
    category: CARD_CATEGORIES.CORPORATE,
    preview: '/api/templates/corp-minimal-1/preview.png',
    isPremium: true,
    description: 'Minimalist design with clean lines and sophisticated typography.',
    colors: {
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#6b7280',
      text: '#111827'
    },
    fonts: {
      primary: 'Roboto',
      secondary: 'Roboto'
    },
    layout: {
      type: 'centered',
      orientation: 'vertical',
      logoPosition: 'center',
      alignment: 'center'
    },
    features: ['Minimalist design', 'Premium typography', 'Elegant spacing', 'Modern layout']
  },

  // Creative Professional Templates
  {
    id: 'creative-vibrant-1',
    name: 'Creative Burst',
    category: CARD_CATEGORIES.CREATIVE,
    preview: '/api/templates/creative-vibrant-1/preview.png',
    isPremium: false,
    description: 'Vibrant and creative design for artists, designers, and creative professionals.',
    colors: {
      primary: '#f59e0b',
      secondary: '#fef3c7',
      accent: '#d97706',
      text: '#92400e'
    },
    fonts: {
      primary: 'Montserrat',
      secondary: 'Open Sans'
    },
    layout: {
      type: 'artistic',
      orientation: 'diagonal',
      logoPosition: 'top-right',
      alignment: 'mixed'
    },
    features: ['Artistic layout', 'Bold colors', 'Creative typography', 'Portfolio showcase']
  },
  {
    id: 'creative-modern-1',
    name: 'Modern Creative',
    category: CARD_CATEGORIES.CREATIVE,
    preview: '/api/templates/creative-modern-1/preview.png',
    isPremium: true,
    description: 'Modern design with geometric elements perfect for contemporary creatives.',
    colors: {
      primary: '#7c3aed',
      secondary: '#f3f4f6',
      accent: '#a855f7',
      text: '#374151'
    },
    fonts: {
      primary: 'Playfair Display',
      secondary: 'Inter'
    },
    layout: {
      type: 'geometric',
      orientation: 'asymmetric',
      logoPosition: 'bottom-left',
      alignment: 'left'
    },
    features: ['Geometric elements', 'Modern typography', 'Color gradients', 'Asymmetric layout']
  },

  // Healthcare Professional Templates
  {
    id: 'healthcare-clean-1',
    name: 'Medical Professional',
    category: CARD_CATEGORIES.HEALTHCARE,
    preview: '/api/templates/healthcare-clean-1/preview.png',
    isPremium: false,
    description: 'Clean and trustworthy design for healthcare professionals and medical practices.',
    colors: {
      primary: '#0ea5e9',
      secondary: '#f0f9ff',
      accent: '#0284c7',
      text: '#0c4a6e'
    },
    fonts: {
      primary: 'Lato',
      secondary: 'Lato'
    },
    layout: {
      type: 'professional',
      orientation: 'horizontal',
      logoPosition: 'top-center',
      alignment: 'center'
    },
    features: ['Medical iconography', 'Trust-building colors', 'Clear hierarchy', 'Professional layout']
  },
  {
    id: 'healthcare-wellness-1',
    name: 'Wellness & Care',
    category: CARD_CATEGORIES.HEALTHCARE,
    preview: '/api/templates/healthcare-wellness-1/preview.png',
    isPremium: true,
    description: 'Warm and caring design perfect for wellness practitioners and therapists.',
    colors: {
      primary: '#059669',
      secondary: '#ecfdf5',
      accent: '#10b981',
      text: '#065f46'
    },
    fonts: {
      primary: 'Merriweather',
      secondary: 'Open Sans'
    },
    layout: {
      type: 'organic',
      orientation: 'vertical',
      logoPosition: 'top-left',
      alignment: 'left'
    },
    features: ['Organic shapes', 'Calming colors', 'Wellness iconography', 'Gentle typography']
  },

  // Technology Professional Templates
  {
    id: 'tech-modern-1',
    name: 'Tech Innovation',
    category: CARD_CATEGORIES.TECHNOLOGY,
    preview: '/api/templates/tech-modern-1/preview.png',
    isPremium: false,
    description: 'Cutting-edge design for technology professionals and startups.',
    colors: {
      primary: '#4f46e5',
      secondary: '#eef2ff',
      accent: '#6366f1',
      text: '#312e81'
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Source Code Pro'
    },
    layout: {
      type: 'tech',
      orientation: 'grid',
      logoPosition: 'top-right',
      alignment: 'right'
    },
    features: ['Tech aesthetics', 'Code-inspired typography', 'Digital elements', 'Innovation theme']
  },
  {
    id: 'tech-startup-1',
    name: 'Startup Founder',
    category: CARD_CATEGORIES.TECHNOLOGY,
    preview: '/api/templates/tech-startup-1/preview.png',
    isPremium: true,
    description: 'Dynamic design for startup founders and tech entrepreneurs.',
    colors: {
      primary: '#dc2626',
      secondary: '#fef2f2',
      accent: '#ef4444',
      text: '#991b1b'
    },
    fonts: {
      primary: 'Montserrat',
      secondary: 'Inter'
    },
    layout: {
      type: 'dynamic',
      orientation: 'diagonal',
      logoPosition: 'center',
      alignment: 'center'
    },
    features: ['Dynamic layout', 'Startup energy', 'Bold typography', 'Innovation elements']
  },

  // Legal Professional Templates
  {
    id: 'legal-traditional-1',
    name: 'Legal Authority',
    category: CARD_CATEGORIES.LEGAL,
    preview: '/api/templates/legal-traditional-1/preview.png',
    isPremium: false,
    description: 'Traditional and authoritative design for legal professionals and law firms.',
    colors: {
      primary: '#1f2937',
      secondary: '#f9fafb',
      accent: '#374151',
      text: '#111827'
    },
    fonts: {
      primary: 'Crimson Text',
      secondary: 'Inter'
    },
    layout: {
      type: 'traditional',
      orientation: 'vertical',
      logoPosition: 'top-center',
      alignment: 'center'
    },
    features: ['Traditional design', 'Authority elements', 'Legal typography', 'Professional spacing']
  },

  // Consultant/Freelancer Templates
  {
    id: 'consultant-professional-1',
    name: 'Independent Consultant',
    category: CARD_CATEGORIES.CONSULTANT,
    preview: '/api/templates/consultant-professional-1/preview.png',
    isPremium: false,
    description: 'Versatile design perfect for consultants and freelance professionals.',
    colors: {
      primary: '#0f172a',
      secondary: '#f1f5f9',
      accent: '#475569',
      text: '#1e293b'
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Inter'
    },
    layout: {
      type: 'flexible',
      orientation: 'horizontal',
      logoPosition: 'top-left',
      alignment: 'left'
    },
    features: ['Versatile design', 'Professional appeal', 'Flexible layout', 'Consultant branding']
  },
  {
    id: 'consultant-creative-1',
    name: 'Creative Consultant',
    category: CARD_CATEGORIES.CONSULTANT,
    preview: '/api/templates/consultant-creative-1/preview.png',
    isPremium: true,
    description: 'Creative and professional design for creative consultants and strategists.',
    colors: {
      primary: '#be185d',
      secondary: '#fdf2f8',
      accent: '#ec4899',
      text: '#831843'
    },
    fonts: {
      primary: 'Playfair Display',
      secondary: 'Inter'
    },
    layout: {
      type: 'creative-professional',
      orientation: 'asymmetric',
      logoPosition: 'bottom-right',
      alignment: 'mixed'
    },
    features: ['Creative elements', 'Professional structure', 'Unique layout', 'Strategic design']
  }
];

// Get templates by category
export const getTemplatesByCategory = (category) => {
  if (category === 'all') return TEMPLATES;
  return TEMPLATES.filter(template => template.category === category);
};

// Get template by ID
export const getTemplateById = (id) => {
  return TEMPLATES.find(template => template.id === id);
};

// Get featured templates (mix of free and premium)
export const getFeaturedTemplates = () => {
  return TEMPLATES.filter((_, index) => index < 6);
};

// Get free templates
export const getFreeTemplates = () => {
  return TEMPLATES.filter(template => !template.isPremium);
};

// Get premium templates
export const getPremiumTemplates = () => {
  return TEMPLATES.filter(template => template.isPremium);
};

export default TEMPLATES; 