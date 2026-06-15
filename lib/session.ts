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

// Admin bcrypt hash, provided base64-encoded (ADMIN_PASSWORD_HASH_B64). Base64
// has no `$`, so it survives env/interpolation (Docker/Dokploy) that would
// otherwise mangle a raw `$2b$12$...` hash. Generate with `npm run gen:password`.
function adminHash(): string {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (!b64) return '';
  return Buffer.from(b64.trim(), 'base64').toString('utf8').trim();
}

export async function checkPassword(plain: string): Promise<boolean> {
  if (typeof plain !== 'string' || plain.length === 0 || plain.length > 1000) return false;
  const hash = adminHash();
  if (!hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    // malformed hash (e.g. `$` eaten by interpolation) → treat as no-match
    return false;
  }
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
