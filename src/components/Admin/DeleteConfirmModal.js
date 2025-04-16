import { FaExclamationTriangle, FaSpinner, FaTimes } from 'react-icons/fa';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, isLoading, title, message }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            {title || 'Silme Onayı'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="py-3">
          <p className="text-gray-700 dark:text-gray-300">
            {message || 'Bu öğeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            disabled={isLoading}
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Siliniyor...
              </>
            ) : (
              'Sil'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 