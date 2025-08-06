'use client';

import { useState, useEffect } from 'react';
import { 
  Github,
  Linkedin,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Twitch,
  MessageCircle,
  Music,
  Globe,
  Download,
  Code,
  Briefcase,
  User,
  MapPin,
  Calendar,
  Camera,
  Video,
  Gamepad2,
  Coffee,
  Heart,
  Star,
  Award,
  BookOpen,
  Headphones,
  Terminal,
  Cpu,
  Palette,
  Zap,
  Shield,
  Lock,
  Key,
  Database,
  Server,
  Cloud,
  Rocket
} from 'lucide-react';
import { Dock, DockIcon } from '@/components/magicui/dock';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { VideoText } from '@/components/magicui/video-text';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { HyperText } from '@/components/magicui/hyper-text';
import { ShinyButton } from '@/components/magicui/shiny-button';
import type { DockIcon as DockIconType, SiteConfig } from '@prisma/client';

// Icon mapping pour les icônes Lucide
const IconMap: Record<string, React.ComponentType<any>> = {
  Github,
  Linkedin,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Twitch,
  MessageCircle,
  Music,
  Globe,
  Download,
  Code,
  Briefcase,
  User,
  MapPin,
  Calendar,
  Camera,
  Video,
  Gamepad2,
  Coffee,
  Heart,
  Star,
  Award,
  BookOpen,
  Headphones,
  Terminal,
  Cpu,
  Palette,
  Zap,
  Shield,
  Lock,
  Key,
  Database,
  Server,
  Cloud,
  Rocket,
};

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
      <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex items-center justify-center">
        <div className="text-white/90 text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex flex-col items-center justify-between p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_65%)]" />
      
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center">
          <SparklesText className="text-3xl font-normal whitespace-nowrap text-white/90 mb-4">
            Hello moi c&apos;est
          </SparklesText>
          
          <VideoText 
            src="https://i.pinimg.com/originals/e1/8c/1b/e18c1bad870b18e5c8eff03c75aaf40c.gif"
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
      </div>

      <TooltipProvider>
        <Dock>
          {dockIcons.map((icon) => {
            const IconComponent = IconMap[icon.iconName] || Mail;
            return (
              <DockIcon key={icon.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={icon.url}
                      target={icon.url.startsWith('http') ? '_blank' : '_self'}
                      rel={icon.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-2xl transition-colors duration-200 backdrop-blur-md border border-white/20"
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
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
    </div>
  );
}