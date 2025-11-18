import type { Metadata } from 'next';
import './globals.css';
import '../styles/globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'CurcunaPanel - Kaotik Eğlence Modülleri',
  description: 'Deneysel yazılım laboratuvarının eğlence modülleri paneli',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen">
        <LanguageProvider>
          <div className="min-h-screen relative z-10">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

