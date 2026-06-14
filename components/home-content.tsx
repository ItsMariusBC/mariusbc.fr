'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Dock, DockIcon } from '@/components/magicui/dock';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { VideoText } from '@/components/magicui/video-text';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { HyperText } from '@/components/magicui/hyper-text';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { ICON_MAP } from '@/lib/dock-icons';
import type { SiteConfig } from '@/lib/config';

export function HomeContent({ config }: { config: SiteConfig }) {
  const words = ['Développeur', 'Musicien', 'Passionné', 'SysAdmin', 'Créatif', 'DevOps'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((p) => (p + 1) % words.length);
      setKey((k) => k + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  const handleContactClick = () => {
    const url = config.contactUrl;
    if (url.startsWith('mailto:') || url.startsWith('tel:')) window.location.href = url;
    else window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex flex-col items-center justify-between p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_65%)]" />
      <h1 className="sr-only">Marius - Developpeur, Musicien, SysAdmin</h1>

      <main className="flex-1 flex items-center justify-center w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center">
          <SparklesText className="text-3xl font-normal whitespace-nowrap text-white/90 mb-4">
            Hello moi c&apos;est
          </SparklesText>

          <VideoText src="/images/hero-bg.gif" fontSize={120} fontWeight={900} fontFamily="system-ui" textAnchor="middle" className="mb-4">
            MARIUS
          </VideoText>

          <HyperText key={key} className="text-white/90 text-4xl mb-12" duration={1200} delay={0} startOnView animateOnHover={false}>
            {words[currentWordIndex]}
          </HyperText>

          <ShinyButton
            className="text-lg px-8 py-3 font-semibold cursor-pointer"
            style={{ '--primary': 'rgb(157, 122, 255)', '--glow-color': 'rgba(157, 122, 255, 0.5)' } as React.CSSProperties}
            onClick={handleContactClick}
          >
            Me contacter
          </ShinyButton>
        </div>
      </main>

      <nav aria-label="Liens sociaux" className="fixed inset-x-0 bottom-4 z-10 flex justify-center px-4">
        <TooltipProvider>
          <Dock>
            {config.links.map((icon) => {
              const IconComponent = ICON_MAP[icon.icon] || Mail;
              const onClick = () => {
                if (icon.url.startsWith('http')) window.open(icon.url, '_blank', 'noopener,noreferrer');
                else window.location.href = icon.url;
              };
              return (
                <DockIcon key={icon.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={onClick} aria-label={icon.tooltip} className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-2xl transition-colors duration-200 backdrop-blur-md border border-white/20">
                        <IconComponent className="w-6 h-6" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-lg">
                      <p>{icon.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              );
            })}
          </Dock>
        </TooltipProvider>
      </nav>
    </div>
  );
}
