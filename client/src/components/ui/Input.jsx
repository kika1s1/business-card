import React, { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label,
  error,
  helperText,
  required = false,
  type = 'text',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm';
  
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200/50 bg-red-50/30' 
    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200/50 hover:border-gray-300 focus:bg-white';
    
  const inputClasses = `${baseClasses} ${stateClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-2 tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
          {...props}
        />
        {/* Input focus indicator */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent pointer-events-none transition-all duration-200 focus-within:border-primary-300/30"></div>
      </div>
      {error && (
        <div className="mt-2 flex items-center space-x-1">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>{helperText}</span>
        </p>
      )}
    </div>
  );
}); 