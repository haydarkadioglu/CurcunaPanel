'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CalculatorPage() {
  const { t } = useLanguage();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [glitch, setGlitch] = useState(false);
  const [apology, setApology] = useState('');

  useEffect(() => {
    if (Math.random() < 0.1) {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 300);
    }
  }, [display]);

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op: string) => {
    if (previousValue === null) {
      setPreviousValue(parseFloat(display));
      setOperation(op);
      setDisplay('0');
    } else {
      calculate();
      setOperation(op);
    }
    const comments = t.calculator.comments;
    setComment(comments[Math.floor(Math.random() * comments.length)]);
  };

  const calculate = () => {
    if (previousValue === null || operation === null) return;

    const current = parseFloat(display);
    let result: number;

    // Sometimes give wrong result
    const shouldGlitch = Math.random() < 0.15;

    switch (operation) {
      case '+':
        result = shouldGlitch 
          ? previousValue + current + Math.floor(Math.random() * 10) - 5
          : previousValue + current;
        break;
      case '-':
        result = shouldGlitch
          ? previousValue - current - Math.floor(Math.random() * 10) + 5
          : previousValue - current;
        break;
      case '*':
        result = shouldGlitch
          ? previousValue * current * (0.5 + Math.random())
          : previousValue * current;
        break;
      case '/':
        result = shouldGlitch && current !== 0
          ? previousValue / current / (0.5 + Math.random())
          : current !== 0
          ? previousValue / current
          : 0;
        break;
      default:
        result = current;
    }

    if (shouldGlitch) {
      const apologies = t.calculator.apologies;
      setApology(apologies[Math.floor(Math.random() * apologies.length)]);
      setTimeout(() => setApology(''), 3000);
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    const comments = t.calculator.comments;
    setComment(comments[Math.floor(Math.random() * comments.length)]);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setComment('');
    setApology('');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-neon-cyan hover:text-neon-pink">
            {t.common.backToHome}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="bg-black/50 border-2 border-neon-blue rounded-lg p-8 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-6 text-center">
            <GlitchText intensity="medium">{t.modules.calculator.title}</GlitchText>
          </h1>

          {apology && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-300 text-center animate-glitch">
              {apology}
            </div>
          )}

          <div className={`mb-6 p-6 bg-black border-2 border-neon-purple rounded text-right text-4xl font-mono ${glitch ? 'animate-glitch-2' : ''}`}>
            {display}
          </div>

          {comment && (
            <div className="mb-6 text-center text-neon-pink text-sm">
              {comment}
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <Button onClick={handleClear} variant="danger" className="col-span-2">
              CLEAR
            </Button>
            <Button onClick={() => handleOperation('/')} variant="secondary">
              ÷
            </Button>
            <Button onClick={() => handleOperation('*')} variant="secondary">
              ×
            </Button>

            <Button onClick={() => handleNumber('7')} variant="primary">7</Button>
            <Button onClick={() => handleNumber('8')} variant="primary">8</Button>
            <Button onClick={() => handleNumber('9')} variant="primary">9</Button>
            <Button onClick={() => handleOperation('-')} variant="secondary">-</Button>

            <Button onClick={() => handleNumber('4')} variant="primary">4</Button>
            <Button onClick={() => handleNumber('5')} variant="primary">5</Button>
            <Button onClick={() => handleNumber('6')} variant="primary">6</Button>
            <Button onClick={() => handleOperation('+')} variant="secondary">+</Button>

            <Button onClick={() => handleNumber('1')} variant="primary">1</Button>
            <Button onClick={() => handleNumber('2')} variant="primary">2</Button>
            <Button onClick={() => handleNumber('3')} variant="primary">3</Button>
            <Button onClick={calculate} variant="secondary" className="row-span-2">
              =
            </Button>

            <Button onClick={() => handleNumber('0')} variant="primary" className="col-span-2">0</Button>
            <Button onClick={() => handleNumber('.')} variant="primary">.</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
