import type { SiteConfig } from '@/lib/config';

const SITE = 'https://mariusbc.fr';

// Structured data (schema.org) — helps Google connect every name variation and
// the Klysium / Clyse entities to one person, and surfaces the right result when
// people search the name, the company, or the services.
export function JsonLd({ config }: { config: SiteConfig }) {
  const sameAs = config.links
    .map((l) => l.url)
    .filter((u) => u.startsWith('http'));

  const graph = [
    {
      '@type': 'Person',
      '@id': `${SITE}/#marius`,
      name: 'Marius Bizière Couzinet',
      alternateName: [
        'Marius', 'Marius BC', 'Marius.BC',
        'Marius Bizière', 'Marius Biziere',
        'Marius Couzinet', 'Bizière', 'Biziere', 'Couzinet',
      ],
      url: SITE,
      jobTitle: 'Développeur Fullstack & DevOps · Ingénieur Web · UI/UX',
      description:
        'Développeur Fullstack & DevOps, ingénieur Web et UI/UX, freelance. Fondateur de Klysium (Clyse).',
      knowsAbout: [
        'Développement Fullstack', 'DevOps', 'Ingénierie Web', 'UI/UX Design',
        'UI', 'UX', 'IT', 'Design', 'Freelance', 'Next.js', 'React', 'TypeScript',
      ],
      worksFor: { '@id': `${SITE}/#klysium` },
      sameAs,
    },
    {
      '@type': 'Organization',
      '@id': `${SITE}/#klysium`,
      name: 'Klysium SAS',
      alternateName: ['Klysium', 'Clyse', 'Clyse Développement', 'Clyse Developpement'],
      url: SITE,
      founder: { '@id': `${SITE}/#marius` },
      sameAs,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'Marius Bizière Couzinet — Portfolio',
      inLanguage: 'fr-FR',
      publisher: { '@id': `${SITE}/#marius` },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
