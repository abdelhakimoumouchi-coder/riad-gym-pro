import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Riad Gym Pro - Compléments Alimentaires Sportifs en Algérie',
  description: 'Boutique en ligne de compléments alimentaires sportifs de qualité en Algérie',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
