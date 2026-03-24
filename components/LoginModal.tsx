import React, { useState } from 'react';
import { User } from '../types';
import api from '../api';
import UserIcon from './icons/UserIcon';
import KeyIcon from './icons/KeyIcon';
import { useLocale } from '../contexts/LocaleContext';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onSwitchToSignUp: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess, onSwitchToSignUp }) => {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await api.login({ email, password });
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || t('errorLoginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-primary-dark mb-6">{t('login')}</h2>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input
                type="email"
                placeholder={t('placeholderEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-light focus:border-transparent transition"
              />
            </div>
            <div className="relative">
               <KeyIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input
                type="password"
                placeholder={t('placeholderPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-light focus:border-transparent transition"
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-primary text-white p-4 text-lg font-bold rounded-full hover:bg-primary-dark transition-colors disabled:bg-gray-400">
              {isLoading ? t('loggingIn') : t('login')}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('noAccount')}{' '}
              <button onClick={onSwitchToSignUp} className="font-semibold text-primary hover:underline">
                {t('signUp')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;