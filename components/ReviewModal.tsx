import React, { useState } from 'react';
import { Reservation, User, Review } from '../types';
import api from '../api';
import StarRating from './StarRating';
import { useLocale } from '../contexts/LocaleContext';

interface ReviewModalProps {
  reservation: Reservation;
  user: User;
  onClose: () => void;
  onSubmitSuccess: (data: { newReview: Review; updatedReservation: Reservation }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ reservation, user, onClose, onSubmitSuccess }) => {
  const { t } = useLocale();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError(t('errorSelectRating'));
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const result = await api.submitReview({
        reservationId: reservation.id,
        rating,
        comment,
      }, reservation, user);
      onSubmitSuccess(result);
    } catch (err: any) {
      setError(err.message || t('errorReviewSubmit'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-2xl font-bold text-primary-dark mb-2">{t('writeReviewTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('writeReviewSubtitle', { name: reservation.name })}</p>
          
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}

          <div className="mb-6 flex justify-center">
            <StarRating onRatingChange={handleRatingChange} />
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('placeholderReviewComment')}
            className="w-full p-3 border rounded-lg h-32"
            required
          />

          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400">
              {isLoading ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;