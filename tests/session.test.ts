import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { signSession, verifySessionToken, checkPassword } from '@/lib/session';

beforeAll(() => { process.env.AUTH_SECRET = 'test-secret-test-secret-test-secret'; });
afterEach(() => { delete process.env.ADMIN_PASSWORD_HASH; delete process.env.ADMIN_PASSWORD_HASH_B64; });

const HASH = bcrypt.hashSync('s3cret-pw', 12);

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

const B64 = Buffer.from(HASH, 'utf8').toString('base64');

describe('checkPassword (base64 hash)', () => {
  it('matches the correct password, rejects a wrong one', async () => {
    process.env.ADMIN_PASSWORD_HASH_B64 = B64;
    expect(await checkPassword('s3cret-pw')).toBe(true);
    expect(await checkPassword('wrong')).toBe(false);
  });
  it('tolerates surrounding whitespace (copy-paste)', async () => {
    process.env.ADMIN_PASSWORD_HASH_B64 = `  ${B64}\n`;
    expect(await checkPassword('s3cret-pw')).toBe(true);
  });
  it('rejects empty password', async () => {
    process.env.ADMIN_PASSWORD_HASH_B64 = B64;
    expect(await checkPassword('')).toBe(false);
  });
  it('rejects oversized password without throwing', async () => {
    process.env.ADMIN_PASSWORD_HASH_B64 = B64;
    expect(await checkPassword('x'.repeat(2000))).toBe(false);
  });
  it('returns false (no throw) when no hash is set', async () => {
    expect(await checkPassword('s3cret-pw')).toBe(false);
  });
  it('returns false (no throw) on a malformed/garbage b64 hash', async () => {
    process.env.ADMIN_PASSWORD_HASH_B64 = Buffer.from('not-a-hash', 'utf8').toString('base64');
    expect(await checkPassword('s3cret-pw')).toBe(false);
  });
});
