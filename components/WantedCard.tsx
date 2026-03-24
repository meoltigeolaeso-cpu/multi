import React from 'react';
import { Wanted, User } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import LocationIcon from './icons/LocationIcon';
import WonIcon from './icons/WonIcon';
import TagIcon from './icons/TagIcon';
import ChatIcon from './icons/ChatIcon';
import CopyIcon from './icons/CopyIcon';
import { useLocale } from '../contexts/LocaleContext';

interface WantedCardProps {
  wanted: Wanted;
  onContact: (wanted: Wanted) => void;
  currentUser: User | null;
  onDuplicate: (wanted: Wanted) => void;
}

const WantedCard: React.FC<WantedCardProps> = ({ wanted, onContact, currentUser, onDuplicate }) => {
  const { t } = useLocale();
  const isMyWanted = currentUser?.name === wanted.author;

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(wanted);
  };

  return (
    <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 border-2 border-secondary-light flex flex-col"
    >
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                    <TagIcon className="w-4 h-4 mr-1"/>
                    <span>{wanted.category === 'accommodation' ? t('wantedTypeAccommodation') : t('wantedTypeGolf')}</span>
                </div>
                <div className="flex items-center text-lg font-bold text-gray-800">
                    <LocationIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <h3>{wanted.location}</h3>
                </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">{t('author')}</span>
              <p className="font-semibold">{wanted.author}</p>
              {isMyWanted && (
                  <button onClick={handleDuplicateClick} title={t('copyWanted')} className="mt-1 p-1.5 text-primary hover:bg-primary-light/10 rounded-full">
                      <CopyIcon className="w-5 h-5"/>
                  </button>
              )}
            </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600 my-3">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{wanted.checkIn} ~ {wanted.checkOut}</span>
          </div>
          <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{wanted.details}</p>
        </div>
        
        <div className="mt-auto pt-3 border-t">
          <div className="flex justify-between items-center">
             <span className="text-sm text-gray-500">{t('desiredPrice')}</span>
             <p className="text-xl font-bold text-secondary flex items-center">
                <WonIcon className="w-5 h-5 mr-1" />
                {wanted.desiredPrice.toLocaleString()}{t('currencyWon')}
              </p>
          </div>
           {currentUser && !isMyWanted && (
            <button 
                onClick={() => onContact(wanted)}
                className="w-full mt-3 px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark transition-colors flex items-center justify-center"
            >
                <ChatIcon className="w-5 h-5 mr-2" />
                {t('contact')}
            </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default WantedCard;