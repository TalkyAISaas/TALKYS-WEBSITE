import { describe, it, expect } from 'vitest';
import { INDUSTRIES, getIndustryById } from './industries';

describe('INDUSTRIES', () => {
  it('contains exactly 4 entries', () => {
    expect(INDUSTRIES).toHaveLength(4);
  });

  it('has unique ids', () => {
    const ids = INDUSTRIES.map(i => i.id);
    expect(new Set(ids).size).toBe(4);
  });

  it('every entry has English audio + captions paths', () => {
    INDUSTRIES.forEach(i => {
      expect(i.demoCall.audio.en).toMatch(/^\/audio\/.+\.mp3$/);
      expect(i.demoCall.captions.en).toMatch(/^\/captions\/.+\.vtt$/);
    });
  });
});

describe('getIndustryById', () => {
  it('returns the matching config', () => {
    const r = getIndustryById('restaurant');
    expect(r?.id).toBe('restaurant');
  });

  it('returns undefined for unknown id', () => {
    expect(getIndustryById('unknown')).toBeUndefined();
  });
});
