'use client';

import Card from '@/components/ui/Card';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const modules = [
    {
      title: t.modules.calculator.title,
      description: t.modules.calculator.description,
      href: '/modules/calculator',
      icon: '🔢',
    },
    {
      title: t.modules.weather.title,
      description: t.modules.weather.description,
      href: '/modules/weather',
      icon: '🌦️',
    },
    {
      title: t.modules.notepad.title,
      description: t.modules.notepad.description,
      href: '/modules/notepad',
      icon: '📝',
    },
    {
      title: t.modules.escapeButton.title,
      description: t.modules.escapeButton.description,
      href: '/modules/escape-button',
      icon: '🏃',
    },
    {
      title: t.modules.fortune.title,
      description: t.modules.fortune.description,
      href: '/modules/fortune',
      icon: '🔮',
    },
    {
      title: t.modules.excuses.title,
      description: t.modules.excuses.description,
      href: '/modules/excuses',
      icon: '🤥',
    },
    {
      title: t.modules.chaos.title,
      description: t.modules.chaos.description,
      href: '/modules/chaos',
      icon: '💥',
    },
    {
      title: t.modules.geminiTest?.title || 'Gemini Test',
      description: t.modules.geminiTest?.description || 'Test Gemini API',
      href: '/modules/gemini-test',
      icon: '🤖',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Right Buttons */}
        <div className="flex justify-end items-center gap-4 mb-4">
          <a
            href="https://buymeacoffee.com/haydarkadioglu"
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-4 py-2 rounded-lg border-2 border-yellow-400 bg-yellow-400/10
              text-yellow-400 font-bold text-sm
              hover:bg-yellow-400/20 hover:border-yellow-300
              transition-all duration-300
              hover:shadow-[0_0_20px_rgba(255,193,7,0.5)]
              active:scale-95
              flex items-center gap-2
            "
          >
            <span>☕</span>
            <span>Buy Me a Coffee</span>
          </a>
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <header className="text-center mb-12 mt-8">
          <Link href="/">
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <GlitchText intensity="high">{t.home.title}</GlitchText>
            </h1>
          </Link>
          <p className="text-neon-cyan text-lg md:text-xl max-w-2xl mx-auto">
            {t.home.subtitle}
          </p>
          <p className="text-gray-400 text-sm mt-4 max-w-2xl mx-auto">
            {t.home.description}
          </p>
        </header>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card
              key={module.href}
              title={module.title}
              description={module.description}
              href={module.href}
              icon={module.icon}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>{t.home.warning}</p>
          <p className="mt-2">
            <span className="text-neon-pink">{t.common.chaosMode}:</span>{' '}
            <span className="text-gray-400">{t.common.hiddenKeyCombo}</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

