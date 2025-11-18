'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChaosPage() {
  const { t } = useLanguage();
  const [chaosMode, setChaosMode] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [hint, setHint] = useState('');

  const chaosSequence = ['c', 'u', 'r', 'c', 'u', 'n', 'a'];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      setKeySequence(prev => {
        const newSequence = [...prev, key].slice(-chaosSequence.length);
        
        // Check if sequence matches
        if (newSequence.join('') === chaosSequence.join('')) {
          setChaosMode(true);
          setKeySequence([]);
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (chaosMode) {
      const interval = setInterval(() => {
        // Random glitch effects
        document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
      }, 100);

      return () => {
        clearInterval(interval);
        document.body.style.filter = '';
      };
    }
  }, [chaosMode]);

  useEffect(() => {
    // Show hint after 10 seconds
    const timer = setTimeout(() => {
      setHint(t.modules.chaos.hintRevealed);
    }, 10000);

    return () => clearTimeout(timer);
  }, [t.modules.chaos.hintRevealed]);

  return (
    <div className={`min-h-screen p-4 md:p-8 ${chaosMode ? 'chaos-mode' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-neon-cyan hover:text-neon-pink">
            {t.common.backToHome}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className={`bg-black/50 border-2 border-neon-blue rounded-lg p-8 backdrop-blur-sm ${chaosMode ? 'animate-glitch-2' : ''}`}>
          <h1 className={`text-4xl font-bold mb-6 text-center ${chaosMode ? 'animate-glitch-2' : ''}`}>
            <GlitchText intensity={chaosMode ? 'high' : 'medium'}>
              {chaosMode ? t.modules.chaos.active : t.modules.chaos.title}
            </GlitchText>
          </h1>

          {!chaosMode ? (
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-float">{t.modules.chaos.locked}</div>
                <p className="text-gray-300 text-lg mb-4">
                  {t.modules.chaos.subtitle}
                </p>
                <p className="text-neon-pink text-sm">
                  {hint || t.modules.chaos.hint}
                </p>
              </div>

              <div className="mt-8 p-6 bg-black/70 border border-neon-purple rounded-lg">
                <div className="text-sm text-gray-400 mb-2">{t.modules.chaos.keysEntered}</div>
                <div className="text-2xl font-mono text-neon-cyan">
                  {keySequence.length > 0 ? keySequence.join('') : '...'}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-6 animate-glitch-2">💥</div>
              <div className="text-3xl text-neon-pink mb-4 animate-pulse-neon">
                {t.modules.chaos.active}
              </div>
              <p className="text-gray-300 mb-6">
                {t.modules.chaos.activeSubtitle}
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/20 border border-red-500 rounded animate-glitch">
                  {t.modules.chaos.warning}
                </div>
                <div className="p-4 bg-neon-purple/20 border border-neon-purple rounded animate-float">
                  {t.modules.chaos.colorsShifting}
                </div>
                <div className="p-4 bg-neon-blue/20 border border-neon-blue rounded animate-glitch-2">
                  {t.modules.chaos.everythingBreaking}
                </div>
              </div>
              <button
                onClick={() => setChaosMode(false)}
                className="mt-8 px-6 py-3 bg-red-500/20 border-2 border-red-500 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                {t.modules.chaos.disable}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
