import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters');

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Card content schemas
export const cardContentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  title: z.string().max(100, 'Title too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  email: emailSchema.optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone number too long').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  address: z.string().max(200, 'Address too long').optional(),
  socialLinks: z.object({
    linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    twitter: z.string().url('Please enter a valid Twitter URL').optional().or(z.literal('')),
    instagram: z.string().url('Please enter a valid Instagram URL').optional().or(z.literal('')),
    facebook: z.string().url('Please enter a valid Facebook URL').optional().or(z.literal(''))
  }).optional()
});

export const cardDesignSchema = z.object({
  templateId: z.string().min(1, 'Template is required'),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    text: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
  }),
  fonts: z.object({
    primary: z.string().min(1, 'Primary font is required'),
    secondary: z.string().min(1, 'Secondary font is required')
  }),
  fontSize: z.object({
    name: z.number().min(12).max(72),
    title: z.number().min(8).max(48),
    contact: z.number().min(6).max(24)
  })
});

export const cardSchema = z.object({
  name: z.string().min(1, 'Card name is required').max(100, 'Name too long'),
  content: cardContentSchema,
  design: cardDesignSchema,
  category: z.string().min(1, 'Category is required')
});

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  currentPassword: z.string().min(1, 'Current password is required').optional(),
  newPassword: passwordSchema.optional(),
  confirmNewPassword: z.string().optional()
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
    return false;
  }
  return true;
}, {
  message: "Password confirmation doesn't match",
  path: ["confirmNewPassword"],
});

// Validation helper functions
export const validateForm = (schema, data) => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, data: null, errors };
    }
    return { success: false, data: null, errors: { general: 'Validation failed' } };
  }
};

export const validateField = (schema, fieldName, value) => {
  try {
    const fieldSchema = schema.shape[fieldName];
    if (!fieldSchema) return { success: true, error: null };
    
    fieldSchema.parse(value);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || 'Invalid value' };
    }
    return { success: false, error: 'Validation failed' };
  }
};

// File validation
export const fileValidation = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    validate: (file) => {
      if (!file) return { success: false, error: 'File is required' };
      
      if (file.size > fileValidation.image.maxSize) {
        return { success: false, error: 'File size must be less than 5MB' };
      }
      
      if (!fileValidation.image.allowedTypes.includes(file.type)) {
        return { success: false, error: 'File must be an image (JPEG, PNG, GIF, or WebP)' };
      }
      
      return { success: true, error: null };
    }
  }
};

export default {
  loginSchema,
  registerSchema,
  cardSchema,
  cardContentSchema,
  cardDesignSchema,
  profileUpdateSchema,
  validateForm,
  validateField,
  fileValidation
}; 