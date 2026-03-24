import React, { useState, useEffect } from 'react';
import { Wanted, User } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface WantedFormProps {
  user: User;
  onSave: (wantedData: Partial<Wanted>) => void;
  onClose: () => void;
  existingWanted?: Wanted;
}

const WantedForm: React.FC<WantedFormProps> = ({ user, onSave, onClose, existingWanted }) => {
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    desiredPrice: '',
    details: '',
    category: 'accommodation' as 'accommodation' | 'golf',
    teeTime: '',
    players: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!existingWanted;

  useEffect(() => {
    if (existingWanted) {
      setFormData({
        location: existingWanted.location,
        checkIn: existingWanted.checkIn,
        checkOut: existingWanted.checkOut,
        desiredPrice: String(existingWanted.desiredPrice),
        details: existingWanted.details,
        category: existingWanted.category,
        teeTime: existingWanted.golfBookingDetails?.teeTime || '',
        players: String(existingWanted.golfBookingDetails?.players || ''),
      });
    }
  }, [existingWanted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const wantedData = {
        location: formData.location,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        desiredPrice: parseInt(formData.desiredPrice),
        details: formData.details,
        category: formData.category,
        golfBookingDetails: formData.category === 'golf' ? {
            teeTime: formData.teeTime,
            players: parseInt(formData.players),
        } : undefined,
      };
      onSave(wantedData);
    } catch (err: any) {
      setError(err.message || t('errorFailedToSave'));
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-8 max-h-[90vh] overflow-y-auto">
          <h2 className="text-3xl font-bold text-center text-primary-dark mb-6">{isEditMode ? t('copyWantedTitle') : t('createWantedTitle')}</h2>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}
          
          <div className="space-y-4">
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-lg">
                <option value="accommodation">{t('categoryAccommodation')}</option>
                <option value="golf">{t('categoryGolf')}</option>
            </select>
            <input name="location" value={formData.location} onChange={handleChange} placeholder={t('placeholderWantedLocation')} required className="w-full p-3 border rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
                <input name="checkIn" type="date" value={formData.checkIn} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                <input name="checkOut" type="date" value={formData.checkOut} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            </div>
            <input name="desiredPrice" type="number" value={formData.desiredPrice} onChange={handleChange} placeholder={t('placeholderDesiredPrice')} required className="w-full p-3 border rounded-lg" />
            <textarea name="details" value={formData.details} onChange={handleChange} placeholder={t('placeholderWantedDetails')} required className="w-full p-3 border rounded-lg h-24" />

            {formData.category === 'golf' && (
                <div className="animate-fade-in-up-fast">
                    <h3 className="font-semibold text-lg pt-4 border-t mt-4">{t('golfInfo')}</h3>
                    <input name="teeTime" value={formData.teeTime} onChange={handleChange} placeholder={t('placeholderWantedTeeTime')} required={formData.category === 'golf'} className="w-full p-3 border rounded-lg mt-4" />
                    <input name="players" type="number" value={formData.players} onChange={handleChange} placeholder={t('placeholderGolfPlayers')} required={formData.category === 'golf'} className="w-full p-3 border rounded-lg mt-4" />
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

export default WantedForm;