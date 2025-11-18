'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
  className?: string;
}

export default function Card({ title, description, href, icon, className = '' }: CardProps) {
  return (
    <Link href={href}>
      <div
        className={`
          relative p-6 rounded-lg border-2 border-neon-blue
          bg-black/50 backdrop-blur-sm
          hover:border-neon-pink hover:shadow-[0_0_20px_rgba(255,0,255,0.5)]
          transition-all duration-300 cursor-pointer
          group overflow-hidden
          ${className}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-pink/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10">
          {icon && (
            <div className="mb-4 text-4xl group-hover:animate-glitch">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-bold text-neon-cyan mb-2 group-hover:text-neon-pink transition-colors">
            {title}
          </h3>
          <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
            {description}
          </p>
        </div>

        <div className="absolute top-0 right-0 w-20 h-20 bg-neon-purple/20 rounded-full blur-2xl group-hover:bg-neon-pink/30 transition-colors" />
      </div>
    </Link>
  );
}

