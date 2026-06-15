import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { saveConfig } from '@/lib/config';
import { getPostHogClient } from '@/lib/posthog-server';

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  try {
    const saved = await saveConfig(body);
    getPostHogClient().capture({
      distinctId: 'admin',
      event: 'config_saved',
      properties: { links_count: saved.links.length, images_count: saved.images.length },
    });
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: 'Invalid config' }, { status: 400 });
  }
}
