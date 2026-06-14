import { describe, it, expect, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { signSession } from '@/lib/session';

beforeAll(() => {
  process.env.AUTH_SECRET = 'test-secret-test-secret-test-secret';
  process.env.CONFIG_PATH = '/tmp/mariusbc-test-config.json';
});

function put(body: unknown, cookie?: string) {
  return new NextRequest('http://localhost/api/config', {
    method: 'PUT',
    headers: cookie ? { cookie } : {},
    body: JSON.stringify(body),
  });
}

const valid = {
  contactUrl: 'mailto:a@b.com',
  links: [{ id: '1', name: 'GitHub', icon: 'Github', url: 'https://x.com', tooltip: 'GH' }],
};

describe('PUT /api/config', () => {
  it('rejects unauthenticated', async () => {
    const { PUT } = await import('@/app/api/config/route');
    expect((await PUT(put(valid))).status).toBe(401);
  });
  it('rejects malicious url when authenticated', async () => {
    const { PUT } = await import('@/app/api/config/route');
    const cookie = `session=${await signSession()}`;
    const bad = { ...valid, links: [{ ...valid.links[0], url: 'javascript:1' }] };
    expect((await PUT(put(bad, cookie))).status).toBe(400);
  });
  it('saves a valid config when authenticated', async () => {
    const { PUT } = await import('@/app/api/config/route');
    const cookie = `session=${await signSession()}`;
    expect((await PUT(put(valid, cookie))).status).toBe(200);
  });
});
