// FIX: Created file content for the ListingCard component.
import React from 'react';
import { Listing, User } from '../types';
import LocationIcon from './icons/LocationIcon';
import CalendarIcon from './icons/CalendarIcon';
import WonIcon from './icons/WonIcon';
import StarIcon from './icons/StarIcon';
import HeartIcon from './icons/HeartIcon';
import CopyIcon from './icons/CopyIcon';
import { useLocale } from '../contexts/LocaleContext';

interface ListingCardProps {
  listing: Listing;
  onViewDetail: (listing: Listing) => void;
  onToggleWishlist: (listingId: string) => void;
  currentUser: User | null;
  onDuplicate: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onViewDetail, onToggleWishlist, currentUser, onDuplicate }) => {
  const { t } = useLocale();
  const discountPercentage = Math.round(((listing.originalPrice - listing.salePrice) / listing.originalPrice) * 100);
  const isWishlisted = currentUser?.wishlist?.includes(listing.id) ?? false;
  const isNotForSale = listing.status !== 'selling';
  const isMyListing = currentUser?.id === listing.sellerId;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(listing.id);
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(listing);
  };

  const statusInfo = {
    'in-progress': { text: t('statusInProgress'), bg: 'bg-yellow-500' },
    'completed': { text: t('statusCompleted'), bg: 'bg-gray-500' },
    'selling': { text: '', bg: ''}
  };
  const currentStatus = statusInfo[listing.status];

  return (
    <div 
      className={`bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col ${isNotForSale ? 'opacity-60 saturate-50' : ''}`}
      onClick={() => onViewDetail(listing)}
    >
      <div className="relative">
        <img src={listing.images[0]} alt={listing.name} className="w-full h-48 object-cover" />
        {isMyListing ? (
          <button 
            onClick={handleDuplicateClick} 
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 text-primary hover:text-primary-dark transition-colors"
            title={t('copyListing')}
          >
            <CopyIcon className="w-6 h-6" />
          </button>
        ) : (
          <button 
            onClick={handleWishlistClick} 
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 text-red-500 hover:text-red-600 transition-colors"
            aria-label={t('toggleWishlist')}
          >
            <HeartIcon className="w-6 h-6" isFilled={isWishlisted} />
          </button>
        )}
        {discountPercentage > 0 && listing.status === 'selling' && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {discountPercentage}% {t('discount')}
          </div>
        )}
        {isNotForSale && (
           <div className={`absolute top-3 left-3 ${currentStatus.bg} text-white text-sm font-bold px-3 py-1 rounded-full`}>
            {currentStatus.text}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-gray-500 mb-2">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{listing.rating.toFixed(1)}</span>
            <span className="ml-1">({listing.reviewCount})</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 truncate">{listing.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <LocationIcon className="w-4 h-4 mr-1.5" />
          <span>{listing.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <CalendarIcon className="w-4 h-4 mr-1.5" />
          <span>{listing.checkIn} ~ {listing.checkOut}</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="text-right">
            <p className="text-sm text-gray-500 line-through">{listing.originalPrice.toLocaleString()}{t('currencyWon')}</p>
            <p className="text-xl font-bold text-primary flex items-center justify-end">
                <WonIcon className="w-5 h-5 mr-1" />
                {listing.salePrice.toLocaleString()}{t('currencyWon')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;