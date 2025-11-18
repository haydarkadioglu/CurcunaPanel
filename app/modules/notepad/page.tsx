'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const randomEmojis = ['👻', '💀', '👽', '🤖', '🎃', '🦇', '🕷️', '🐉', '🔥', '⚡'];
const asciiGhost = `
    .-.
   (o o)
   | O |
    \\_/
`;

export default function NotepadPage() {
  const { t, language } = useLanguage();
  const [text, setText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [glitch, setGlitch] = useState(false);

  // Language-specific mischief patterns
  const mischiefPatterns = language === 'tr' ? [
    { from: /sen/g, to: 'ben' },
    { from: /ben/g, to: 'sen' },
    { from: /evet/g, to: 'hayır' },
    { from: /hayır/g, to: 'evet' },
    { from: /güzel/g, to: 'çirkin' },
    { from: /iyi/g, to: 'kötü' },
    { from: /mutlu/g, to: 'üzgün' },
    { from: /büyük/g, to: 'küçük' },
    { from: /hızlı/g, to: 'yavaş' },
    { from: /sıcak/g, to: 'soğuk' },
  ] : [
    { from: /you/g, to: 'me' },
    { from: /me/g, to: 'you' },
    { from: /yes/g, to: 'no' },
    { from: /no/g, to: 'yes' },
    { from: /good/g, to: 'bad' },
    { from: /bad/g, to: 'good' },
    { from: /happy/g, to: 'sad' },
    { from: /big/g, to: 'small' },
    { from: /fast/g, to: 'slow' },
    { from: /hot/g, to: 'cold' },
  ];

  useEffect(() => {
    let processedText = text;

    // Randomly apply mischief
    if (Math.random() < 0.3 && text.length > 10) {
      const pattern = mischiefPatterns[Math.floor(Math.random() * mischiefPatterns.length)];
      processedText = processedText.replace(pattern.from, pattern.to);
      setGlitch(true);
      setTimeout(() => setGlitch(false), 500);
    }

    // Randomly add emoji
    if (Math.random() < 0.1 && text.length > 5) {
      const emoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
      processedText += ' ' + emoji;
    }

    // Randomly add ASCII ghost
    if (Math.random() < 0.05 && text.length > 20) {
      processedText += '\n\n' + asciiGhost;
    }

    setDisplayText(processedText);
  }, [text, mischiefPatterns]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-neon-cyan hover:text-neon-pink">
            {t.common.backToHome}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="bg-black/50 border-2 border-neon-blue rounded-lg p-8 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-6 text-center">
            <GlitchText intensity="medium">{t.modules.notepad.title}</GlitchText>
          </h1>

          <p className="text-center text-gray-300 mb-4">
            {t.modules.notepad.subtitle}
          </p>

          <div className={`mb-4 ${glitch ? 'animate-glitch-2' : ''}`}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-96 p-4 bg-black border-2 border-neon-purple rounded-lg text-white font-mono resize-none focus:outline-none focus:border-neon-pink"
              placeholder={t.modules.notepad.placeholder}
            />
          </div>

          <div className="p-4 bg-black/70 border-2 border-neon-cyan rounded-lg">
            <div className="text-sm text-neon-pink mb-2">{t.modules.notepad.visibleText}</div>
            <div className="text-white font-mono whitespace-pre-wrap min-h-[100px]">
              {displayText || <span className="text-gray-500">{t.modules.notepad.placeholderText}</span>}
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            {t.modules.notepad.warning}
          </div>
        </div>
      </div>
    </div>
  );
}
