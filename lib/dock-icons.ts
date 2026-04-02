import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Camera,
  Cloud,
  Code,
  Coffee,
  Cpu,
  Database,
  Download,
  Facebook,
  FileText,
  Gamepad2,
  Github,
  Globe,
  Headphones,
  Heart,
  Instagram,
  Key,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Music,
  Palette,
  Phone,
  Rocket,
  Server,
  Shield,
  Star,
  Terminal,
  Twitch,
  Twitter,
  User,
  Video,
  Youtube,
  Zap,
} from 'lucide-react';

const SAFE_URL_SCHEMES = ['https:', 'http:', 'mailto:', 'tel:'] as const;
const TEXT_LIMITS = {
  name: 100,
  iconName: 50,
  url: 2000,
  tooltip: 200,
} as const;

export const ICON_MAP: Record<string, LucideIcon> = {
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

export const ICON_OPTIONS = [
  { name: 'Github', component: Github, label: 'GitHub' },
  { name: 'Linkedin', component: Linkedin, label: 'LinkedIn' },
  { name: 'FileText', component: FileText, label: 'CV/Resume' },
  { name: 'MessageSquare', component: MessageSquare, label: 'Discord' },
  { name: 'Mail', component: Mail, label: 'Email' },
  { name: 'Phone', component: Phone, label: 'Telephone' },
  { name: 'Instagram', component: Instagram, label: 'Instagram' },
  { name: 'Twitter', component: Twitter, label: 'Twitter/X' },
  { name: 'Facebook', component: Facebook, label: 'Facebook' },
  { name: 'Youtube', component: Youtube, label: 'YouTube' },
  { name: 'Twitch', component: Twitch, label: 'Twitch' },
  { name: 'MessageCircle', component: MessageCircle, label: 'WhatsApp' },
  { name: 'Music', component: Music, label: 'Spotify/Music' },
  { name: 'Globe', component: Globe, label: 'Site Web' },
  { name: 'Download', component: Download, label: 'Telechargement' },
  { name: 'Code', component: Code, label: 'Code/Dev' },
  { name: 'Briefcase', component: Briefcase, label: 'Portfolio' },
  { name: 'User', component: User, label: 'Profil' },
  { name: 'MapPin', component: MapPin, label: 'Localisation' },
  { name: 'Calendar', component: Calendar, label: 'Calendrier' },
  { name: 'Camera', component: Camera, label: 'Photos' },
  { name: 'Video', component: Video, label: 'Videos' },
  { name: 'Gamepad2', component: Gamepad2, label: 'Gaming' },
  { name: 'Coffee', component: Coffee, label: 'Blog/Cafe' },
  { name: 'Heart', component: Heart, label: 'Favoris' },
  { name: 'Star', component: Star, label: 'Etoiles' },
  { name: 'Award', component: Award, label: 'Recompenses' },
  { name: 'BookOpen', component: BookOpen, label: 'Lecture/Blog' },
  { name: 'Headphones', component: Headphones, label: 'Audio/Podcast' },
  { name: 'Terminal', component: Terminal, label: 'Terminal/CLI' },
  { name: 'Cpu', component: Cpu, label: 'Tech/Hardware' },
  { name: 'Palette', component: Palette, label: 'Design/Art' },
  { name: 'Zap', component: Zap, label: 'Energie/Rapide' },
  { name: 'Shield', component: Shield, label: 'Securite' },
  { name: 'Lock', component: Lock, label: 'Prive/Securise' },
  { name: 'Key', component: Key, label: 'Acces/Cle' },
  { name: 'Database', component: Database, label: 'Base de donnees' },
  { name: 'Server', component: Server, label: 'Serveur' },
  { name: 'Cloud', component: Cloud, label: 'Cloud' },
  { name: 'Rocket', component: Rocket, label: 'Lancement/Startup' },
];

const ALLOWED_ICON_NAMES = new Set(ICON_OPTIONS.map((icon) => icon.name));

type ValidationResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: string };

type DockIconPayload = {
  name: string;
  iconName: string;
  url: string;
  tooltip: string;
  order?: number;
  isActive?: boolean;
};

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateUrl(url: string) {
  try {
    const parsed = new URL(url);
    return SAFE_URL_SCHEMES.includes(parsed.protocol as (typeof SAFE_URL_SCHEMES)[number]);
  } catch {
    return false;
  }
}

export function validateDockIconInput(
  input: unknown,
  options: { partial?: boolean } = {}
): ValidationResult<Partial<DockIconPayload>> {
  if (!input || typeof input !== 'object') {
    return { error: 'Invalid request body' };
  }

  const partial = options.partial === true;
  const body = input as Record<string, unknown>;
  const data: Partial<DockIconPayload> = {};

  const stringFields = [
    ['name', TEXT_LIMITS.name],
    ['iconName', TEXT_LIMITS.iconName],
    ['url', TEXT_LIMITS.url],
    ['tooltip', TEXT_LIMITS.tooltip],
  ] as const;

  for (const [field, maxLength] of stringFields) {
    const rawValue = body[field];

    if (rawValue === undefined) {
      if (!partial) {
        return { error: `Missing required field: ${field}` };
      }
      continue;
    }

    const value = normalizeString(rawValue);
    if (!value) {
      return { error: `Invalid ${field}` };
    }

    if (value.length > maxLength) {
      return { error: `${field} exceeds maximum length` };
    }

    data[field] = value;
  }

  if (data.iconName && !ALLOWED_ICON_NAMES.has(data.iconName)) {
    return { error: 'Unsupported icon name' };
  }

  if (data.url && !validateUrl(data.url)) {
    return { error: 'Invalid URL scheme. Use https, http, mailto, or tel.' };
  }

  if (body.order !== undefined) {
    if (!Number.isInteger(body.order) || Number(body.order) < 0) {
      return { error: 'Invalid order value' };
    }
    data.order = Number(body.order);
  }

  if (body.isActive !== undefined) {
    if (typeof body.isActive !== 'boolean') {
      return { error: 'Invalid isActive value' };
    }
    data.isActive = body.isActive;
  }

  return { data };
}
