'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Button from './ui/Button';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 items-center">
      <Button
        onClick={() => setLanguage('tr')}
        variant={language === 'tr' ? 'primary' : 'secondary'}
        className="px-4 py-2 text-sm"
      >
        TR
      </Button>
      <Button
        onClick={() => setLanguage('en')}
        variant={language === 'en' ? 'primary' : 'secondary'}
        className="px-4 py-2 text-sm"
      >
        EN
      </Button>
    </div>
  );
}

