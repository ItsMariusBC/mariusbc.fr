import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Marius - Portfolio',
  description: 'Portfolio personnel de Marius - Developpeur, Musicien, Passionne, SysAdmin, DevOps',
  metadataBase: new URL('https://mariusbc.fr'),
  openGraph: {
    title: 'Marius - Portfolio',
    description: 'Developpeur, Musicien, Passionne, SysAdmin, DevOps',
    url: 'https://mariusbc.fr',
    siteName: 'Marius Portfolio',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marius - Portfolio',
    description: 'Developpeur, Musicien, Passionne, SysAdmin, DevOps',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
