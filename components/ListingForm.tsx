// FIX: Created file content for the ListingForm component.
import React, { useState } from 'react';
import { Listing, User, AccommodationListingDetails, GolfListingDetails } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface ListingFormProps {
  user: User;
  onSave: (listingData: Partial<Listing>) => void;
  onClose: () => void;
  existingListing?: Listing;
}

const ListingForm: React.FC<ListingFormProps> = ({ user, onSave, onClose, existingListing }) => {
  const { t } = useLocale();
  const isEditMode = !!existingListing;

  const getInitialState = () => {
    if (isEditMode && existingListing) {
      const isAccommodation = existingListing.category === 'accommodation';
      const accommodationDetails = isAccommodation ? (existingListing.details as AccommodationListingDetails) : { type: t('hotel'), guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, amenities: [] };
      const golfDetails = !isAccommodation ? (existingListing.details as GolfListingDetails) : { courseName: '', teeTime: '', players: 4, includes: [] };

      return {
        name: existingListing.name,
        location: existingListing.location,
        originalPrice: String(existingListing.originalPrice),
        salePrice: String(existingListing.salePrice),
        description: existingListing.description,
        checkIn: existingListing.checkIn,
        checkOut: existingListing.checkOut,
        category: existingListing.category,
        
        acc_type: accommodationDetails.type,
        acc_guests: String(accommodationDetails.guests),
        
        golf_courseName: golfDetails.courseName,
        golf_teeTime: golfDetails.teeTime,
        golf_players: String(golfDetails.players),
      };
    }
    return {
      name: '', location: '', originalPrice: '', salePrice: '', description: '',
      checkIn: '', checkOut: '', category: 'accommodation' as 'accommodation' | 'golf',
      acc_type: t('hotel'), acc_guests: '2',
      golf_courseName: '', golf_teeTime: '', golf_players: '4',
    };
  };
  
  const [formData, setFormData] = useState(getInitialState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const listingData: Partial<Listing> = {
            name: formData.name,
            location: formData.location,
            originalPrice: parseInt(formData.originalPrice),
            salePrice: parseInt(formData.salePrice),
            description: formData.description,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            category: formData.category,
            details: formData.category === 'accommodation' ? {
                type: formData.acc_type,
                guests: parseInt(formData.acc_guests),
                bedrooms: 1, beds: 1, bathrooms: 1, amenities: ['wifi', 'tv']
            } : {
                courseName: formData.golf_courseName,
                teeTime: formData.golf_teeTime,
                players: parseInt(formData.golf_players),
                includes: ['green_fee']
            }
        };
        onSave(listingData);
    } catch (err: any) {
      setError(err.message || t('errorFailedToSave'));
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-8 max-h-[90vh] overflow-y-auto">
          <h2 className="text-3xl font-bold text-center text-primary-dark mb-6">{isEditMode ? t('copyListingTitle') : t('createListingTitle')}</h2>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}
          
          <div className="space-y-4">
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50">
                <option value="accommodation">{t('categoryAccommodation')}</option>
                <option value="golf">{t('categoryGolf')}</option>
            </select>

            <input name="name" value={formData.name} onChange={handleChange} placeholder={t('placeholderItemName')} required className="w-full p-3 border rounded-lg" />
            <input name="location" value={formData.location} onChange={handleChange} placeholder={t('placeholderLocation')} required className="w-full p-3 border rounded-lg" />
            
            <div className="grid grid-cols-2 gap-4">
                <input name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} placeholder={t('placeholderOriginalPrice')} required className="w-full p-3 border rounded-lg" />
                <input name="salePrice" type="number" value={formData.salePrice} onChange={handleChange} placeholder={t('placeholderSalePrice')} required className="w-full p-3 border rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input name="checkIn" type="date" value={formData.checkIn} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                <input name="checkOut" type="date" value={formData.checkOut} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            </div>

            <textarea name="description" value={formData.description} onChange={handleChange} placeholder={t('placeholderDescription')} required className="w-full p-3 border rounded-lg h-24" />

            {formData.category === 'accommodation' ? (
                <div className="animate-fade-in-up-fast">
                    <h3 className="font-semibold text-lg pt-4 border-t mt-4">{t('accommodationInfo')}</h3>
                    <input name="acc_type" value={formData.acc_type} onChange={handleChange} placeholder={t('placeholderAccType')} required className="w-full p-3 border rounded-lg mt-4" />
                    <input name="acc_guests" type="number" value={formData.acc_guests} onChange={handleChange} placeholder={t('placeholderAccGuests')} required className="w-full p-3 border rounded-lg mt-4" />
                </div>
            ) : (
                <div className="animate-fade-in-up-fast">
                    <h3 className="font-semibold text-lg pt-4 border-t mt-4">{t('golfInfo')}</h3>
                    <input name="golf_courseName" value={formData.golf_courseName} onChange={handleChange} placeholder={t('placeholderGolfCourse')} required className="w-full p-3 border rounded-lg mt-4" />
                    <input name="golf_teeTime" value={formData.golf_teeTime} onChange={handleChange} placeholder={t('placeholderGolfTeeTime')} required className="w-full p-3 border rounded-lg mt-4" />
                    <input name="golf_players" type="number" value={formData.golf_players} onChange={handleChange} placeholder={t('placeholderGolfPlayers')} required className="w-full p-3 border rounded-lg mt-4" />
                </div>
            )}
            
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">{t('cancel')}</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                    {isLoading ? t('saving') : t('save')}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;