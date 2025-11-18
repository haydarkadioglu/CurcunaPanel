'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import trTranslations from '@/data/translations/tr.json';
import enTranslations from '@/data/translations/en.json';

type Language = 'tr' | 'en';

type Translations = typeof trTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

// Export language type for use in components
export type { Language };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem('curcuna-language') as Language;
    if (savedLang === 'tr' || savedLang === 'en') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('curcuna-language', lang);
  };

  const translations = language === 'tr' ? trTranslations : enTranslations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

