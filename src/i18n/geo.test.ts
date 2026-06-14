import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectLocaleFromGeo, ARABIC_COUNTRIES } from './geo';

const realFetch = global.fetch;

describe('detectLocaleFromGeo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    global.fetch = realFetch;
    vi.useRealTimers();
  });

  it('returns "ar" for an Arabic-speaking country', async () => {
    global.fetch = vi.fn(async () => new Response(JSON.stringify({ country: 'LB' }), { status: 200 })) as never;
    const result = await detectLocaleFromGeo({ navigatorLanguage: 'en-US' });
    expect(result).toBe('ar');
  });

  it('returns "en" for a non-Arabic country', async () => {
    global.fetch = vi.fn(async () => new Response(JSON.stringify({ country: 'FR' }), { status: 200 })) as never;
    const result = await detectLocaleFromGeo({ navigatorLanguage: 'fr-FR' });
    expect(result).toBe('en');
  });

  it('falls back to navigator language on fetch error', async () => {
    global.fetch = vi.fn(async () => { throw new Error('network'); }) as never;
    expect(await detectLocaleFromGeo({ navigatorLanguage: 'ar-LB' })).toBe('ar');
    expect(await detectLocaleFromGeo({ navigatorLanguage: 'en-GB' })).toBe('en');
  });

  it('includes Lebanon in the Arabic country set', () => {
    expect(ARABIC_COUNTRIES.has('LB')).toBe(true);
  });
});
