'use client';

import { useState, useEffect } from 'react';
import { Pinwheel } from '@/components/pinwheel';
import type { SiteConfig } from '@/lib/config';

const ROLES = ['Développeur', 'Musicien', 'Passionné', 'SysAdmin', 'Créatif', 'DevOps'];

export function HomeContent({ config }: { config: SiteConfig }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Respect prefers-reduced-motion: freeze the cycle entirely, show one role.
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let swap: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      // Crossfade: fade out, swap the word, fade back in. No scramble.
      setVisible(false);
      swap = setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setVisible(true);
      }, 220);
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(swap);
    };
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

  const count = String(config.links.length).padStart(2, '0');

  return (
    <div className="flex min-h-screen flex-col bg-burgundy p-6 text-bone md:p-10">
      <h1 className="sr-only">Marius — Développeur, Musicien, SysAdmin</h1>

      {/* TOP META ROW */}
      <header className="grid grid-cols-3 items-baseline text-[0.7rem] uppercase tracking-[0.18em] md:text-xs">
        <span className="justify-self-start">Portfolio</span>
        <span className="justify-self-center text-center">@marius.bzc</span>
        <span className="justify-self-end">2026</span>
      </header>

      {/* BODY — two-column editorial grid */}
      <main className="mt-10 grid flex-1 grid-cols-1 gap-y-14 md:mt-12 md:grid-cols-12 md:gap-x-8">
        {/* LEFT — identity, anchored to the bottom of the column */}
        <section className="flex flex-col md:col-span-8">
          <Pinwheel className="h-10 w-10 text-bone md:h-12 md:w-12" />

          <div className="mt-auto pt-16">
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-bone/60 md:text-xs">
              Hello moi c&apos;est
            </p>

            <h2
              aria-hidden="true"
              className="mt-3 font-black uppercase leading-[0.85] tracking-tight text-[clamp(3.5rem,12vw,10rem)]"
            >
              Marius
            </h2>

            {/* ROLE CYCLE — crossfade only; full role list lives in the sr-only h1 */}
            <p
              aria-hidden="true"
              className="mt-5 text-xl font-medium tracking-tight text-bone transition-opacity duration-300 md:text-3xl"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <span className="text-bone/50">▸ </span>
              {ROLES[roleIndex]}
            </p>

            <button
              type="button"
              onClick={handleContactClick}
              className="mt-10 inline-flex items-center border border-bone bg-bone px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-burgundy transition-colors hover:bg-burgundy hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy"
            >
              Me contacter
            </button>
          </div>
        </section>

        {/* RIGHT — numbered link index, anchored to the bottom */}
        <nav
          aria-label="Liens sociaux"
          className="flex flex-col md:col-span-4 md:justify-end"
        >
          <div className="mb-4 flex items-baseline justify-between text-[0.7rem] uppercase tracking-[0.18em] text-bone/60 md:text-xs">
            <span>Index</span>
            <span>({count})</span>
          </div>

          <ul className="border-t border-bone/20">
            {config.links.map((link, i) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleLinkClick(link.url)}
                  aria-label={link.tooltip}
                  className="group flex w-full items-baseline gap-4 border-b border-bone/20 px-1 py-4 uppercase tracking-[0.06em] text-bone transition-colors hover:bg-bone hover:text-burgundy focus-visible:bg-bone focus-visible:text-burgundy focus-visible:outline-none"
                >
                  <span className="text-[0.7rem] tabular-nums text-bone/50 transition-colors group-hover:text-burgundy/70 group-focus-visible:text-burgundy/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-left text-[clamp(1.25rem,2.6vw,1.75rem)] font-medium">
                    {link.name.toUpperCase()}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-bone/60 transition-colors group-hover:text-burgundy group-focus-visible:text-burgundy"
                  >
                    ↗
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      {/* FOOTER — spec block, full width */}
      <footer className="mt-12 grid grid-cols-1 gap-2 border-t border-bone/20 pt-5 text-[0.7rem] uppercase tracking-[0.18em] text-bone/60 md:grid-cols-2 md:text-xs">
        <p>Marius BC — Dev · Music · SysAdmin · DevOps</p>
        <p className="md:justify-self-end">Based in France</p>
      </footer>
    </div>
  );
}
