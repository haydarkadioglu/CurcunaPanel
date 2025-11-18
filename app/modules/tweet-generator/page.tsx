'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TweetGeneratorPage() {
  const { t, language } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [tweet, setTweet] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  const topics = [
    { key: 'poetry', emoji: '📜' },
    { key: 'literature', emoji: '📚' },
    { key: 'philosophy', emoji: '🤔' },
    { key: 'art', emoji: '🎨' },
    { key: 'music', emoji: '🎵' },
    { key: 'cinema', emoji: '🎬' },
    { key: 'technology', emoji: '💻' },
    { key: 'custom', emoji: '✨' },
  ];

  const generateTweet = async () => {
    const topic = selectedTopic === 'custom' ? customTopic : selectedTopic;
    
    if (!topic.trim()) {
      setError(language === 'tr' ? 'Lütfen bir konu seçin!' : 'Please select a topic!');
      return;
    }

    setLoading(true);
    setError('');
    setTweet('');

    try {
      const response = await fetch('/api/tweet-generator', {
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
      
      if (data.tweet) {
        setTweet(data.tweet);
        setHistory(prev => [data.tweet, ...prev].slice(0, 10));
      } else {
        throw new Error(language === 'tr' ? 'Tweet üretilemedi' : 'Failed to generate tweet');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
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
            <GlitchText intensity="medium">{t.modules.tweetGenerator?.title || 'Tweet Generator'}</GlitchText>
          </h1>

          <p className="text-center text-gray-300 mb-8">
            {language === 'tr' 
              ? 'Şiir, edebiyat ve daha fazlası hakkında tweet üret!'
              : 'Generate tweets about poetry, literature and more!'}
          </p>

          {/* Topic Selection */}
          <div className="mb-6">
            <div className="text-neon-pink mb-4 font-bold text-center">
              {language === 'tr' ? 'Konu Seç:' : 'Choose Topic:'}
            </div>
            <div className="grid grid-cols-4 md:grid-cols-4 gap-3 mb-4">
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
                    {t.modules.tweetGenerator?.topics?.[topic.key as keyof typeof t.modules.tweetGenerator.topics] || topic.key}
                  </div>
                </button>
              ))}
            </div>

            {selectedTopic === 'custom' && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={language === 'tr' ? 'Özel konu girin...' : 'Enter custom topic...'}
                className="w-full p-3 bg-black border-2 border-neon-purple rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink"
              />
            )}
          </div>

          <div className="mb-6">
            <Button 
              onClick={generateTweet} 
              variant="primary" 
              className="w-full"
              disabled={loading || !selectedTopic || (selectedTopic === 'custom' && !customTopic.trim())}
            >
              {loading 
                ? (language === 'tr' ? 'Üretiliyor...' : 'Generating...')
                : (language === 'tr' ? 'Tweet Üret' : 'Generate Tweet')}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-300 text-sm">
              <div className="font-bold mb-1">⚠️ {language === 'tr' ? 'Hata:' : 'Error:'}</div>
              <div>{error}</div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center text-2xl mb-8 animate-pulse-neon">
              <div className="inline-block animate-spin">🐦</div>
              <div className="mt-4 text-neon-pink">
                {language === 'tr' ? 'Tweet üretiliyor...' : 'Generating tweet...'}
              </div>
            </div>
          )}

          {/* Generated Tweet */}
          {tweet && !loading && (
            <div className="mb-6 p-6 bg-black/70 border-2 border-neon-purple rounded-lg">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🐦</div>
                <div className="flex-1">
                  <div className="text-lg text-neon-cyan animate-pulse-neon whitespace-pre-wrap mb-4">
                    {tweet}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(tweet);
                        alert(language === 'tr' ? 'Kopyalandı!' : 'Copied!');
                      }}
                      className="px-4 py-2 bg-neon-blue/20 border border-neon-blue rounded text-neon-cyan hover:bg-neon-blue/30 transition-colors text-sm"
                    >
                      {language === 'tr' ? 'Kopyala' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mt-6">
              <div className="text-neon-pink mb-4 font-bold">
                {language === 'tr' ? 'Son Tweetler:' : 'Recent Tweets:'}
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-black/50 border border-neon-blue/50 rounded-lg text-sm cursor-pointer hover:bg-black/70 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(item);
                      alert(language === 'tr' ? 'Kopyalandı!' : 'Copied!');
                    }}
                  >
                    <div className="text-gray-400 mb-1">🐦</div>
                    <div className="text-white">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

