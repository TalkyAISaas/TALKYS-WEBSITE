import { describe, it, expect, vi } from 'vitest';
import { translate } from './translate';

const DICT = {
  nav: { bookDemo: 'Book a Demo', links: { features: 'Features' } },
  hero: { title: 'Meet Talkys.' },
  arr: ['a', 'b'],
} as const;

describe('translate', () => {
  it('returns top-level string', () => {
    expect(translate(DICT, 'hero.title')).toBe('Meet Talkys.');
  });

  it('returns nested string', () => {
    expect(translate(DICT, 'nav.links.features')).toBe('Features');
  });

  it('returns the key itself for a missing path', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(translate(DICT, 'does.not.exist')).toBe('does.not.exist');
    warn.mockRestore();
  });

  it('returns array when path points to an array', () => {
    expect(translate(DICT, 'arr')).toEqual(['a', 'b']);
  });
});
