import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

export const Toast = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <AlertCircle className="h-5 w-5 text-blue-500" />
  };
  
  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };
  
  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`flex items-center p-4 rounded-lg border shadow-lg ${colors[type]} ${className}`}>
        {icons[type]}
        <p className="ml-3 text-sm font-medium text-gray-800">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = ({ notifications = [], onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}; 