import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/session';
import { getConfig } from '@/lib/config';
import { DashboardEditor } from '@/components/dashboard-editor';

export default async function Dashboard() {
  if (!(await isAuthenticated())) redirect('/admin');
  const config = await getConfig();
  return <DashboardEditor initial={config} />;
}
