import { getConfig } from '@/lib/config';
import { HomeContent } from '@/components/home-content';

export default async function Home() {
  const config = await getConfig();
  return <HomeContent config={config} />;
}
