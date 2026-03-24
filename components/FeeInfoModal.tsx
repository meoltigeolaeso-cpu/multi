import React from 'react';
import PercentageIcon from './icons/PercentageIcon';
import { useLocale } from '../contexts/LocaleContext';

interface FeeInfoModalProps {
  onClose: () => void;
}

const FeeInfoModal: React.FC<FeeInfoModalProps> = ({ onClose }) => {
  const { t } = useLocale();
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-dark flex items-center">
            <PercentageIcon className="w-7 h-7 mr-3 text-primary"/>
            {t('feeInfoTitle')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-100 rounded-full p-1.5 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-primary-dark mb-2">{t('feeInfoSellerFee')}</h3>
            <p dangerouslySetInnerHTML={{ __html: t('feeInfoSellerFeeDesc') }}/>
            <p className="text-sm text-gray-500 mt-1">{t('feeInfoSellerFeeExample')}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-primary-dark mb-2">{t('feeInfoBuyerFee')}</h3>
            <p>{t('feeInfoBuyerFeeDesc')}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-dark mb-2">{t('feeInfoSettlement')}</h3>
            <p>{t('feeInfoSettlementDesc')}</p>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button onClick={onClose} className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold">
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeInfoModal;