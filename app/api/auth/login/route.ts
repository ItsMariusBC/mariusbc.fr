import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, signSession, SESSION_COOKIE } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (!rateLimit(`login:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
  }
  let password = '';
  try { password = (await req.json())?.password ?? ''; } catch { /* ignore */ }
  if (!password || !(await checkPassword(password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await signSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
