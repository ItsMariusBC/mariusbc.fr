'use client';

import { useState, useEffect, type ReactNode } from 'react';
import TextPressure from '@/components/text-pressure';
import FallingText from '@/components/falling-text';
import Noise from '@/components/noise';
import ClickSpark from '@/components/click-spark';
import ImageTrail from '@/components/image-trail';
import type { SiteConfig } from '@/lib/config';

const TAGLINE =
  'Développeur fullstack, DevOps et UI/UX — IT le jour, DJ le soir, rando en nature le week-end.';
const HIGHLIGHTS = ['fullstack', 'DevOps', 'UI/UX', 'DJ', 'rando'];

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
    <div className="relative flex flex-col items-center text-center">
      <div aria-hidden="true" className="mx-auto aspect-[4/1] w-[min(88vw,46rem)]">
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

      <div className="absolute left-1/2 top-full w-full max-w-2xl -translate-x-1/2 px-4">
        {enhanced ? (
          <div className="mx-auto mt-6 h-40 w-full md:h-56">
            <FallingText
              text={TAGLINE}
              highlightWords={HIGHLIGHTS}
              trigger="hover"
              backgroundColor="transparent"
              gravity={0.6}
              fontSize="clamp(0.85rem,1.6vw,1.1rem)"
            />
          </div>
        ) : (
          <p className="mx-auto mt-6 max-w-2xl text-center text-bone/80">{TAGLINE}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-burgundy text-bone">
      <h1 className="sr-only">Marius — Développeur, Musicien, SysAdmin</h1>

      {/* NOISE — subtle grain, non-interactive */}
      {enhanced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]">
          <Noise patternAlpha={14} />
        </div>
      )}

      {/* IMAGE TRAIL — admin image URLs trailing the cursor near the edges only.
          Listens on window; edge-band gated inside the component. Behind content
          (z-0) + pointer-events-none so it never blocks anything. */}
      {enhanced && config.images.length > 0 && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
          <ImageTrail items={config.images} variant={1} />
        </div>
      )}

      {/* CONTENT — MARIUS dead-center, nothing else */}
      <div className="relative z-10 flex min-h-screen flex-col p-6 md:p-10">
        <main className="flex flex-1 items-center justify-center">
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
