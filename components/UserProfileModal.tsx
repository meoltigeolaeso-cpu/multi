import React from 'react';
import { User } from '../types';
import UserIcon from './icons/UserIcon';
import EditIcon from './icons/EditIcon';
import { useLocale } from '../contexts/LocaleContext';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  const { t } = useLocale();
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-dark flex items-center">
            <UserIcon className="w-7 h-7 mr-3 text-primary"/>
            {t('myProfile')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 text-lg">
            <div className="flex items-center">
                <span className="font-semibold w-20 text-gray-500">{t('name')}</span>
                <span className="text-gray-800">{user.name}</span>
            </div>
             <div className="flex items-center">
                <span className="font-semibold w-20 text-gray-500">{t('email')}</span>
                <span className="text-gray-800">{user.email}</span>
            </div>
        </div>

        <div className="mt-8 border-t pt-6 flex justify-between items-center">
          <button className="flex items-center text-sm text-gray-600 hover:text-primary">
            <EditIcon className="w-5 h-5 mr-2" />
            {t('editProfile')}
          </button>
          <button onClick={onClose} className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold">
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;