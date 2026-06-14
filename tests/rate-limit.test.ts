import { describe, it, expect } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
  it('allows under the limit then blocks', () => {
    const ip = 'test-ip-1';
    for (let i = 0; i < 5; i++) expect(rateLimit(ip, 5, 60000)).toBe(true);
    expect(rateLimit(ip, 5, 60000)).toBe(false);
  });
});
