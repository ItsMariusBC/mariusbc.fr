'use client';

import { useState, useEffect, type ReactNode } from 'react';
import TextPressure from '@/components/text-pressure';
import FallingText from '@/components/falling-text';
import Noise from '@/components/noise';
import ClickSpark from '@/components/click-spark';
import { InteractiveHoverButton } from '@/components/interactive-hover-button';
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

type Action = { label: string; onClick: () => void };

/**
 * Diagonal anchor descriptors for the desktop poster layout.
 * `pos` places the cell against the center box; `dir` is the inward bob
 * direction (toward MARIUS); `arrow` is the SVG path drawn pointing inward;
 * `stack` orders the arrow vs. the button so the arrow always sits between
 * the button and the wordmark.
 */
type Anchor = {
  pos: string;
  align: string;
  dir: 'br' | 'bl' | 'tr' | 'tl' | 'down' | 'up';
  arrow: 'br' | 'bl' | 'tr' | 'tl' | 'down' | 'up';
  stack: 'arrow-first' | 'button-first';
};

// Up to 6 slots: 4 corners, then top-center / bottom-center.
const ANCHORS: Anchor[] = [
  // ↖ top-left → arrow points down-right toward center
  {
    pos: 'left-0 top-[8%]',
    align: 'items-start',
    dir: 'br',
    arrow: 'br',
    stack: 'button-first',
  },
  // ↗ top-right → arrow points down-left toward center
  {
    pos: 'right-0 top-[8%]',
    align: 'items-end',
    dir: 'bl',
    arrow: 'bl',
    stack: 'button-first',
  },
  // ↙ bottom-left → arrow points up-right toward center
  {
    pos: 'left-0 bottom-[8%]',
    align: 'items-start',
    dir: 'tr',
    arrow: 'tr',
    stack: 'arrow-first',
  },
  // ↘ bottom-right → arrow points up-left toward center
  {
    pos: 'right-0 bottom-[8%]',
    align: 'items-end',
    dir: 'tl',
    arrow: 'tl',
    stack: 'arrow-first',
  },
  // top-center → arrow points down toward center
  {
    pos: 'left-1/2 top-0 -translate-x-1/2',
    align: 'items-center',
    dir: 'down',
    arrow: 'down',
    stack: 'button-first',
  },
  // bottom-center → arrow points up toward center
  {
    pos: 'left-1/2 bottom-0 -translate-x-1/2',
    align: 'items-center',
    dir: 'up',
    arrow: 'up',
    stack: 'arrow-first',
  },
];

const ARROW_PATHS: Record<Anchor['arrow'], string> = {
  br: 'M5 5 L19 19 M19 11 L19 19 L11 19',
  bl: 'M19 5 L5 19 M13 19 L5 19 L5 11',
  tr: 'M5 19 L19 5 M11 5 L19 5 L19 13',
  tl: 'M19 19 L5 5 M5 13 L5 5 L13 5',
  down: 'M12 4 L12 20 M5 13 L12 20 L19 13',
  up: 'M12 20 L12 4 M5 11 L12 4 L19 11',
};

function Arrow({ dir, name }: { dir: Anchor['dir']; name: Anchor['arrow'] }) {
  // The bob animation is applied via the `bob` utility class (gated on
  // motion-safe through the global stylesheet rule below) with a per-direction
  // CSS var, so the dynamic direction never needs a statically-detectable
  // Tailwind class.
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="bob h-7 w-7 text-bone/70"
      style={{ ['--bob' as string]: `bob-${dir}` }}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d={ARROW_PATHS[name]} />
    </svg>
  );
}

