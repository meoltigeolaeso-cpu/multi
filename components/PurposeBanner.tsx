import React from 'react';
import InfoIcon from './icons/InfoIcon';
import { useLocale } from '../contexts/LocaleContext';

const PurposeBanner: React.FC = () => {
  const { t } = useLocale();
  return (
    <div className="bg-primary-light/10 border-l-4 border-primary text-primary-dark p-6 my-6 rounded-r-lg shadow-md">
      <div className="flex items-center">
        <InfoIcon className="w-8 h-8 mr-4 text-primary" />
        <div>
          <h2 className="text-xl font-bold mb-1">{t('bannerTitle')}</h2>
          <p className="text-gray-700">
            {t('bannerDescription')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurposeBanner;