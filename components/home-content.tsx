'use client';

import { useState, useEffect, useRef } from 'react';
import { Pinwheel } from '@/components/pinwheel';
import TextPressure from '@/components/text-pressure';
import type { SiteConfig } from '@/lib/config';

const ROLES = ['Développeur', 'Musicien', 'Passionné', 'SysAdmin', 'Créatif', 'DevOps'];

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// Derive a readable handle from a link URL: last path segment as @handle, else host.
function handleFor(url: string): string {
  try {
    const u = new URL(url);
    const segs = u.pathname.split('/').filter(Boolean);
    if (segs.length) return '@' + segs[segs.length - 1];
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function HomeContent({ config }: { config: SiteConfig }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [clock, setClock] = useState('');
  const [copied, setCopied] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const contactRef = useRef<HTMLButtonElement>(null);

  // Enable the interactive Text Pressure wordmark only with motion + after mount
  // (server + first paint render the static fallback → no hydration mismatch).
  useEffect(() => {
    if (!prefersReducedMotion()) setEnhanced(true);
  }, []);

  // Role auto-cycle (frozen under reduced-motion).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let swap: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);
      swap = setTimeout(() => {
        setRoleIndex((p) => (p + 1) % ROLES.length);
        setVisible(true);
      }, 220);
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(swap);
    };
  }, []);

  // Live Paris clock.
  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const email = config.contactUrl.startsWith('mailto:')
    ? config.contactUrl.slice('mailto:'.length)
    : '';

  const handleContactClick = () => {
    const url = config.contactUrl;
    if (url.startsWith('mailto:') || url.startsWith('tel:')) window.location.href = url;
    else window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  const handleLinkClick = (url: string) => {
    if (url.startsWith('http')) window.open(url, '_blank', 'noopener,noreferrer');
    else window.location.href = url;
  };

  const cycleRole = () => {
    setVisible(true);
    setRoleIndex((p) => (p + 1) % ROLES.length);
  };

  // Magnetic pull on the contact button (skipped under reduced-motion).
  const onContactMove = (e: React.MouseEvent) => {
    const el = contactRef.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const onContactLeave = () => {
    if (contactRef.current) contactRef.current.style.transform = '';
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
      <main className="mt-10 grid flex-1 grid-cols-1 gap-y-12 md:mt-12 md:grid-cols-12 md:gap-x-10">
        {/* LEFT — identity, anchored to the bottom of the column */}
        <section className="flex flex-col md:col-span-7">
          <div className="flex items-center gap-4">
            <span className="motion-safe:transition-transform motion-safe:duration-700 motion-safe:hover:rotate-180">
              <Pinwheel className="h-10 w-10 text-bone md:h-12 md:w-12" />
            </span>
            <span className="text-[0.7rem] uppercase tracking-[0.18em] text-bone/50 md:text-xs">
              Studio
              <br />
              Personnel
            </span>
          </div>

          <div className="mt-auto pt-16">
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-bone/60 md:text-xs">
              Hello moi c&apos;est
            </p>

            {/* MARIUS — interactive Text Pressure (ReactBits), Archivo variable font */}
            <div aria-hidden="true" className="mt-3 aspect-[4/1] w-full">
              {enhanced ? (
                <TextPressure
                  text="Marius"
                  fontFamily="Archivo VF"
                  fontUrl="/fonts/archivo-var.woff2"
                  width={false}
                  weight
                  italic={false}
                  textColor="#E7E4D8"
                  minFontSize={48}
                />
              ) : (
                <span className="block font-black uppercase leading-[0.82] tracking-tight text-[clamp(3.5rem,12vw,10.5rem)]">
                  Marius
                </span>
              )}
            </div>

            {/* ROLE — auto-cycles; click to advance manually */}
            <button
              type="button"
              onClick={cycleRole}
              aria-label="Changer de rôle"
              className="group mt-5 block cursor-pointer text-left text-xl font-medium tracking-tight text-bone transition-opacity duration-300 md:text-3xl"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <span aria-hidden="true" className="inline-block text-bone/50 transition-transform group-hover:translate-x-1">
                ▸{' '}
              </span>
              <span aria-hidden="true">{ROLES[roleIndex]}</span>
            </button>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                ref={contactRef}
                type="button"
                onClick={handleContactClick}
                onMouseMove={onContactMove}
                onMouseLeave={onContactLeave}
                className="inline-flex items-center border border-bone bg-bone px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-burgundy transition-[colors,transform] duration-200 hover:bg-burgundy hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy"
              >
                Me contacter
              </button>

              {email && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[0.7rem] uppercase tracking-[0.18em] text-bone/60 transition-colors hover:text-bone focus-visible:text-bone focus-visible:outline-none md:text-xs"
                >
                  {copied ? 'Copié ✓' : 'Copier l’email'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT — portrait over the numbered link index */}
        <div className="flex flex-col gap-8 md:col-span-5">
          {/* PHOTO SLOT — replace the inner placeholder with:
              <img src="/images/portrait.jpg" alt="Marius" className="absolute inset-0 h-full w-full object-cover grayscale contrast-110" />
              (drop the file in public/images/, CSP already allows 'self') */}
          <figure className="group relative aspect-[4/5] w-full overflow-hidden border border-bone/30 bg-bone/5 md:aspect-auto md:min-h-[280px] md:flex-1">
            <figcaption className="absolute left-3 top-3 z-10 text-[0.65rem] uppercase tracking-[0.18em] text-bone/50">
              Fig. 01 — Portrait
            </figcaption>
            <span className="absolute inset-0 flex items-center justify-center text-[0.7rem] uppercase tracking-[0.22em] text-bone/35 transition-transform duration-500 motion-safe:group-hover:scale-110">
              Photo
            </span>
            <span aria-hidden="true" className="absolute inset-0">
              <span className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-bone/20" />
              <span className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-bone/20" />
            </span>
          </figure>

          <nav aria-label="Liens sociaux">
            <div className="mb-4 flex items-baseline justify-between text-[0.7rem] uppercase tracking-[0.18em] text-bone/60 md:text-xs">
              <span>Index</span>
              <span>({count})</span>
            </div>

            <ul className="border-t border-bone/20">
              {config.links.map((link, i) => {
                const handle = handleFor(link.url);
                return (
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
                      <span className="text-left text-[clamp(1.25rem,2.6vw,1.75rem)] font-medium">
                        {link.name.toUpperCase()}
                      </span>
                      <span className="ml-auto flex items-baseline gap-3">
                        {handle && (
                          <span className="hidden text-[0.7rem] normal-case tracking-normal text-bone/50 opacity-0 transition-opacity duration-200 group-hover:text-burgundy/70 group-hover:opacity-100 group-focus-visible:text-burgundy/70 group-focus-visible:opacity-100 sm:inline">
                            {handle}
                          </span>
                        )}
                        <span
                          aria-hidden="true"
                          className="text-bone/60 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-burgundy group-focus-visible:text-burgundy"
                        >
                          ↗
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </main>

      {/* FOOTER — spec block + live Paris clock */}
      <footer className="mt-12 grid grid-cols-1 gap-2 border-t border-bone/20 pt-5 text-[0.7rem] uppercase tracking-[0.18em] text-bone/60 md:grid-cols-2 md:text-xs">
        <p>Marius BC — Dev · Music · SysAdmin · DevOps</p>
        <p className="tabular-nums md:justify-self-end">
          France{clock ? ` — ${clock}` : ''}
        </p>
      </footer>
    </div>
  );
}
