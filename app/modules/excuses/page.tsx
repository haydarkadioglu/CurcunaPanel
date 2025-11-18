'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import excusesData from '@/data/excuses.json';

export default function ExcusesPage() {
  const { t, language } = useLanguage();
  const [excuse, setExcuse] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [source, setSource] = useState<string>('');

  const topics = [
    { key: 'work', emoji: '💼' },
    { key: 'school', emoji: '🎓' },
    { key: 'homework', emoji: '📚' },
    { key: 'meeting', emoji: '🤝' },
    { key: 'project', emoji: '🚀' },
    { key: 'deadline', emoji: '⏰' },
    { key: 'custom', emoji: '✨' },
  ];

  const generateExcuse = async () => {
    const topic = selectedTopic === 'custom' ? customTopic : selectedTopic;
    
    if (!topic.trim()) {
      // Fallback to random JSON excuse
      const randomExcuse = excusesData.excuses[Math.floor(Math.random() * excusesData.excuses.length)];
      setExcuse(randomExcuse);
      setHistory(prev => [randomExcuse, ...prev].slice(0, 5));
      return;
    }

    setLoading(true);
    setExcuse('');
    setError('');
    setSource('');

    try {
      const response = await fetch('/api/excuses', {
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
      
      if (data.excuse) {
        setExcuse(data.excuse);
        setSource(data.source || 'unknown');
        setHistory(prev => [data.excuse, ...prev].slice(0, 5));
      } else {
        throw new Error('No excuse in response');
      }
    } catch (error: any) {
      setError(error.message || 'Error occurred');
      // Fallback to JSON
      const randomExcuse = excusesData.excuses[Math.floor(Math.random() * excusesData.excuses.length)];
      setExcuse(randomExcuse);
      setSource('fallback');
      setHistory(prev => [randomExcuse, ...prev].slice(0, 5));
    } finally {
      setLoading(false);
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
            <GlitchText intensity="medium">{t.modules.excuses.title}</GlitchText>
          </h1>

          <p className="text-center text-gray-300 mb-8">
            {t.modules.excuses.subtitle}
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
                    {t.modules.excuses.topics[topic.key as keyof typeof t.modules.excuses.topics]}
                  </div>
                </button>
              ))}
            </div>

            {selectedTopic === 'custom' && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={t.modules.excuses.topicPlaceholder}
                className="w-full p-3 bg-black border-2 border-neon-purple rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors"
              />
            )}
          </div>

          <div className="text-center mb-8">
            <Button 
              onClick={generateExcuse} 
              variant="primary" 
              glitch
              disabled={loading || !selectedTopic}
            >
              {loading ? (language === 'tr' ? 'Üretiliyor...' : 'Generating...') : t.modules.excuses.generate}
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded text-yellow-300 text-sm">
              <div className="font-bold mb-1">⚠️ {language === 'tr' ? 'Uyarı:' : 'Warning:'}</div>
              <div>{error}</div>
              <div className="mt-2 text-xs opacity-75">
                {language === 'tr' ? 'Fallback kullanıldı (JSON)' : 'Using fallback (JSON)'}
              </div>
            </div>
          )}

          {excuse && (
            <div className="mt-8 p-8 bg-black/70 border-2 border-neon-purple rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-3xl text-center text-neon-cyan animate-pulse-neon flex-1">
                  {excuse}
                </div>
                {source && (
                  <div className={`text-xs px-3 py-1 rounded ml-4 ${
                    source === 'gemini' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                  }`}>
                    {source === 'gemini' ? '🤖 Gemini' : '📄 Fallback'}
                  </div>
                )}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-6">
              <div className="text-neon-pink mb-4 font-bold">{t.modules.excuses.recent}</div>
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-black/50 border border-neon-blue/50 rounded text-sm text-gray-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!excuse && !loading && (
            <div className="text-center text-gray-500">
              {t.modules.excuses.clickToGenerate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
