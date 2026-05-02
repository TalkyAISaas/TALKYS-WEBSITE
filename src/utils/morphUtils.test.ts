import { describe, it, expect } from 'vitest';
import {
  lerp,
  computeMorphProgress,
  buildSpherePositions,
  updateWavePlanePositions,
  morphPositions,
  getThemeColors,
  buildGridLineIndices,
  buildMeridianLineIndices,
  extractIndexedPositions,
} from './morphUtils';

describe('lerp', () => {
  it('returns a at t=0', () => expect(lerp(0, 10, 0)).toBe(0));
  it('returns b at t=1', () => expect(lerp(0, 10, 1)).toBe(10));
  it('returns midpoint at t=0.5', () => expect(lerp(0, 10, 0.5)).toBe(5));
  it('works with negative values', () => expect(lerp(-5, 5, 0.5)).toBe(0));
});

describe('computeMorphProgress', () => {
  it('returns 0 at top of page', () => {
    expect(computeMorphProgress(0, 2000, 800)).toBe(0);
  });
  it('returns 1 at 65% scroll', () => {
    expect(computeMorphProgress(780, 2000, 800)).toBe(1);
  });
  it('clamps to 1 beyond 65%', () => {
    expect(computeMorphProgress(1200, 2000, 800)).toBe(1);
  });
  it('returns 0 when docHeight <= windowHeight', () => {
    expect(computeMorphProgress(0, 800, 800)).toBe(0);
  });
  it('returns ~0.5 at 32.5% scroll', () => {
    expect(computeMorphProgress(390, 2000, 800)).toBeCloseTo(0.5);
  });
});

describe('buildSpherePositions', () => {
  it('returns (wSeg+1)*(hSeg+1)*3 floats', () => {
    const pos = buildSpherePositions(2.5, 32, 32);
    expect(pos.length).toBe(33 * 33 * 3);
  });
  it('north pole vertices are at y=radius', () => {
    const pos = buildSpherePositions(2.5, 32, 32);
    expect(pos[1]).toBeCloseTo(2.5);
    expect(pos[4]).toBeCloseTo(2.5);
  });
  it('south pole vertices are at y=-radius', () => {
    const pos = buildSpherePositions(2.5, 32, 32);
    const lastRowStart = 32 * 33 * 3;
    expect(pos[lastRowStart + 1]).toBeCloseTo(-2.5);
  });
  it('equatorial vertex has y≈0', () => {
    const pos = buildSpherePositions(2.5, 32, 32);
    const eqRowStart = 16 * 33 * 3;
    expect(pos[eqRowStart + 1]).toBeCloseTo(0, 1);
  });
});

describe('updateWavePlanePositions', () => {
  it('returns (wSeg+1)*(hSeg+1)*3 floats', () => {
    const out = new Float32Array(33 * 33 * 3);
    updateWavePlanePositions(out, 18, 12, 32, 32, 0, 0.3, 0.5);
    expect(out.length).toBe(33 * 33 * 3);
  });
  it('center vertex x is ~0 at ix=wSeg/2', () => {
    const out = new Float32Array(4 * 4 * 3);
    updateWavePlanePositions(out, 6, 4, 3, 3, 0, 0, 1);
    expect(out[0]).toBeCloseTo(-3);
    expect(out[9]).toBeCloseTo(3);
  });
  it('z displacement is 0 when amplitude=0', () => {
    const out = new Float32Array(9 * 3);
    updateWavePlanePositions(out, 8, 6, 2, 2, 100, 0, 1);
    for (let i = 0; i < 9; i++) {
      expect(out[i * 3 + 2]).toBeCloseTo(0);
    }
  });
});

describe('morphPositions', () => {
  it('equals sphere at progress=0', () => {
    const sphere = new Float32Array([1, 2, 3, 4, 5, 6]);
    const plane  = new Float32Array([7, 8, 9, 10, 11, 12]);
    const out    = new Float32Array(6);
    morphPositions(sphere, plane, 0, out);
    expect(Array.from(out)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it('equals plane at progress=1', () => {
    const sphere = new Float32Array([1, 2, 3]);
    const plane  = new Float32Array([7, 8, 9]);
    const out    = new Float32Array(3);
    morphPositions(sphere, plane, 1, out);
    expect(Array.from(out)).toEqual([7, 8, 9]);
  });
  it('interpolates at progress=0.5', () => {
    const sphere = new Float32Array([0, 0, 0]);
    const plane  = new Float32Array([10, 10, 10]);
    const out    = new Float32Array(3);
    morphPositions(sphere, plane, 0.5, out);
    expect(out[0]).toBeCloseTo(5);
    expect(out[1]).toBeCloseTo(5);
    expect(out[2]).toBeCloseTo(5);
  });
});

describe('getThemeColors', () => {
  it('returns teal primary in dark mode', () => {
    expect(getThemeColors(true).primary).toBe('#1A8FA8');
  });
  it('returns terracotta accent in dark mode', () => {
    expect(getThemeColors(true).accent).toBe('#E07A5F');
  });
  it('returns dark teal primary in light mode', () => {
    expect(getThemeColors(false).primary).toBe('#0F4C5C');
  });
  it('returns lower opacity in light mode', () => {
    expect(getThemeColors(false).opacity).toBeLessThan(getThemeColors(true).opacity);
  });
});

describe('buildGridLineIndices', () => {
  it('produces correct index count for 32x32', () => {
    const idx = buildGridLineIndices(32, 32);
    expect(idx.length).toBe(4224);
  });
  it('all indices are within vertex count', () => {
    const idx = buildGridLineIndices(4, 4);
    const vertexCount = 5 * 5;
    for (let i = 0; i < idx.length; i++) {
      expect(idx[i]).toBeLessThan(vertexCount);
    }
  });
});

describe('buildMeridianLineIndices', () => {
  it('produces correct count for every 8th meridian on 32x32', () => {
    const idx = buildMeridianLineIndices(32, 32, 8);
    expect(idx.length).toBe(320);
  });
  it('all indices are within vertex count', () => {
    const idx = buildMeridianLineIndices(4, 4, 2);
    const vertexCount = 5 * 5;
    for (let i = 0; i < idx.length; i++) {
      expect(idx[i]).toBeLessThan(vertexCount);
    }
  });
});

describe('extractIndexedPositions', () => {
  it('extracts correct vertex positions by index', () => {
    const positions = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const indices = new Uint32Array([2, 0]);
    const out = new Float32Array(6);
    extractIndexedPositions(positions, indices, out);
    expect(Array.from(out)).toEqual([7, 8, 9, 1, 2, 3]);
  });
});
