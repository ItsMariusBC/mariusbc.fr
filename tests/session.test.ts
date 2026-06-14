import { describe, it, expect, beforeAll } from 'vitest';
import { signSession, verifySessionToken, checkPassword } from '@/lib/session';

beforeAll(() => { process.env.AUTH_SECRET = 'test-secret-test-secret-test-secret'; });

describe('session token', () => {
  it('verifies a token it signed', async () => {
    expect(await verifySessionToken(await signSession())).toBe(true);
  });
  it('rejects missing token', async () => {
    expect(await verifySessionToken(undefined)).toBe(false);
  });
  it('rejects a tampered token', async () => {
    const t = await signSession();
    expect(await verifySessionToken(t.slice(0, -2) + 'xx')).toBe(false);
  });
});

describe('checkPassword', () => {
  it('rejects oversized password without throwing', async () => {
    process.env.ADMIN_PASSWORD_HASH = '$2b$12$abcdefghijklmnopqrstuv';
    expect(await checkPassword('x'.repeat(2000))).toBe(false);
  });
  it('rejects empty password', async () => {
    expect(await checkPassword('')).toBe(false);
  });
});
