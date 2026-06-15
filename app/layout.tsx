import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-archivo',
  display: 'swap',
})

const TITLE = 'Marius Bizière Couzinet — Développeur Fullstack & DevOps · UI/UX';
const DESCRIPTION =
  'Marius Bizière Couzinet (Marius BC) — développeur fullstack & DevOps, ingénieur Web et UI/UX, freelance. Fondateur de Clyse.';
// Embed (X / Discord / …): name spelled without accent — "Biziere" — to match the brand.
const EMBED_TITLE = 'Marius Biziere Couzinet — Développeur Fullstack & DevOps · UI/UX';
const EMBED_NAME = 'Marius Biziere Couzinet';
// Embed description = the site tagline
const TAGLINE = 'Développeur fullstack & DevOps, ingénieur UI/UX — IT de bout en bout.';
const COVER = { url: '/imgs/embed/cover.png', width: 814, height: 291, alt: EMBED_TITLE };

export const metadata: Metadata = {
  metadataBase: new URL('https://mariusbc.fr'),
  title: {
    default: TITLE,
    template: '%s · Marius Bizière Couzinet',
  },
  description: DESCRIPTION,
  applicationName: 'mariusbc.fr',
  authors: [{ name: 'Marius Bizière Couzinet', url: 'https://mariusbc.fr' }],
  creator: 'Marius Bizière Couzinet',
  publisher: 'Clyse',
  category: 'technology',
  keywords: [
    'Marius', 'Marius BC', 'Marius.BC', 'Marius Bizière Couzinet', 'Marius Biziere Couzinet',
    'Marius Bizière', 'Marius Biziere', 'Marius Couzinet', 'Bizière', 'Biziere', 'Couzinet',
    'Clyse', 'Clyse Développement', 'Clyse Developpement', 'Klysium', 'Klysium SAS',
    'Développeur Fullstack', 'Developpeur Fullstack', 'Développeur Freelance', 'Freelance',
    'Ingénieur Web', 'Ingenieur Web', 'UI/UX', 'UI', 'UX', 'Design', 'DevOps', 'IT',
    'Next.js', 'React', 'TypeScript', 'Portfolio', 'mariusbc.fr', 'LinkedIn',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://mariusbc.fr',
    siteName: EMBED_NAME,
    title: EMBED_TITLE,
    description: TAGLINE,
    images: [COVER],
  },
  twitter: {
    card: 'summary_large_image',
    title: EMBED_TITLE,
    description: TAGLINE,
    images: [COVER.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={archivo.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}
