import React from 'react';
import { Listing, User } from '../types';
import HeartIcon from './icons/HeartIcon';
import WonIcon from './icons/WonIcon';
import { useLocale } from '../contexts/LocaleContext';

interface MyWishlistModalProps {
  user: User;
  wishlist: Listing[];
  onClose: () => void;
  onToggleWishlist: (listingId: string) => void;
  onViewDetail: (listing: Listing) => void;
}

const MyWishlistModal: React.FC<MyWishlistModalProps> = ({ user, wishlist, onClose, onToggleWishlist, onViewDetail }) => {
  const { t } = useLocale();
  
  const handleViewDetail = (listing: Listing) => {
    onClose(); // Close wishlist modal first
    setTimeout(() => onViewDetail(listing), 200); // Open detail modal after a short delay
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-in-up max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary-dark flex items-center">
            <HeartIcon className="w-7 h-7 mr-3 text-red-500" isFilled={true} />
            {t('myWishlist')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 bg-gray-50 flex-grow">
          {wishlist.length > 0 ? (
            <div className="space-y-4">
              {wishlist.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img src={item.images[0]} alt={item.name} className="w-full sm:w-32 h-32 object-cover rounded-md"/>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.location}</p>
                    <p className="text-lg font-bold text-primary flex items-center mt-2">
                      <WonIcon className="w-5 h-5 mr-1" />
                      {item.salePrice.toLocaleString()}{t('currencyWon')}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex sm:flex-col items-center gap-2 self-end sm:self-center">
                    <button onClick={() => onToggleWishlist(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                        <HeartIcon className="w-6 h-6" isFilled={true}/>
                    </button>
                    <button onClick={() => handleViewDetail(item)} className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                        {t('viewDetails')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">{t('noWishlistItems')}</p>
          )}
        </div>
        
        <div className="p-4 bg-white border-t flex justify-end">
           <button onClick={onClose} className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyWishlistModal;