'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Dock, DockIcon } from '@/components/magicui/dock';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { VideoText } from '@/components/magicui/video-text';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { HyperText } from '@/components/magicui/hyper-text';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { ICON_MAP } from '@/lib/dock-icons';
import type { DockIcon as DockIconType, SiteConfig } from '@prisma/client';

export default function Home() {
  const words = ["Développeur", "Musicien", "Passionné", "SysAdmin", "Créatif", "DevOps"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [key, setKey] = useState(0);
  const [dockIcons, setDockIcons] = useState<DockIconType[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      setKey((prevKey) => prevKey + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [iconsResponse, configResponse] = await Promise.all([
          fetch('/api/dock-icons'),
          fetch('/api/site-config')
        ]);
        
        const iconsData = await iconsResponse.json();
        const configData = await configResponse.json();
        
        setDockIcons(iconsData);
        setSiteConfig(configData);
      } catch (error) {
        console.error('Error loading site data:', error);
        // Fallback to default values
        setDockIcons([
          {
            id: '1',
            name: 'GitHub',
            iconName: 'Github',
            url: 'https://github.com/ItsMariusBC',
            tooltip: 'GitHub',
            order: 1,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            name: 'LinkedIn',
            iconName: 'Linkedin',
            url: 'https://www.linkedin.com/in/marius-biziere-couzinet-1054822b4/',
            tooltip: 'LinkedIn',
            order: 2,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        setSiteConfig({
          id: '1',
          contactButtonUrl: 'mailto:marius.bc@ik.me',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleContactClick = () => {
    // Fire-and-forget analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'contact', targetName: 'contact' })
    }).catch(() => {});

    // Execute the original click action
    if (siteConfig?.contactButtonUrl) {
      if (siteConfig.contactButtonUrl.startsWith('mailto:') || siteConfig.contactButtonUrl.startsWith('tel:')) {
        window.location.href = siteConfig.contactButtonUrl;
      } else {
        window.open(siteConfig.contactButtonUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex flex-col items-center justify-between p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_65%)]" />
        <div className="flex-1 flex items-center justify-center w-full max-w-4xl">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-24 w-80 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-10 w-40 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-12 w-48 bg-white/10 rounded-full animate-pulse mt-8" />
          </div>
        </div>
        <div className="flex gap-3 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex flex-col items-center justify-between p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_65%)]" />
      <h1 className="sr-only">Marius - Developpeur, Musicien, SysAdmin</h1>

      <main className="flex-1 flex items-center justify-center w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center">
          <SparklesText className="text-3xl font-normal whitespace-nowrap text-white/90 mb-4">
            Hello moi c&apos;est
          </SparklesText>
          
          <VideoText 
            src="/images/hero-bg.gif"
            fontSize={120}
            fontWeight={900}
            fontFamily="system-ui"
            textAnchor="middle"
            className="mb-4"
          >
            MARIUS
          </VideoText>
          
          <HyperText 
            key={key}
            className="text-white/90 text-4xl mb-12"
            duration={1200}
            delay={0}
            startOnView={true}
            animateOnHover={false}
          >
            {words[currentWordIndex]}
          </HyperText>

          <ShinyButton 
            className="text-lg px-8 py-3 font-semibold cursor-pointer" 
            style={{
              "--primary": "rgb(157, 122, 255)",
              "--glow-color": "rgba(157, 122, 255, 0.5)"
            } as React.CSSProperties}
            onClick={handleContactClick}
          >
            Me contacter
          </ShinyButton>
        </div>
      </main>

      <nav aria-label="Liens sociaux" className="fixed inset-x-0 bottom-4 z-10 flex justify-center px-4">
      <TooltipProvider>
        <Dock>
          {dockIcons.map((icon) => {
            const IconComponent = ICON_MAP[icon.iconName] || Mail;
            
            const handleDockIconClick = () => {
              // Fire-and-forget analytics
              fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'dock_icon', targetId: icon.id, targetName: icon.name })
              }).catch(() => {});

              // Continue with normal navigation
              if (icon.url.startsWith('http')) {
                window.open(icon.url, '_blank', 'noopener,noreferrer');
              } else {
                window.location.href = icon.url;
              }
            };
            
            return (
              <DockIcon key={icon.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleDockIconClick}
                      aria-label={icon.tooltip}
                      className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-2xl transition-colors duration-200 backdrop-blur-md border border-white/20"
                    >
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
