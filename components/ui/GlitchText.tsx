'use client';

import { ReactNode } from 'react';

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export default function GlitchText({ children, className = '', intensity = 'medium' }: GlitchTextProps) {
  const intensityClasses = {
    low: 'hover:animate-glitch',
    medium: 'animate-glitch-2',
    high: 'animate-glitch-2 hover:animate-glitch',
  };

  return (
    <span
      className={`glitch-text ${intensityClasses[intensity]} ${className}`}
      data-text={typeof children === 'string' ? children : ''}
    >
      {children}
    </span>
  );
}

