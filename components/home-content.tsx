'use client';

import { useState, useEffect, type CSSProperties, type ReactNode } from 'react';
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

// Top-left annotation inside the clear zone: "Projets" + a hand-drawn arrow that
// sweeps underneath and points out toward the margins (the noise/trail zone),
// inviting the visitor to move the cursor there to reveal project screenshots.
// Clean, geometric Swiss-style hint: uppercase label + a straight underline that
// turns and points up-left toward the margin (the image-trail zone).
// Clean geometric hint: a straight diagonal arrow pointing up-left toward the
// margin, with the label underlined via border-b so the line matches the text
// width exactly and stays aligned.
function ProjectsHint() {
  return (
    <div className="pointer-events-none absolute left-6 top-6 z-20 flex items-end gap-2 text-bone/80 md:left-10 md:top-10">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
        className="overflow-visible"
      >
        <path d="M36 36 L6 6" />
        <path d="M6 6 L19 7" />
        <path d="M6 6 L7 19" />
      </svg>
      <span className="border-b border-bone/50 pb-1.5 text-xs uppercase leading-none tracking-[0.2em]">
        Projets
      </span>
    </div>
  );
}

export function HomeContent({ config }: { config: SiteConfig }) {
  const [enhanced, setEnhanced] = useState(false);

  // Enable the interactive layers only with motion + after mount
  // (server + first paint render the static fallback → no hydration mismatch).
  useEffect(() => {
    if (!prefersReducedMotion()) setEnhanced(true);
  }, []);

  // Stop a click from reaching the ClickSpark wrapper → no spark on these.
  const noSpark = (e: React.MouseEvent) => e.stopPropagation();

  const handleContactClick = () => {
    const url = config.contactUrl;
    if (url.startsWith('mailto:') || url.startsWith('tel:')) window.location.href = url;
    else window.open(url, '_blank', 'noopener,noreferrer');
  };
  const handleLinkClick = (url: string) => {
    if (url.startsWith('http')) window.open(url, '_blank', 'noopener,noreferrer');
    else window.location.href = url;
  };
  // MARIUS wordmark, centered.

  const centerCluster: ReactNode = (
    <div className="flex h-full w-full items-center justify-center text-center">
      {/* MARIUS + tagline as ONE in-flow block, centered together */}
      <div className="flex flex-col items-center" style={dbg('#a855f7')}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div aria-hidden="true" onClick={noSpark} className="aspect-[4/1] w-[min(88vw,46rem)]" style={dbg('#facc15')}>
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
        <div onClick={noSpark} className="w-full max-w-2xl px-4" style={dbg('#ef4444')}>
          {enhanced ? (
            <div className="mx-auto -mt-8 h-28 w-full font-sans font-medium md:-mt-10 md:h-36">
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
    <div className="relative min-h-screen overflow-hidden bg-burgundy text-bone">
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
      <div className="relative z-10 flex min-h-screen flex-col p-6 md:p-10" style={dbg('#ec4899')}>
        <main className="flex flex-1 items-center justify-center" style={dbg('#22d3ee')}>
          {enhanced ? (
            // Spark area = the center clear zone (72vw x 80vh). Margins (noise/trail
            // zone) sit outside it → no spark there. MARIUS + tagline stopPropagation
            // → no spark on them either.
            <div className="relative h-[80vh] w-[72vw]">
              <ClickSpark sparkColor="#E7E4D8" sparkCount={10} sparkRadius={24}>
                {centerCluster}
              </ClickSpark>
              <ProjectsHint />

              {/* Link buttons — big bold text-links, bottom-left */}
              <nav aria-label="Liens" className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-4 px-4 md:bottom-10">
                {/* Contact — prominent filled button, on top */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleContactClick(); }}
                  className="border border-bone bg-bone px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-burgundy transition-colors hover:bg-burgundy hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy"
                >
                  Contact
                </button>

                {/* Social links — bold text-links row, below */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                  {config.links.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleLinkClick(l.url); }}
                      className="text-2xl font-black uppercase leading-tight tracking-tight text-bone/45 transition-colors hover:text-bone focus-visible:text-bone focus-visible:outline-none md:text-3xl"
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
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
