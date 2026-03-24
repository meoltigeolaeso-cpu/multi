import React, { useState } from 'react';
import { User } from '../types';
import api from '../api';
import UserIcon from './icons/UserIcon';
import KeyIcon from './icons/KeyIcon';
import { useLocale } from '../contexts/LocaleContext';

interface SignUpModalProps {
  onClose: () => void;
  onSignUpSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose, onSignUpSuccess, onSwitchToLogin }) => {
  const { t } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('errorPasswordMismatch'));
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const newUser = { name, email, password };
      const user = await api.register(newUser);
      onSignUpSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || t('errorSignUpFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-primary-dark mb-6">{t('signUp')}</h2>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="text" placeholder={t('placeholderName')} value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-light focus:border-transparent transition" />
            </div>
            <div className="relative">
              <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="email" placeholder={t('placeholderEmail')} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-light focus:border-transparent transition" />
            </div>
            <div className="relative">
              <KeyIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="password" placeholder={t('placeholderPassword')} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-light focus:border-transparent transition" />
            </div>
            <div className="relative">
              <KeyIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="password" placeholder={t('placeholderConfirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-light focus:border-transparent transition" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-primary text-white p-4 text-lg font-bold rounded-full hover:bg-primary-dark transition-colors disabled:bg-gray-400 mt-4">
              {isLoading ? t('signingUp') : t('signUp')}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <button onClick={onSwitchToLogin} className="font-semibold text-primary hover:underline">
                {t('login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;