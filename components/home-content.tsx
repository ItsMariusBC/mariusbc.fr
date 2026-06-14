'use client';

import { useState, useEffect } from 'react';
import { Pinwheel } from '@/components/pinwheel';
import type { SiteConfig } from '@/lib/config';

const ROLES = ['Développeur', 'Musicien', 'Passionné', 'SysAdmin', 'Créatif', 'DevOps'];

export function HomeContent({ config }: { config: SiteConfig }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Crossfade: fade out, swap the word, fade back in. No scramble.
      setVisible(false);
      const swap = setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setVisible(true);
      }, 220);
      return () => clearTimeout(swap);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleContactClick = () => {
    const url = config.contactUrl;
    if (url.startsWith('mailto:') || url.startsWith('tel:')) window.location.href = url;
    else window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkClick = (url: string) => {
    if (url.startsWith('http')) window.open(url, '_blank', 'noopener,noreferrer');
    else window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-burgundy text-bone flex flex-col p-6 md:p-10">
      <h1 className="sr-only">Marius — Développeur, Musicien, SysAdmin</h1>

      {/* TOP META ROW — three poster cells */}
      <header className="grid grid-cols-3 items-baseline text-[0.7rem] md:text-xs uppercase tracking-[0.08em] text-bone">
        <span className="justify-self-start">Portfolio</span>
        <span className="justify-self-center text-center">@marius.bzc</span>
        <span className="justify-self-end">2026</span>
      </header>

      {/* PINWHEEL MARK — top-left, just under the meta row */}
      <div className="mt-8 md:mt-10">
        <Pinwheel className="w-10 h-10 md:w-12 md:h-12 text-bone" />
      </div>

      {/* HERO — anchored lower-left */}
      <main className="flex flex-1 flex-col justify-end">
        <div className="mt-16">
          <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.18em] text-bone/60">
            Hello moi c&apos;est
          </p>

          <h2
            aria-hidden="true"
            className="mt-3 font-black leading-none tracking-tight text-[clamp(4rem,16vw,13rem)]"
          >
            MARIUS
          </h2>

          {/* ROLE CYCLE — crossfade only */}
          <p
            aria-live="polite"
            className="mt-4 text-xl md:text-3xl font-medium tracking-tight text-bone transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <span aria-hidden="true" className="text-bone/50">▸ </span>
            {ROLES[roleIndex]}
          </p>
        </div>

        {/* CONTACT */}
        <div className="mt-12">
          <button
            type="button"
            onClick={handleContactClick}
            className="inline-flex items-center bg-bone text-burgundy border border-bone px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] transition-colors hover:bg-burgundy hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy"
          >
            Me contacter
          </button>
        </div>
      </main>

      {/* SOCIAL LINKS — Swiss list */}
      <nav aria-label="Liens sociaux" className="mt-16 border-t border-bone/20">
        {config.links.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => handleLinkClick(link.url)}
            aria-label={link.tooltip}
            className="group flex w-full items-center justify-between border-b border-bone/20 px-1 py-4 text-bone uppercase tracking-[0.08em] text-[clamp(1.25rem,4vw,2rem)] transition-colors hover:bg-bone hover:text-burgundy focus-visible:outline-none focus-visible:bg-bone focus-visible:text-burgundy active:bg-bone active:text-burgundy"
          >
            <span className="font-medium">{link.name.toUpperCase()}</span>
            <span aria-hidden="true" className="text-bone/60 transition-colors group-hover:text-burgundy group-focus-visible:text-burgundy group-active:text-burgundy">
              ↗
            </span>
          </button>
        ))}
      </nav>

      {/* FOOTER SPEC BLOCK — poster color-card style */}
      <footer className="mt-12 text-[0.7rem] md:text-xs uppercase tracking-[0.08em] text-bone/60 leading-relaxed">
        <p>Marius BC</p>
        <p>Dev · Music · SysAdmin · DevOps</p>
      </footer>
    </div>
  );
}
