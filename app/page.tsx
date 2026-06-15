import { getConfig } from '@/lib/config';
import { HomeContent } from '@/components/home-content';
import { JsonLd } from '@/components/json-ld';

// Read the config on every request so admin edits show up without a rebuild.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const config = await getConfig();
  return (
    <>
      <JsonLd config={config} />
      {/* Crawlable bio (visually hidden) — natural text for search engines */}
      <p className="sr-only">
        Marius Bizière Couzinet (Marius BC) — développeur fullstack &amp; DevOps,
        ingénieur Web et UI/UX, freelance IT. Fondateur de Clyse.
        Conception, développement et déploiement d&apos;applications web sur mesure.
      </p>
      <HomeContent config={config} />
    </>
  );
}
