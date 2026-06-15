import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ICON_MAP } from '@/lib/dock-icons';
import defaultConfig from '@/config.default.json';

export type LinkItem = { id: string; name: string; icon: string; url: string; tooltip: string };
export type SiteConfig = { contactUrl: string; links: LinkItem[]; images: string[] };

const SAFE_SCHEMES = ['https:', 'http:', 'mailto:', 'tel:'];
const IMG_SCHEMES = ['https:', 'http:'];
const MAX_LINKS = 30;
const MAX_IMAGES = 12;
const LIMITS = { name: 100, tooltip: 200, url: 2000, id: 64 };

function isSafeUrl(value: string): boolean {
  try { return SAFE_SCHEMES.includes(new URL(value).protocol); } catch { return false; }
}

function str(value: unknown, max: number): string {
  if (typeof value !== 'string') throw new Error('expected string');
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) throw new Error('invalid string length');
  return trimmed;
}

export function validateConfig(input: unknown): SiteConfig {
  if (!input || typeof input !== 'object') throw new Error('invalid config');
  const obj = input as Record<string, unknown>;

  const contactUrl = str(obj.contactUrl, LIMITS.url);
  if (!isSafeUrl(contactUrl)) throw new Error('invalid contactUrl scheme');

  if (!Array.isArray(obj.links)) throw new Error('links must be an array');
  if (obj.links.length > MAX_LINKS) throw new Error('too many links');

  const links: LinkItem[] = obj.links.map((raw) => {
    if (!raw || typeof raw !== 'object') throw new Error('invalid link');
    const l = raw as Record<string, unknown>;
    const icon = str(l.icon, 50);
    if (!(icon in ICON_MAP)) throw new Error('unknown icon');
    const url = str(l.url, LIMITS.url);
    if (!isSafeUrl(url)) throw new Error('invalid link url scheme');
    return {
      id: str(l.id, LIMITS.id),
      name: str(l.name, LIMITS.name),
      icon,
      url,
      tooltip: str(l.tooltip, LIMITS.tooltip),
    };
  });

  const rawImages = obj.images ?? [];
  if (!Array.isArray(rawImages)) throw new Error('images must be an array');
  if (rawImages.length > MAX_IMAGES) throw new Error('too many images');
  const images: string[] = rawImages.map((v) => {
    const url = str(v, LIMITS.url);
    try {
      if (!IMG_SCHEMES.includes(new URL(url).protocol)) throw new Error('bad');
    } catch {
      throw new Error('invalid image url');
    }
    return url;
  });

  return { contactUrl, links, images };
}

function configPath(): string {
  if (process.env.CONFIG_PATH) return process.env.CONFIG_PATH;
  return process.env.NODE_ENV === 'production'
    ? '/app/data/config.json'
    : path.join(process.cwd(), 'data', 'config.json');
}

// Always read the file fresh — no in-memory cache. The data is tiny and reads
// are rare, and caching made saved changes appear stale until a restart.
export async function getConfig(): Promise<SiteConfig> {
  const file = configPath();
  try {
    const raw = await fs.readFile(file, 'utf8');
    return validateConfig(JSON.parse(raw));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[config] unreadable/corrupt config, falling back to default:', err);
    }
    const fallback = validateConfig(defaultConfig);
    await fs.mkdir(path.dirname(file), { recursive: true }).catch(() => {});
    await fs.writeFile(file, JSON.stringify(fallback, null, 2), 'utf8').catch(() => {});
    return fallback;
  }
}

export async function saveConfig(input: unknown): Promise<SiteConfig> {
  const valid = validateConfig(input);
  const file = configPath();
  const tmp = `${file}.tmp`;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(tmp, JSON.stringify(valid, null, 2), 'utf8');
  await fs.rename(tmp, file);
  return valid;
}