export function HomeContent({ config }: { config: SiteConfig }) {
  const [clock, setClock] = useState('');
  const [enhanced, setEnhanced] = useState(false);

  // Enable the interactive layers only with motion + after mount
  // (server + first paint render the static fallback → no hydration mismatch).
  useEffect(() => {
    if (!prefersReducedMotion()) setEnhanced(true);
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

  const handleContactClick = () => {
    const url = config.contactUrl;
    if (url.startsWith('mailto:') || url.startsWith('tel:')) window.location.href = url;
    else window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkClick = (url: string) => {
    if (url.startsWith('http')) window.open(url, '_blank', 'noopener,noreferrer');
    else window.location.href = url;
  };

  const actions: Action[] = [
    ...config.links.map((link) => ({
      label: link.name,
      onClick: () => handleLinkClick(link.url),
    })),
    { label: 'Contact', onClick: handleContactClick },
  ];

  // The centered wordmark + tagline. Kept as one node so it can be wrapped in
  // ClickSpark only when enhanced, without duplicating markup.
  const centerCluster: ReactNode = (
    <div className="flex flex-col items-center text-center">
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

      {enhanced ? (
        <div className="mx-auto mt-6 h-32 w-full max-w-2xl">
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
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-burgundy text-bone">
      {/* Directional bob keyframes for the inward-pointing arrows. Each travels
          a few px toward MARIUS, then eases back — purely decorative, motion-safe. */}
      <style>{`
        @keyframes bob-br { 0%,100% { transform: translate(0,0); opacity:.6 } 50% { transform: translate(4px,4px); opacity:1 } }
        @keyframes bob-bl { 0%,100% { transform: translate(0,0); opacity:.6 } 50% { transform: translate(-4px,4px); opacity:1 } }
        @keyframes bob-tr { 0%,100% { transform: translate(0,0); opacity:.6 } 50% { transform: translate(4px,-4px); opacity:1 } }
        @keyframes bob-tl { 0%,100% { transform: translate(0,0); opacity:.6 } 50% { transform: translate(-4px,-4px); opacity:1 } }
        @keyframes bob-down { 0%,100% { transform: translateY(0); opacity:.6 } 50% { transform: translateY(5px); opacity:1 } }
        @keyframes bob-up { 0%,100% { transform: translateY(0); opacity:.6 } 50% { transform: translateY(-5px); opacity:1 } }
        @media (prefers-reduced-motion: no-preference) {
          .bob { animation: var(--bob) 1.8s ease-in-out infinite; }
        }
      `}</style>

      <h1 className="sr-only">Marius — Développeur, Musicien, SysAdmin</h1>

      {/* NOISE — fixed-feel grain, kept subtle and non-interactive */}
      {enhanced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]">
          <Noise patternAlpha={14} />
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen flex-col p-6 md:p-10">
        {/* TOP META ROW */}
        <header className="grid grid-cols-3 items-baseline text-[0.7rem] uppercase tracking-[0.18em] md:text-xs">
          <span className="justify-self-start">Portfolio</span>
          <span className="justify-self-center text-center">@marius.bzc</span>
          <span className="justify-self-end">2026</span>
        </header>

        {/* CENTER — poster */}
        <main className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-5xl">
            {/* Wordmark + tagline, click-sparked when enhanced */}
            {enhanced ? (
              <ClickSpark sparkColor="#E7E4D8" sparkCount={10} sparkRadius={24}>
                {centerCluster}
              </ClickSpark>
            ) : (
              centerCluster
            )}

            {/* DESKTOP — arrows + buttons anchored around the cluster */}
            <div aria-hidden="false" className="hidden md:block">
              {actions.map((action, i) => {
                const anchor = ANCHORS[i % ANCHORS.length];
                const arrow = <Arrow dir={anchor.dir} name={anchor.arrow} />;
                const button = (
                  <InteractiveHoverButton onClick={action.onClick}>
                    {action.label}
                  </InteractiveHoverButton>
                );
                return (
                  <div
                    key={action.label}
                    className={`absolute z-20 flex flex-col gap-2 ${anchor.pos} ${anchor.align}`}
                  >
                    {anchor.stack === 'button-first' ? (
                      <>
                        {button}
                        {arrow}
                      </>
                    ) : (
                      <>
                        {arrow}
                        {button}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* MOBILE — collapse to a centered wrap row, no overlap, no arrows */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:hidden">
              {actions.map((action) => (
                <InteractiveHoverButton key={action.label} onClick={action.onClick}>
                  {action.label}
                </InteractiveHoverButton>
              ))}
            </div>
          </div>
        </main>

        {/* FOOTER — spec block + live Paris clock */}
        <footer className="mt-10 grid grid-cols-1 gap-2 border-t border-bone/20 pt-5 text-[0.7rem] uppercase tracking-[0.18em] text-bone/60 md:grid-cols-2 md:text-xs">
          <p>Marius BC — Dev · Music · SysAdmin · DevOps</p>
          <p className="tabular-nums md:justify-self-end">
            France{clock ? ` — ${clock}` : ''}
          </p>
        </footer>
      </div>
    </div>
  );
}
