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
function ProjectsHint() {
  return (
    <div className="pointer-events-none absolute left-4 top-4 z-20 text-bone/85 md:left-8 md:top-8">
      <style>{`@keyframes proj-bob{0%,100%{transform:translate(0,0)}50%{transform:translate(-5px,-5px)}}`}</style>
      <div className="relative h-[90px] w-[210px]">
        {/* word sits above the swoosh */}
        <span className="absolute left-[58px] top-[6px] text-lg tracking-[0.04em] md:text-xl">
          Projets
        </span>
        {/* ONE continuous hand-drawn stroke: underline → sweep left → arrow up-left */}
        <svg
          width="210"
          height="90"
          viewBox="0 0 210 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="absolute inset-0 overflow-visible motion-safe:[animation:proj-bob_2s_ease-in-out_infinite]"
        >
          <path d="M196 52 C 150 66, 92 66, 60 50 C 40 40, 28 28, 20 12" />
          <path d="M20 12 L34 15" />
          <path d="M20 12 L23 26" />
        </svg>
      </div>
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

  // MARIUS wordmark, centered. The tagline hangs absolutely below it so it never
  // pushes the wordmark off the vertical center of the screen.
  // Stop a click from reaching the ClickSpark wrapper → no spark on MARIUS / tagline.
  const noSpark = (e: React.MouseEvent) => e.stopPropagation();

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
            </div>
          ) : (
            centerCluster
          )}
        </main>
      </div>
    </div>
  );
}
