'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import fortunesData from '@/data/fortunes.json';

export default function FortunePage() {
  const { t, language } = useLanguage();
  const [fortune, setFortune] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [source, setSource] = useState<string>('');

  const topics = [
    { key: 'love', emoji: '💕' },
    { key: 'career', emoji: '💼' },
    { key: 'health', emoji: '🏥' },
    { key: 'money', emoji: '💰' },
    { key: 'friendship', emoji: '👥' },
    { key: 'travel', emoji: '✈️' },
    { key: 'custom', emoji: '✨' },
  ];

  const generateFortune = async () => {
    const topic = selectedTopic === 'custom' ? customTopic : selectedTopic;
    
    setIsGenerating(true);
    setFortune('');
    setError('');
    setSource('');

    if (!topic.trim()) {
      // Fallback to random JSON fortune
      setTimeout(() => {
        const randomFortune = fortunesData.fortunes[Math.floor(Math.random() * fortunesData.fortunes.length)];
        setFortune(randomFortune);
        setSource('fallback');
        setIsGenerating(false);
      }, 1000 + Math.random() * 1000);
      return;
    }

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.fortune) {
        setFortune(data.fortune);
        setSource(data.source || 'unknown');
      } else {
        throw new Error('No fortune in response');
      }
    } catch (error: any) {
      setError(error.message || 'Error occurred');
      // Fallback to JSON
      const randomFortune = fortunesData.fortunes[Math.floor(Math.random() * fortunesData.fortunes.length)];
      setFortune(randomFortune);
      setSource('fallback');
    } finally {
      setIsGenerating(false);
    }
  };

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
            <GlitchText intensity="medium">{t.modules.fortune.title}</GlitchText>
          </h1>

          <p className="text-center text-gray-300 mb-8">
            {t.modules.fortune.subtitle}
          </p>

          {/* Topic Selection */}
          <div className="mb-6">
            <div className="text-neon-pink mb-4 font-bold text-center">
              {language === 'tr' ? 'Konu Seç:' : 'Choose Topic:'}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {topics.map((topic) => (
                <button
                  key={topic.key}
                  onClick={() => {
                    setSelectedTopic(topic.key);
                    setCustomTopic('');
                  }}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${selectedTopic === topic.key
                      ? 'border-neon-pink bg-neon-pink/10'
                      : 'border-neon-blue hover:border-neon-cyan'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{topic.emoji}</div>
                  <div className="text-xs font-bold">
                    {t.modules.fortune.topics[topic.key as keyof typeof t.modules.fortune.topics]}
                  </div>
                </button>
              ))}
            </div>

            {selectedTopic === 'custom' && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={t.modules.fortune.topicPlaceholder}
                className="w-full p-3 bg-black border-2 border-neon-purple rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors"
              />
            )}
          </div>

          <div className="text-center mb-8">
            <Button 
              onClick={generateFortune} 
              variant="primary" 
              glitch
              disabled={isGenerating || !selectedTopic}
            >
              {isGenerating ? t.modules.fortune.generating : t.modules.fortune.generate}
            </Button>
          </div>

          {isGenerating && (
            <div className="text-center text-2xl mb-8 animate-pulse-neon">
              <div className="inline-block animate-spin">🔮</div>
              <div className="mt-4 text-neon-pink">{t.modules.fortune.shuffling}</div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded text-yellow-300 text-sm">
              <div className="font-bold mb-1">⚠️ {language === 'tr' ? 'Uyarı:' : 'Warning:'}</div>
              <div>{error}</div>
              <div className="mt-2 text-xs opacity-75">
                {language === 'tr' ? 'Fallback kullanıldı (JSON)' : 'Using fallback (JSON)'}
              </div>
            </div>
          )}

          {fortune && !isGenerating && (
            <div className="mt-8 p-8 bg-black/70 border-2 border-neon-purple rounded-lg">
              <div className="text-6xl text-center mb-6 animate-float">🔮</div>
              <div className="relative">
                <div className="text-2xl text-center text-neon-cyan animate-pulse-neon mb-4">
                  {fortune}
                </div>
                {source && (
                  <div className="flex justify-center mb-4">
                    <div className={`text-xs px-3 py-1 rounded ${
                      source === 'gemini' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                    }`}>
                      {source === 'gemini' ? '🤖 Gemini' : '📄 Fallback'}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center mt-6 text-gray-400 text-sm">
                {t.modules.fortune.disclaimer}
              </div>
            </div>
          )}

          {!fortune && !isGenerating && (
            <div className="text-center text-gray-500">
              {t.modules.fortune.clickToRead}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
