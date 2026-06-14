import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { saveConfig } from '@/lib/config';

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  try {
    const saved = await saveConfig(body);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: 'Invalid config' }, { status: 400 });
  }
}
