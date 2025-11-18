'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GeminiTestPage() {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState<'gemini' | 'error' | null>(null);

  const testExcuses = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    setSource(null);

    try {
      const res = await fetch('/api/excuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: 'test',
          language: language,
        }),
      });

      const data = await res.json();
      setResponse(data.excuse || 'No response');
      setSource(data.source || 'unknown');
    } catch (err: any) {
      setError(err.message || 'Error occurred');
      setSource('error');
    } finally {
      setLoading(false);
    }
  };

  const testFortune = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    setSource(null);

    try {
      const res = await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: 'test',
          language: language,
        }),
      });

      const data = await res.json();
      setResponse(data.fortune || 'No response');
      setSource(data.source || 'unknown');
    } catch (err: any) {
      setError(err.message || 'Error occurred');
      setSource('error');
    } finally {
      setLoading(false);
    }
  };

  const testCustom = async () => {
    if (!prompt.trim()) {
      setError(language === 'tr' ? 'Lütfen bir prompt girin!' : 'Please enter a prompt!');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');
    setSource(null);

    try {
      const res = await fetch('/api/gemini-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setSource('error');
      } else if (data.response) {
        setResponse(data.response);
        setSource(data.source || 'gemini');
      } else {
        setError(language === 'tr' ? 'Yanıt alınamadı' : 'No response received');
        setSource('error');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
      setSource('error');
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
            <GlitchText intensity="medium">Gemini API Test</GlitchText>
          </h1>

          <p className="text-center text-gray-300 mb-8">
            {language === 'tr' 
              ? 'Gemini API\'yi test etmek için kullanın'
              : 'Use this to test Gemini API'}
          </p>

          {/* Quick Tests */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button 
              onClick={testExcuses} 
              variant="primary" 
              disabled={loading}
            >
              {language === 'tr' ? 'Bahaneler API Test' : 'Test Excuses API'}
            </Button>
            <Button 
              onClick={testFortune} 
              variant="secondary" 
              disabled={loading}
            >
              {language === 'tr' ? 'Fal API Test' : 'Test Fortune API'}
            </Button>
          </div>

          {/* Custom Prompt */}
          <div className="mb-6">
            <label className="block text-neon-pink mb-2 font-bold">
              {language === 'tr' ? 'Özel Prompt:' : 'Custom Prompt:'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={language === 'tr' 
                ? 'Gemini\'ye göndermek istediğiniz prompt\'u yazın...'
                : 'Enter the prompt you want to send to Gemini...'}
              className="w-full h-32 p-4 bg-black border-2 border-neon-purple rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors resize-none"
            />
            <Button 
              onClick={testCustom} 
              variant="primary" 
              className="mt-4 w-full"
              disabled={loading || !prompt.trim()}
            >
              {loading 
                ? (language === 'tr' ? 'Gönderiliyor...' : 'Sending...')
                : (language === 'tr' ? 'Gemini\'ye Gönder' : 'Send to Gemini')}
            </Button>
          </div>

          {/* Response */}
          {loading && (
            <div className="text-center text-2xl mb-8 animate-pulse-neon">
              <div className="inline-block animate-spin">🤖</div>
              <div className="mt-4 text-neon-pink">
                {language === 'tr' ? 'Gemini düşünüyor...' : 'Gemini is thinking...'}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-300">
              <div className="font-bold mb-2">Error:</div>
              <div className="text-sm font-mono">{error}</div>
            </div>
          )}

          {response && (
            <div className="mt-8 p-6 bg-black/70 border-2 border-neon-purple rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="text-neon-pink font-bold">
                  {language === 'tr' ? 'Yanıt:' : 'Response:'}
                </div>
                <div className={`text-xs px-3 py-1 rounded ${
                  source === 'gemini' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500'
                    : source === 'error'
                    ? 'bg-red-500/20 text-red-400 border border-red-500'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                }`}>
                  {source === 'gemini' ? 'Gemini' : source === 'error' ? 'Error' : 'Fallback'}
                </div>
              </div>
              <div className="text-lg text-neon-cyan animate-pulse-neon whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}

          {/* API Key Info */}
          <div className="mt-6 p-4 bg-black/50 border border-neon-blue/50 rounded text-sm text-gray-400">
            <div className="font-bold text-neon-pink mb-2">
              {language === 'tr' ? 'API Key Durumu:' : 'API Key Status:'}
            </div>
            <div className="font-mono text-xs">
              ⚠️ {language === 'tr' 
                ? 'Server-side key kullanılıyor (.env.local dosyasını kontrol edin)'
                : 'Using server-side key (check .env.local file)'}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {language === 'tr' 
                ? 'API key .env.local dosyasında GEMINI_API_KEY olarak tanımlanmalı'
                : 'API key should be defined as GEMINI_API_KEY in .env.local file'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

