import React, { useState } from 'react';
import { User } from '../types';
import BellIcon from './icons/BellIcon';
import ActiveBellIcon from './icons/ActiveBellIcon';
import UserIcon from './icons/UserIcon';
import RefreshIcon from './icons/RefreshIcon';
import { useLocale } from '../contexts/LocaleContext';
import GlobeIcon from './icons/GlobeIcon';

interface HeaderProps {
  isLoggedIn: boolean;
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onSignUpClick: () => void;
  onMyReservationsClick: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onResetData: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  user,
  onLoginClick,
  onLogoutClick,
  onSignUpClick,
  onMyReservationsClick,
  onWishlistClick,
  onProfileClick,
  onNotificationsClick,
  onResetData,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, setLocale, locale } = useLocale();
  const hasNotifications = true; // Demo purpose

  const changeLanguage = (lang: 'ko' | 'en') => {
    setLocale(lang);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          <a href="/">Re-Checkin</a>
        </h1>
        <nav className="flex items-center space-x-2 sm:space-x-4">
           <div className="relative">
             <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} title="Change Language" className="text-gray-500 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100">
               <GlobeIcon className="w-6 h-6"/>
             </button>
             {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-30 animate-fade-in-up">
                  <button onClick={() => changeLanguage('ko')} className={`block w-full text-left px-4 py-2 text-sm ${locale === 'ko' ? 'font-bold text-primary' : 'text-gray-700'} hover:bg-gray-100`}>한국어</button>
                  <button onClick={() => changeLanguage('en')} className={`block w-full text-left px-4 py-2 text-sm ${locale === 'en' ? 'font-bold text-primary' : 'text-gray-700'} hover:bg-gray-100`}>English</button>
                </div>
              )}
           </div>
           <button onClick={onResetData} title={t('resetDemoData')} className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
            <RefreshIcon className="w-6 h-6"/>
          </button>
          {isLoggedIn && user ? (
            <>
              <button onClick={onNotificationsClick} className="text-gray-600 hover:text-primary transition-colors">
                {hasNotifications ? <ActiveBellIcon className="w-7 h-7 text-primary"/> : <BellIcon className="w-7 h-7" />}
              </button>
              <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                   <UserIcon className="w-7 h-7 bg-gray-200 rounded-full p-1" />
                   <span className="font-semibold hidden md:inline">{user.name}{t('userSuffix')}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 animate-fade-in-up">
                    <button onClick={() => { onProfileClick(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('profile')}</button>
                    <button onClick={() => { onMyReservationsClick(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('myReservations')}</button>
                    <button onClick={() => { onWishlistClick(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('wishlist')}</button>
                    <div className="border-t my-1"></div>
                    <button onClick={() => { onLogoutClick(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('logout')}</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-x-2">
              <button onClick={onLoginClick} className="px-4 py-2 text-primary font-semibold rounded-full hover:bg-primary-light/10 transition-colors">{t('login')}</button>
              <button onClick={onSignUpClick} className="px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors">{t('signUp')}</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;