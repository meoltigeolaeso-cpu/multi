import React, { useState } from 'react';
import { Reservation } from '../types';
import api from '../api';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import { useLocale } from '../contexts/LocaleContext';

interface DisputeModalProps {
  reservation: Reservation;
  onClose: () => void;
  onSubmitSuccess: (updatedReservation: Reservation) => void;
}

const DisputeModal: React.FC<DisputeModalProps> = ({ reservation, onClose, onSubmitSuccess }) => {
  const { t } = useLocale();
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError(t('errorDisputeReason'));
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const updatedReservation = await api.submitDispute(reservation.id);
      // In a real app, 'reason' would also be submitted.
      console.log(`Dispute submitted for reservation ${reservation.id} with reason: ${reason}`);
      onSubmitSuccess(updatedReservation);
    } catch (err: any) {
      setError(err.message || t('errorDisputeSubmit'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex items-center text-red-600 mb-4">
            <AlertTriangleIcon className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">{t('disputeTitle')}</h2>
          </div>
          <p className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: t('disputeSubtitle', { name: `<strong>${reservation.name}</strong>` }) }} />

          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}
          
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('placeholderDisputeReason')}
            className="w-full p-3 border rounded-lg h-32"
            required
          />

          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400">
              {isLoading ? t('submitting') : t('submitRequest')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisputeModal;