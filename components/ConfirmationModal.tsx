// FIX: Created file content for the ConfirmationModal component.
import React from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import InfoIcon from './icons/InfoIcon';
import { useLocale } from '../contexts/LocaleContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = 'info',
}) => {
  const { t } = useLocale();
  if (!isOpen) return null;

  const typeStyles = {
    success: {
      Icon: CheckCircleIcon,
      color: 'text-green-500',
      buttonClass: 'bg-green-500 hover:bg-green-600',
    },
    warning: {
      Icon: AlertTriangleIcon,
      color: 'text-red-500',
      buttonClass: 'bg-red-500 hover:bg-red-600',
    },
    info: {
      Icon: InfoIcon,
      color: 'text-blue-500',
      buttonClass: 'bg-primary hover:bg-primary-dark',
    },
  };
  
  const { Icon, color, buttonClass } = typeStyles[type];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up p-8 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <Icon className={`w-16 h-16 ${color}`} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="flex justify-center space-x-4">
          <button onClick={onClose} className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
            {cancelText || t('cancel')}
          </button>
          <button onClick={onConfirm} className={`px-8 py-2.5 text-white rounded-lg transition-colors font-semibold ${buttonClass}`}>
            {confirmText || t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;