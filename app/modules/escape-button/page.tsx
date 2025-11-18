'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function EscapeButtonPage() {
  const { t } = useLanguage();
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [clicks, setClicks] = useState(0);
  const [currentShape, setCurrentShape] = useState(0);
  const [isCaught, setIsCaught] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const escapeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const buttonShapes = t.modules.escapeButton.buttonShapes;
  const buttonSize = 150;
  const escapeDistance = 200; // Mouse bu mesafeye yaklaştığında kaçacak

  const calculateEscapePosition = useCallback((mouseX: number, mouseY: number, currentX: number, currentY: number) => {
    if (!containerRef.current) return { x: currentX, y: currentY };

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - buttonSize;
    const maxY = containerRect.height - buttonSize;

    // Butonun merkez pozisyonu
    const buttonCenterX = currentX + buttonSize / 2;
    const buttonCenterY = currentY + buttonSize / 2;

    // Mouse ile buton arasındaki mesafe
    const dx = mouseX - buttonCenterX;
    const dy = mouseY - buttonCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Eğer mouse çok yakınsa, ters yöne kaç
    if (distance < escapeDistance) {
      // Ters yön vektörü
      const escapeX = -dx / distance;
      const escapeY = -dy / distance;

      // Kaçış mesafesi
      const escapeSpeed = (escapeDistance - distance) * 0.5;
      
      let newX = buttonCenterX + escapeX * escapeSpeed - buttonSize / 2;
      let newY = buttonCenterY + escapeY * escapeSpeed - buttonSize / 2;

      // Sınırları kontrol et
      newX = Math.max(0, Math.min(maxX, newX));
      newY = Math.max(0, Math.min(maxY, newY));

      return { x: newX, y: newY };
    }

    return { x: currentX, y: currentY };
  }, []);

  const moveButton = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - buttonSize;
    const maxY = containerRect.height - buttonSize;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setPosition({ x: newX, y: newY });
    setCurrentShape(Math.floor(Math.random() * buttonShapes.length));
  }, [buttonShapes.length]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || isCaught) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Mouse pozisyonunu container'a göre hesapla
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    setMousePos({ x: mouseX, y: mouseY });

    // Butonun mevcut pozisyonunu al
    const currentPos = position;
    
    // Kaçış pozisyonunu hesapla
    const escapePos = calculateEscapePosition(mouseX, mouseY, currentPos.x, currentPos.y);
    
    // Eğer pozisyon değiştiyse güncelle
    if (escapePos.x !== currentPos.x || escapePos.y !== currentPos.y) {
      setPosition(escapePos);
      
      // Bazen şekil değiştir
      if (Math.random() < 0.1) {
        setCurrentShape(Math.floor(Math.random() * buttonShapes.length));
      }
    }
  }, [isCaught, position, calculateEscapePosition, buttonShapes.length]);

  const handleClick = () => {
    if (isCaught) {
      setIsCaught(false);
      setClicks(0);
      moveButton();
      return;
    }

    setClicks(clicks + 1);
    
    // Sometimes catch it
    if (Math.random() < 0.1) {
      setIsCaught(true);
    } else {
      moveButton();
    }
  };

  // Mouse takibi için event listener
  useEffect(() => {
    if (!containerRef.current || isCaught) return;

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, isCaught]);

  // Periyodik kaçış kontrolü (mouse hareket etmese bile)
  useEffect(() => {
    if (isCaught) {
      if (escapeIntervalRef.current) {
        clearInterval(escapeIntervalRef.current);
        escapeIntervalRef.current = null;
      }
      return;
    }

    escapeIntervalRef.current = setInterval(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Mouse pozisyonunu container'a göre hesapla
      const mouseX = mousePos.x;
      const mouseY = mousePos.y;

      if (mouseX === 0 && mouseY === 0) return; // Mouse henüz hareket etmedi

      const currentPos = position;
      const escapePos = calculateEscapePosition(mouseX, mouseY, currentPos.x, currentPos.y);
      
      if (escapePos.x !== currentPos.x || escapePos.y !== currentPos.y) {
        setPosition(escapePos);
      }
    }, 50); // Her 50ms'de bir kontrol et

    return () => {
      if (escapeIntervalRef.current) {
        clearInterval(escapeIntervalRef.current);
      }
    };
  }, [mousePos, position, isCaught, calculateEscapePosition]);

  // İlk pozisyon
  useEffect(() => {
    moveButton();
  }, [moveButton]);

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
            <GlitchText intensity="medium">{t.modules.escapeButton.title}</GlitchText>
          </h1>

          <div className="text-center mb-6">
            <div className="text-2xl text-neon-cyan mb-2">
              {t.modules.escapeButton.clickCount}: <span className="text-neon-pink">{clicks}</span>
            </div>
            {isCaught && (
              <div className="text-xl text-green-400 animate-pulse-neon mb-4">
                {t.modules.escapeButton.caught}
              </div>
            )}
          </div>

          <div
            ref={containerRef}
            className="relative w-full h-[500px] bg-black/70 border-2 border-neon-purple rounded-lg overflow-hidden cursor-crosshair"
          >
            <button
              ref={buttonRef}
              onClick={handleClick}
              className={`
                absolute w-[150px] h-[150px] rounded-lg
                border-2 border-neon-pink bg-neon-pink/20
                text-white font-bold text-lg
                hover:bg-neon-pink/30 hover:border-neon-cyan
                transition-all duration-200
                flex flex-col items-center justify-center
                ${isCaught ? 'animate-glitch-2' : ''}
                shadow-[0_0_20px_rgba(255,0,255,0.5)]
                pointer-events-auto
              `}
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: isCaught ? 'scale(1.2)' : 'scale(1)',
                transition: isCaught ? 'transform 0.2s' : 'left 0.1s linear, top 0.1s linear',
              }}
            >
              <span className="text-4xl mb-2">{buttonShapes[currentShape].emoji}</span>
              <span>{buttonShapes[currentShape].text}</span>
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            {t.modules.escapeButton.hint}
            <br />
            <span className="text-neon-pink text-xs mt-2 block">
              {t.modules.escapeButton.mouseHint}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
