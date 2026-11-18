'use client';
import type { ReactNode } from 'react';
import { PreferencesProvider } from '../lib/preferences';
import { Header } from './Header';
import { Footer } from './Footer';

// Wraps every page: concept-project notice, header, footer and the WhatsApp button.
// In Next.js this becomes app/layout.tsx.
export function SiteShell({ children, overHero = false }: { children: ReactNode; overHero?: boolean }) {
  return (
    <PreferencesProvider>
      <div className="ribbon"><span className="ribbon__long">Concept project · all listings, figures and reviews are sample content</span><span className="ribbon__short">Concept project · sample content</span></div>
      <Header overHero={overHero} />
      <main id="main">{children}</main>
      <Footer />
    </PreferencesProvider>
  );
}
