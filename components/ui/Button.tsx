'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  glitch?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  glitch = false,
  className = '',
  ...props 
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-neon-blue text-black border-neon-blue hover:bg-neon-cyan hover:border-neon-cyan',
    secondary: 'bg-transparent text-neon-pink border-neon-pink hover:bg-neon-pink/10',
    danger: 'bg-transparent text-red-400 border-red-400 hover:bg-red-400/10',
  };

  return (
    <button
      className={`
        px-6 py-3 rounded-lg border-2 font-bold
        transition-all duration-300
        hover:shadow-[0_0_20px_currentColor]
        active:scale-95
        ${variantClasses[variant]}
        ${glitch ? 'animate-glitch-2' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

