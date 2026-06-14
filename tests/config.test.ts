import { describe, it, expect } from 'vitest';
import { validateConfig } from '@/lib/config';

const good = {
  contactUrl: 'mailto:a@b.com',
  links: [{ id: '1', name: 'GitHub', icon: 'Github', url: 'https://x.com', tooltip: 'GH' }],
};

describe('validateConfig', () => {
  it('accepts a valid config', () => {
    expect(validateConfig(good)).toEqual(good);
  });
  it('rejects javascript: url', () => {
    expect(() => validateConfig({ ...good, links: [{ ...good.links[0], url: 'javascript:alert(1)' }] })).toThrow();
  });
  it('rejects unknown icon', () => {
    expect(() => validateConfig({ ...good, links: [{ ...good.links[0], icon: 'Nope' }] })).toThrow();
  });
  it('rejects missing name', () => {
    expect(() => validateConfig({ ...good, links: [{ ...good.links[0], name: '' }] })).toThrow();
  });
  it('rejects bad contactUrl scheme', () => {
    expect(() => validateConfig({ ...good, contactUrl: 'javascript:1' })).toThrow();
  });
  it('rejects non-array links', () => {
    expect(() => validateConfig({ contactUrl: 'mailto:a@b.com', links: 'x' })).toThrow();
  });
});
