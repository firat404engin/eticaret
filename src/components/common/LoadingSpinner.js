import { FaSpinner } from 'react-icons/fa';

export default function LoadingSpinner({ size = 'md', color = 'primary', className = '' }) {
  // Size sınıfları
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
    xl: 'h-16 w-16'
  };
  
  // Renk sınıfları
  const colorClasses = {
    primary: 'text-indigo-500',
    secondary: 'text-gray-500',
    success: 'text-green-500',
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
    light: 'text-white',
    dark: 'text-gray-800'
  };
  
  return (
    <FaSpinner
      className={`animate-spin ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary} ${className}`}
      aria-hidden="true"
    />
  );
} 