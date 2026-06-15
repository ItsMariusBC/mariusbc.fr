import { getConfig } from '@/lib/config';
import { HomeContent } from '@/components/home-content';

// Read the config on every request so admin edits show up without a rebuild.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const config = await getConfig();
  return <HomeContent config={config} />;
}
