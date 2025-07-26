// API Configuration
export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CARD_EDITOR: '/card-editor',
  CARD_EDIT: '/card-editor/:id/edit',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_USERS: '/admin/users',
  ADMIN_SYSTEM: '/admin/system',
  ANALYTICS: '/analytics'
};

// Card Template Categories
export const CARD_CATEGORIES = {
  CORPORATE: 'corporate',
  CREATIVE: 'creative',
  HEALTHCARE: 'healthcare',
  TECHNOLOGY: 'technology',
  LEGAL: 'legal',
  CONSULTANT: 'consultant',
};

export const CATEGORY_LABELS = {
  [CARD_CATEGORIES.CORPORATE]: 'Corporate/Business Executive',
  [CARD_CATEGORIES.CREATIVE]: 'Creative Professional',
  [CARD_CATEGORIES.HEALTHCARE]: 'Healthcare Professional',
  [CARD_CATEGORIES.TECHNOLOGY]: 'Technology Professional',
  [CARD_CATEGORIES.LEGAL]: 'Legal Professional',
  [CARD_CATEGORIES.CONSULTANT]: 'Consultant/Freelancer',
};

// Color Schemes
export const COLOR_SCHEMES = {
  PROFESSIONAL: {
    name: 'Professional Blue',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      text: '#1e293b',
      background: '#ffffff'
    }
  },
  CREATIVE: {
    name: 'Creative Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#78716c',
      accent: '#f97316',
      text: '#292524',
      background: '#ffffff'
    }
  },
  ELEGANT: {
    name: 'Elegant Purple',
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      accent: '#a855f7',
      text: '#374151',
      background: '#ffffff'
    }
  },
  MODERN: {
    name: 'Modern Green',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#10b981',
      text: '#111827',
      background: '#ffffff'
    }
  },
  MINIMAL: {
    name: 'Minimal Black',
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#374151',
      text: '#111827',
      background: '#ffffff'
    }
  }
};

// Font Options
export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter', category: 'sans-serif' },
  { value: 'Roboto', label: 'Roboto', category: 'sans-serif' },
  { value: 'Open Sans', label: 'Open Sans', category: 'sans-serif' },
  { value: 'Lato', label: 'Lato', category: 'sans-serif' },
  { value: 'Montserrat', label: 'Montserrat', category: 'sans-serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'serif' },
  { value: 'Crimson Text', label: 'Crimson Text', category: 'serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'serif' },
  { value: 'Source Code Pro', label: 'Source Code Pro', category: 'monospace' },
];

// Card Dimensions (in pixels at 300 DPI)
export const CARD_DIMENSIONS = {
  WIDTH: 1050, // 3.5 inches
  HEIGHT: 600, // 2 inches
  ASPECT_RATIO: 1.75,
  DPI: 300,
  BLEED: 9, // 0.03 inches in pixels
};

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
  MAX_PAGE_SIZE: 100,
};

// Toast Notification Durations
export const TOAST_DURATION = {
  SUCCESS: 4000,
  ERROR: 6000,
  WARNING: 5000,
  INFO: 4000,
};

// Form Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  CARD_NAME_MAX_LENGTH: 100,
  TITLE_MAX_LENGTH: 100,
  COMPANY_MAX_LENGTH: 100,
  ADDRESS_MAX_LENGTH: 200,
  PHONE_MAX_LENGTH: 20,
};

// Social Media Platforms
export const SOCIAL_PLATFORMS = {
  LINKEDIN: 'linkedin',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  GITHUB: 'github',
  BEHANCE: 'behance',
  DRIBBBLE: 'dribbble',
};

export const SOCIAL_PLATFORM_LABELS = {
  [SOCIAL_PLATFORMS.LINKEDIN]: 'LinkedIn',
  [SOCIAL_PLATFORMS.TWITTER]: 'Twitter',
  [SOCIAL_PLATFORMS.INSTAGRAM]: 'Instagram',
  [SOCIAL_PLATFORMS.FACEBOOK]: 'Facebook',
  [SOCIAL_PLATFORMS.GITHUB]: 'GitHub',
  [SOCIAL_PLATFORMS.BEHANCE]: 'Behance',
  [SOCIAL_PLATFORMS.DRIBBBLE]: 'Dribbble',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// Card Export Formats
export const EXPORT_FORMATS = {
  PNG: 'png',
  PDF: 'pdf',
  JPEG: 'jpeg',
};

// Dashboard Sections
export const DASHBOARD_SECTIONS = {
  OVERVIEW: 'overview',
  MY_CARDS: 'my-cards',
  TEMPLATES: 'templates',
  PROFILE: 'profile',
  SETTINGS: 'settings',
};

// Admin Dashboard Sections
export const ADMIN_SECTIONS = {
  OVERVIEW: 'overview',
  ANALYTICS: 'analytics',
  USERS: 'users',
  CARDS: 'cards',
  TEMPLATES: 'templates',
  SYSTEM: 'system',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a valid image file.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  CARD_SAVED: 'Business card saved successfully!',
  CARD_DELETED: 'Business card deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  EXPORT_SUCCESS: 'Card exported successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  USER: 'user-data',
  THEME: 'theme',
  RECENT_CARDS: 'recent-cards',
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export default {
  API,
  ROUTES,
  CARD_CATEGORIES,
  CATEGORY_LABELS,
  COLOR_SCHEMES,
  FONT_OPTIONS,
  CARD_DIMENSIONS,
  FILE_UPLOAD,
  PAGINATION,
  TOAST_DURATION,
  VALIDATION_RULES,
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  USER_ROLES,
  EXPORT_FORMATS,
  DASHBOARD_SECTIONS,
  ADMIN_SECTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ANIMATION_DURATION,
}; 