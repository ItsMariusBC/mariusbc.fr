import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import type { NextRequest } from 'next/server';

export const SESSION_COOKIE = 'session';

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error('AUTH_SECRET is required');
  return new TextEncoder().encode(value);
}

export async function signSession(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function checkPassword(plain: string): Promise<boolean> {
  if (typeof plain !== 'string' || plain.length === 0 || plain.length > 1000) return false;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

// For API route handlers (read cookie off the request).
export async function requireAdmin(req: NextRequest): Promise<boolean> {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

// For server components (read cookie off the request store).
export async function isAuthenticated(): Promise<boolean> {
  const { cookies } = await import('next/headers');
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
