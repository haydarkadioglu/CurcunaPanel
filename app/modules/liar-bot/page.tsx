'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LiarBotPage() {
  const { t, language } = useLanguage();
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{ question: string; answer: string }>>([]);

  const sendMessage = async () => {
    if (!message.trim()) {
      setError(language === 'tr' ? 'Lütfen bir mesaj girin!' : 'Please enter a message!');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/liar-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          language: language,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      
      if (data.response) {
        setResponse(data.response);
        setHistory(prev => [{ question: message.trim(), answer: data.response }, ...prev].slice(0, 10));
        setMessage('');
      } else {
        throw new Error(language === 'tr' ? 'Yanıt alınamadı' : 'No response received');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
            <GlitchText intensity="medium">{t.modules.liarBot?.title || 'Yalancı Bot'}</GlitchText>
          </h1>

          <p className="text-center text-gray-300 mb-8">
            {language === 'tr' 
              ? 'Bu bot her şeye yalan söyler. Sorularını sor, yalan cevaplar alsın!'
              : 'This bot lies about everything. Ask your questions, get fake answers!'}
          </p>

          {/* Chat History */}
          {history.length > 0 && (
            <div className="mb-6 max-h-96 overflow-y-auto space-y-4">
              {history.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-right">
                    <div className="inline-block bg-neon-blue/20 border border-neon-blue rounded-lg p-3 text-sm">
                      <div className="text-neon-cyan font-bold mb-1">
                        {language === 'tr' ? 'Sen:' : 'You:'}
                      </div>
                      <div className="text-white">{item.question}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="inline-block bg-neon-pink/20 border border-neon-pink rounded-lg p-3 text-sm">
                      <div className="text-neon-pink font-bold mb-1">
                        {language === 'tr' ? 'Yalancı Bot:' : 'Liar Bot:'}
                      </div>
                      <div className="text-white">{item.answer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Current Response */}
          {response && !loading && (
            <div className="mb-6 p-6 bg-black/70 border-2 border-neon-purple rounded-lg">
              <div className="text-neon-pink font-bold mb-2">
                {language === 'tr' ? 'Yalancı Bot:' : 'Liar Bot:'}
              </div>
              <div className="text-lg text-neon-cyan animate-pulse-neon whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}

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
              <div className="inline-block animate-spin">🤖</div>
              <div className="mt-4 text-neon-pink">
                {language === 'tr' ? 'Yalancı Bot düşünüyor...' : 'Liar Bot is thinking...'}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'tr' 
                ? 'Yalancı Bot\'a bir şey sor...'
                : 'Ask the Liar Bot something...'}
              className="w-full h-32 p-4 bg-black border-2 border-neon-purple rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors resize-none"
              disabled={loading}
            />
            <Button 
              onClick={sendMessage} 
              variant="primary" 
              className="w-full"
              disabled={loading || !message.trim()}
            >
              {loading 
                ? (language === 'tr' ? 'Gönderiliyor...' : 'Sending...')
                : (language === 'tr' ? 'Gönder' : 'Send')}
            </Button>
          </div>

          {/* Warning */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded text-yellow-300 text-sm text-center">
            ⚠️ {language === 'tr' 
              ? 'Bu bot her şeye yalan söyler. Cevaplarına güvenme!'
              : 'This bot lies about everything. Don\'t trust its answers!'}
          </div>
        </div>
      </div>
    </div>
  );
}

