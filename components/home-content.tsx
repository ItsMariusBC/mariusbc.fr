'use client';

import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap } from 'gsap';
import posthog from 'posthog-js';
import TextPressure from '@/components/text-pressure';
import FallingText from '@/components/falling-text';
import Noise from '@/components/noise';
import ClickSpark from '@/components/click-spark';
import ImageTrail from '@/components/image-trail';
import type { SiteConfig } from '@/lib/config';


const TAGLINE =
  'Développeur fullstack & DevOps, ingénieur UI/UX — IT de bout en bout.';
const HIGHLIGHTS = ['fullstack', 'DevOps', 'UI/UX', 'IT'];

// DEBUG: outline every layer in a distinct color + draw the image-trail clear
// zone + show a legend. Set to false to remove all debug visuals.
const DEBUG = false;
const dbg = (color: string): CSSProperties | undefined =>
  DEBUG ? { outline: `2px solid ${color}`, outlineOffset: '-2px' } : undefined;

// Color legend (kept in sync with the outlines below).
const LEGEND: [string, string][] = [
  ['#a3e635', 'Clear zone — no trail inside'],
  ['#f97316', 'Image trail layer (full screen)'],
  ['#3b82f6', 'Noise layer (full screen)'],
  ['#ec4899', 'Content padding box'],
  ['#22d3ee', 'Main (centering area)'],
  ['#a855f7', 'Center cluster (MARIUS + tagline)'],
  ['#facc15', 'MARIUS box'],
  ['#ef4444', 'Tagline box'],
];

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}


