

import React, { useState } from 'react';
import { Listing, User, AccommodationListingDetails, GolfListingDetails } from '../types';
import api from '../api';
import LocationIcon from './icons/LocationIcon';
import CalendarIcon from './icons/CalendarIcon';
import WonIcon from './icons/WonIcon';
import StarIcon from './icons/StarIcon';
import UserIcon from './icons/UserIcon';
import UsersIcon from './icons/UsersIcon';
import BedIcon from './icons/BedIcon';
import AmenityIcon from './icons/AmenityIcon';
import ShieldIcon from './icons/ShieldIcon';
import RulesIcon from './icons/RulesIcon';
import FlagstickIcon from './icons/FlagstickIcon';
import ChatIcon from './icons/ChatIcon';
import { useLocale } from '../contexts/LocaleContext';

interface ListingDetailModalProps {
  listing: Listing;
  user: User | null;
  onClose: () => void;
  onUpdateListing: (listing: Listing) => void;
  onContact: (listing: Listing) => void;
  onLoginRequest: () => void;
}

const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, user, onClose, onUpdateListing, onContact, onLoginRequest }) => {
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const isSeller = user?.id === listing.sellerId;

  const discountPercentage = Math.round(((listing.originalPrice - listing.salePrice) / listing.originalPrice) * 100);
  const isAccommodation = listing.category === 'accommodation';
  const details = listing.details as AccommodationListingDetails | GolfListingDetails;

  const handleApply = async () => {
    if (!user) {
      onLoginRequest();
      return;
    }
    if (listing.status === 'completed') {
        alert(t('errorNoLongerAvailableToApply'));
        return;
    }
    setIsLoading(true);
    try {
      const updatedListing = await api.applyForListing(listing.id, user.name);
      onUpdateListing(updatedListing);
    } catch (error) {
      console.error("Failed to apply", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (applicantName: string) => {
    setIsLoading(true);
    try {
      const updatedListing = await api.acceptApplicant(listing.id, applicantName);
      onUpdateListing(updatedListing);
    } catch (error) {
      console.error("Failed to accept applicant", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const updatedListing = await api.completeTransaction(listing.id);
      onUpdateListing(updatedListing);
    } catch (error) {
      console.error("Failed to complete transaction", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const updatedListing = await api.cancelTransaction(listing.id);
      onUpdateListing(updatedListing);
    } catch (error) {
      console.error("Failed to cancel transaction", error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderActionButtons = () => {
    // SELLER VIEW
    if (isSeller) {
      if (listing.status === 'selling' && listing.applicants.length > 0) {
        return (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold mb-2">{t('applicants')} ({listing.applicants.length})</h4>
            <ul className="space-y-2">
              {listing.applicants.map(name => (
                <li key={name} className="flex justify-between items-center">
                  <span>{name}</span>
                  <button onClick={() => handleAccept(name)} disabled={isLoading} className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400">{t('accept')}</button>
                </li>
              ))}
            </ul>
          </div>
        );
      }
      if (listing.status === 'in-progress') {
        return (
            <div className="mt-4 bg-yellow-100 p-4 rounded-lg text-center">
                <p className="font-semibold">{t('inProgressWithBuyer', { buyer: listing.currentBuyer || 'N/A' })}</p>
                <div className="flex gap-2 mt-2">
                    <button onClick={handleComplete} disabled={isLoading} className="flex-1 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:bg-gray-400">{t('completeTransaction')}</button>
                    <button onClick={handleCancel} disabled={isLoading} className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:bg-gray-400">{t('cancelTransaction')}</button>
                </div>
            </div>
        );
      }
      if (listing.status === 'completed') {
          return <p className="mt-4 text-center font-bold text-green-600 bg-green-100 p-3 rounded-lg">{t('statusCompleted')}</p>
      }
      return <p className="mt-4 text-center text-gray-500 bg-gray-100 p-3 rounded-lg">{t('yourListing')}</p>
    }
    
    // BUYER VIEW
    if (listing.status === 'completed') {
        return <p className="mt-4 text-center font-bold text-green-600 bg-green-100 p-3 rounded-lg">{t('statusCompleted')}</p>
    }

    if (!user) {
      return <button onClick={onLoginRequest} className="w-full mt-4 px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">{t('loginToApply')}</button>
    }

    const hasApplied = listing.applicants.includes(user.name);
    return (
        <>
        {listing.status === 'in-progress' && (
            <div className="my-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md" role="alert">
                <p className="font-bold">{t('statusInProgress')}</p>
                <p>{t('inProgressWaitlistInfo')}</p>
            </div>
        )}
        <div className="flex gap-2 mt-4">
            <button onClick={() => onContact(listing)} className="flex-1 px-4 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition-colors flex items-center justify-center gap-2">
                <ChatIcon className="w-5 h-5"/>{t('contactSeller')}
            </button>
            <button onClick={handleApply} disabled={isLoading || hasApplied} className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors">
                {isLoading ? t('applying') : (hasApplied ? t('applicationSubmitted') : t('apply'))}
            </button>
        </div>
        </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-in-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="relative">
            <img src={listing.images[0]} alt={listing.name} className="w-full h-64 object-cover rounded-t-2xl" />
            <button onClick={onClose} className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:text-black transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{listing.name}</h2>
                    <div className="flex items-center text-gray-600 mt-2">
                      <LocationIcon className="w-5 h-5 mr-2" />
                      <span>{listing.location}</span>
                    </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 flex-shrink-0 ml-4">
                    <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-bold text-gray-700">{listing.rating.toFixed(1)}</span>
                    <span className="ml-1">({listing.reviewCount} {t('reviews')})</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">{isAccommodation ? t('accommodationInfo') : t('golfInfo')}</h3>
                    {isAccommodation ? (
                      <div className="space-y-2 text-gray-700">
                        <p className="flex items-center"><AmenityIcon className="w-5 h-5 mr-2 text-primary"/>{(details as AccommodationListingDetails).type}</p>
                        <p className="flex items-center"><UsersIcon className="w-5 h-5 mr-2 text-primary"/>{t('maxGuests', { count: (details as AccommodationListingDetails).guests })}</p>
                        <p className="flex items-center"><BedIcon className="w-5 h-5 mr-2 text-primary"/>{t('bedsInfo', { beds: (details as AccommodationListingDetails).beds, bedrooms: (details as AccommodationListingDetails).bedrooms })}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 text-gray-700">
                        <p className="flex items-center"><FlagstickIcon className="w-5 h-5 mr-2 text-primary"/>{(details as GolfListingDetails).courseName}</p>
                        <p className="flex items-center"><UsersIcon className="w-5 h-5 mr-2 text-primary"/>{t('players', { count: (details as GolfListingDetails).players })}</p>
                        <p className="flex items-center"><CalendarIcon className="w-5 h-5 mr-2 text-primary"/>{t('teeTime')}: {(details as GolfListingDetails).teeTime}</p>
                      </div>
                    )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">{t('schedule')}</h3>
                    <div className="space-y-2 text-gray-700">
                        <p><span className="font-semibold">{t('checkIn')}:</span> {listing.checkIn}</p>
                        <p><span className="font-semibold">{t('checkOut')}:</span> {listing.checkOut}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-bold text-lg mb-2">{t('description')}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>
            
            <div className="mt-6 border-t pt-4">
                 <h3 className="font-bold text-lg mb-2">{t('sellerInfo')}</h3>
                 <div className="flex items-center">
                    <UserIcon className="w-10 h-10 p-2 bg-gray-200 rounded-full mr-3"/>
                    <div>
                        <p className="font-bold">{listing.seller}</p>
                        <p className="text-sm text-gray-500">{t('memberSince')}</p>
                    </div>
                 </div>
            </div>
        </div>

        <div className="p-6 border-t bg-white mt-auto sticky bottom-0">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 line-through">{listing.originalPrice.toLocaleString()}{t('currencyWon')}</p>
                    <p className="text-2xl font-bold text-primary flex items-center">
                        <WonIcon className="w-6 h-6 mr-1"/>{listing.salePrice.toLocaleString()}
                        <span className="text-lg font-normal ml-1">{t('currencyWon')}</span>
                    </p>
                </div>
                {discountPercentage > 0 && listing.status === 'selling' && (
                  <div className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-sm">
                    {discountPercentage}% {t('discount')}
                  </div>
                )}
            </div>
            {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailModal;