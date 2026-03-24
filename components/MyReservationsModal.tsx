import React from 'react';
import { Reservation, User } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import EditIcon from './icons/EditIcon';
import BadgeCheckIcon from './icons/BadgeCheckIcon';
import { useLocale } from '../contexts/LocaleContext';

interface MyReservationsModalProps {
  user: User;
  reservations: Reservation[];
  onClose: () => void;
  onWriteReview: (reservation: Reservation) => void;
  onDispute: (reservation: Reservation) => void;
}

const MyReservationsModal: React.FC<MyReservationsModalProps> = ({ user, reservations, onClose, onWriteReview, onDispute }) => {
  const { t } = useLocale();
  const userReservations = reservations.filter(r => r.buyer === user.name || r.seller === user.name);

  const statusInfo: { [key in Reservation['status']]: { text: string; icon: React.FC<any>; border: string; textAndIconColor: string; } } = {
    confirmed: {
      text: t('statusConfirmed'),
      icon: CheckCircleIcon,
      border: 'border-blue-500',
      textAndIconColor: 'text-blue-600',
    },
    completed: {
      text: t('statusCompleted'),
      icon: BadgeCheckIcon,
      border: 'border-green-500',
      textAndIconColor: 'text-green-600',
    },
    cancelled: {
      text: t('statusCancelled'),
      icon: XCircleIcon,
      border: 'border-gray-400',
      textAndIconColor: 'text-gray-600',
    },
    disputed: {
      text: t('statusDisputed'),
      icon: AlertTriangleIcon,
      border: 'border-red-500',
      textAndIconColor: 'text-red-600',
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-in-up max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary-dark flex items-center">
            <CalendarIcon className="w-7 h-7 mr-3 text-primary" />
            {t('myReservations')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 bg-gray-50 flex-grow">
          {userReservations.length > 0 ? (
            <div className="space-y-4">
              {userReservations.map(res => {
                  const currentStatusInfo = statusInfo[res.status];
                  const StatusIcon = currentStatusInfo.icon;
                  return (
                    <div key={res.id} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${currentStatusInfo.border}`}>
                      <div className={`flex items-center font-bold text-lg mb-3 ${currentStatusInfo.textAndIconColor}`}>
                          <StatusIcon className="w-6 h-6 mr-2" />
                          <h4>{currentStatusInfo.text}</h4>
                      </div>

                      <h3 className="font-bold text-xl text-gray-800 mb-3">{res.name}</h3>
                      
                      <div className="text-sm text-gray-600 space-y-1 mb-4">
                        <p><strong>{t('seller')}:</strong> {res.seller}</p>
                        <p><strong>{t('buyer')}:</strong> {res.buyer}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                        {res.buyer === user.name && res.status === 'completed' && !res.reviewSubmitted && (
                          <button onClick={() => onWriteReview(res)} className="px-4 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center">
                              <EditIcon className="w-4 h-4 mr-1.5"/>
                              {t('writeReview')}
                          </button>
                        )}
                        {res.buyer === user.name && res.status === 'completed' && res.reviewSubmitted && (
                           <span className="px-4 py-1.5 text-sm bg-gray-200 text-gray-600 rounded-md flex items-center justify-center">
                              <CheckCircleIcon className="w-4 h-4 mr-1.5"/>
                              {t('reviewSubmitted')}
                           </span>
                        )}
                        {res.status !== 'cancelled' && res.status !== 'disputed' && (
                            <button onClick={() => onDispute(res)} className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center">
                                <AlertTriangleIcon className="w-4 h-4 mr-1.5"/>
                                {t('reportIssue')}
                            </button>
                        )}
                      </div>
                    </div>
                  );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">{t('noReservations')}</p>
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

export default MyReservationsModal;