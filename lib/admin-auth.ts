import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function requireAdmin() {
  const session = await auth();

  if (!session) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (session.user?.role !== 'admin') {
    return {
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { session };
}
