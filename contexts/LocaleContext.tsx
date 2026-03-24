import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

type Locale = 'ko' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const getInitialLocale = (): Locale => {
  const savedLocale = localStorage.getItem('recheckin_locale');
  if (savedLocale === 'ko' || savedLocale === 'en') {
    return savedLocale;
  }
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'ko') {
    return 'ko';
  }
  return 'ko'; // Default to Korean
};


export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale());
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${locale}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Could not load translations for locale:", locale, error);
        // Fallback to Korean if the selected locale fails
        if (locale !== 'ko') {
            const response = await fetch(`/locales/ko.json`);
            const data = await response.json();
            setTranslations(data);
        }
      }
    };
    loadTranslations();
  }, [locale]);
  
  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('recheckin_locale', newLocale);
    setLocaleState(newLocale);
  };

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = translations[key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([placeholder, value]) => {
            translation = translation.replace(`{{${placeholder}}}`, String(value));
        });
    }
    return translation;
  }, [translations]);

  const value = { locale, setLocale, t };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};