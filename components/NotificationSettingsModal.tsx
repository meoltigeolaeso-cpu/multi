import React, { useState } from 'react';
import BellIcon from './icons/BellIcon';
import { useLocale } from '../contexts/LocaleContext';

interface NotificationSettingsModalProps {
  onClose: () => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-700">{label}</span>
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
        enabled ? 'bg-primary' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);


const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ onClose }) => {
  const { t } = useLocale();
  const [settings, setSettings] = useState({
    chatMessages: true,
    reservationUpdates: true,
    newMatchings: false,
    promotions: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleSave = () => {
    console.log("Saving settings:", settings);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-dark flex items-center">
            <BellIcon className="w-7 h-7 mr-3 text-primary"/>
            {t('notificationSettings')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <ToggleSwitch
            label={t('notificationChat')}
            enabled={settings.chatMessages}
            onToggle={() => toggleSetting('chatMessages')}
          />
          <ToggleSwitch
            label={t('notificationReservation')}
            enabled={settings.reservationUpdates}
            onToggle={() => toggleSetting('reservationUpdates')}
          />
          <ToggleSwitch
            label={t('notificationMatching')}
            enabled={settings.newMatchings}
            onToggle={() => toggleSetting('newMatchings')}
          />
          <ToggleSwitch
            label={t('notificationPromotions')}
            enabled={settings.promotions}
            onToggle={() => toggleSetting('promotions')}
          />
        </div>

        <div className="pt-8 flex justify-end">
          <button onClick={handleSave} className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold">
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsModal;