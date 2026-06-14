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
const DEBUG = true;
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

  // Enable the interactive layers only with motion + after mount
  // (server + first paint render the static fallback → no hydration mismatch).
  useEffect(() => {
    if (!prefersReducedMotion()) setEnhanced(true);
  }, []);

  // MARIUS wordmark, centered. The tagline hangs absolutely below it so it never
  // pushes the wordmark off the vertical center of the screen.
  const centerCluster: ReactNode = (
    <div className="relative flex flex-col items-center text-center" style={dbg('#a855f7')}>
      <div aria-hidden="true" className="mx-auto aspect-[4/1] w-[min(88vw,46rem)]" style={dbg('#facc15')}>
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

      <div className="absolute left-1/2 top-full w-full max-w-2xl -translate-x-1/2 px-4" style={dbg('#ef4444')}>
        {enhanced ? (
          <div className="mx-auto mt-1 h-44 w-full font-sans font-medium md:h-60">
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
          <p className="mx-auto mt-1 max-w-2xl text-center text-lg font-medium md:text-2xl text-bone/80">{TAGLINE}</p>
        )}
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
            <ClickSpark sparkColor="#E7E4D8" sparkCount={10} sparkRadius={24}>
              {centerCluster}
            </ClickSpark>
          ) : (
            centerCluster
          )}
        </main>
      </div>
    </div>
  );
}
