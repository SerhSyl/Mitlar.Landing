import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '../lib/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';

const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin', 'cyrillic'], weight: ['500', '600', '700'], variable: '--font-cormorant', display: 'swap' });

export const metadata: Metadata = {
  title: 'Mitlar - Team game on gliding broom',
  description: 'Join the future of team sports on one wheel.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        <LanguageProvider>
          <div style={{
            position: 'fixed',
            top: '1rem',
            right: '1.5rem',
            zIndex: 1000,
          }}>
            <LanguageSwitcher />
          </div>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