export function HomeContent({ config }: { config: SiteConfig }) {
  const [enhanced, setEnhanced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Enable the interactive layers only with motion + after mount
  // (server + first paint render the static fallback → no hydration mismatch).
  useEffect(() => {
    if (!prefersReducedMotion()) setEnhanced(true);
  }, []);

  // Harmonized GSAP entry — one timeline, single ease, fade + rise + stagger.
  // Runs once the enhanced subtree is mounted; skipped under reduced-motion.
  useEffect(() => {
    if (!enhanced) return;
    const ctx = gsap.context(() => {
      // clearProps removes gsap's inline styles when each tween finishes, so the
      // end state is the natural (visible) layout — never stuck hidden.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8, clearProps: 'opacity,transform' } });
      tl.from('[data-reveal="marius"]', { opacity: 0, y: 28 })
        .from('[data-reveal="tagline"]', { opacity: 0, y: 18 }, '-=0.5')
        .from('[data-reveal="cta"]', { opacity: 0 }, '-=0.45')
        .from('[data-reveal="link"]', { opacity: 0, y: 14, stagger: 0.08 }, '-=0.45');
    }, rootRef);

    // Failsafe (real timer, independent of gsap's ticker): if the timeline ever
    // stalls, force every revealed element back to its natural visible state.
    const safety = setTimeout(() => {
      rootRef.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.visibility = '';
      });
    }, 2500);

    return () => {
      clearTimeout(safety);
      ctx.revert();
    };
  }, [enhanced]);

  // Stop a click from reaching the ClickSpark wrapper → no spark on these.
  const noSpark = (e: React.MouseEvent) => e.stopPropagation();

  const handleContactClick = () => {
    const url = config.contactUrl;
    posthog.capture('contact_clicked', { contact_url: url });
    if (url.startsWith('mailto:') || url.startsWith('tel:')) window.location.href = url;
    else window.open(url, '_blank', 'noopener,noreferrer');
  };
  const handleLinkClick = (url: string, name: string) => {
    posthog.capture('link_clicked', { link_name: name, link_url: url });
    if (url.startsWith('http')) window.open(url, '_blank', 'noopener,noreferrer');
    else window.location.href = url;
  };
  // MARIUS wordmark, centered.

  const centerCluster: ReactNode = (
    <div className="flex h-full w-full items-center justify-center text-center">
      {/* MARIUS + tagline as ONE in-flow block, centered together */}
      <div className="flex flex-col items-center" style={dbg('#a855f7')}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div data-reveal="marius" aria-hidden="true" onClick={noSpark} className="aspect-[4/1] w-[min(88vw,46rem)]" style={dbg('#facc15')}>
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
            <span className="block text-center font-black uppercase leading-[0.82] tracking-tight text-[clamp(3.5rem,12vw,9rem)]">
              Marius
            </span>
          )}
        </div>

        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div data-reveal="tagline" onClick={noSpark} className="w-full max-w-2xl px-4" style={dbg('#ef4444')}>
          {enhanced ? (
            <div className="mx-auto -mt-4 h-24 w-full font-sans font-medium md:-mt-10 md:h-36">
              <FallingText
                text={TAGLINE}
                highlightWords={HIGHLIGHTS}
                trigger="hover"
                backgroundColor="transparent"
                gravity={0.6}
                fontSize="clamp(1.15rem,2.4vw,1.75rem)"
              />
            </div>
          ) : (
            <p className="mx-auto -mt-6 max-w-2xl text-center text-lg font-medium md:text-2xl text-bone/80">{TAGLINE}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className="relative min-h-[100svh] overflow-hidden bg-burgundy text-bone">
      <h1 className="sr-only">Marius — Développeur, Musicien, SysAdmin</h1>

      {/* DEBUG overlays */}
      {DEBUG && (
        <>
          {/* image-trail clear zone (72% x 80%, centered) — trail spawns OUTSIDE */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed left-1/2 top-1/2 z-50 h-[80%] w-[72%] -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-lime-400"
          >
            <span className="absolute left-1 top-1 bg-lime-400 px-1 text-[10px] font-bold text-black">
              CLEAR ZONE — trail outside
            </span>
          </div>

          {/* color legend */}
          <div className="pointer-events-none fixed bottom-2 left-2 z-50 space-y-1 bg-black/70 p-2 text-[10px] text-white">
            {LEGEND.map(([color, label]) => (
              <div key={color} className="flex items-center gap-2">
                <span className="inline-block h-2 w-4" style={{ backgroundColor: color }} />
                {label}
              </div>
            ))}
          </div>
        </>
      )}

      {/* NOISE — bone grain, full screen but masked to the OUTSIDE zone only */}
      {enhanced && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-[0.7]" style={dbg('#3b82f6')}>
            <Noise patternAlpha={50} />
          </div>
          {/* mask: burgundy rectangle over the center (same 72%x80% clear zone)
              → hides the noise inside the box, leaving it only in the margins */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed left-1/2 top-1/2 z-0 h-[80%] w-[72%] -translate-x-1/2 -translate-y-1/2 bg-burgundy"
          />
        </>
      )}

      {/* IMAGE TRAIL — admin image URLs trailing the cursor outside the clear zone.
          Listens on window; gated inside the component. Behind content (z-0) +
          pointer-events-none so it never blocks anything. */}
      {enhanced && config.images.length > 0 && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" style={dbg('#f97316')}>
          <ImageTrail items={config.images} variant={1} />
        </div>
      )}

      {/* CONTENT — MARIUS dead-center, nothing else */}
      <div className="relative z-10 flex min-h-[100svh] flex-col p-4 md:p-10" style={dbg('#ec4899')}>
        <main className="flex flex-1 items-center justify-center" style={dbg('#22d3ee')}>
          {enhanced ? (
            // Spark area = the center clear zone. Margins (noise/trail zone) sit
            // outside it → no spark there. MARIUS + tagline stopPropagation → no
            // spark on them either. Wider on phones so nothing feels cramped.
            <div className="relative h-[82svh] w-[92vw] max-w-5xl md:h-[80vh] md:w-[72vw]">
              <ClickSpark sparkColor="#E7E4D8" sparkCount={10} sparkRadius={24}>
                {centerCluster}
              </ClickSpark>

              {/* Contact — CTA: solid bone block (the DA accent), inverts on hover */}
              <button
                data-reveal="cta"
                type="button"
                onClick={(e) => { e.stopPropagation(); handleContactClick(); }}
                className="absolute left-1/2 top-[72%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border border-bone bg-bone px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-burgundy transition-colors duration-300 hover:bg-burgundy hover:text-bone focus-visible:bg-burgundy focus-visible:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-4 focus-visible:ring-offset-burgundy md:top-[74%] md:px-12 md:py-4 md:text-sm md:tracking-[0.25em]"
              >
                Prendre RDV
              </button>

              {/* Social links — bold text-links row, bottom-center */}
              <nav aria-label="Liens" className="absolute inset-x-0 bottom-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-2 sm:gap-x-8 md:bottom-10">
                {config.links.map((l) => (
                  <button
                    key={l.id}
                    data-reveal="link"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleLinkClick(l.url, l.name); }}
                    className="text-lg font-black uppercase leading-tight tracking-tight text-bone/45 transition-colors hover:text-bone focus-visible:text-bone focus-visible:outline-none sm:text-2xl md:text-3xl"
                  >
                    {l.name}
                  </button>
                ))}
              </nav>
            </div>
          ) : (
            centerCluster
          )}
        </main>
      </div>
    </div>
  );
}
