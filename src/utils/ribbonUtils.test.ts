// src/utils/ribbonUtils.test.ts
import { describe, it, expect } from 'vitest';
import { computeRibbonScroll } from './ribbonUtils';

describe('computeRibbonScroll', () => {
  it('returns 0 at top of page', () => {
    expect(computeRibbonScroll(0, 2000, 800)).toBe(0);
  });
  it('returns 1 at bottom of page', () => {
    expect(computeRibbonScroll(1200, 2000, 800)).toBe(1);
  });
  it('returns ~0.5 at halfway', () => {
    expect(computeRibbonScroll(600, 2000, 800)).toBeCloseTo(0.5);
  });
  it('clamps at 0 for negative scroll', () => {
    expect(computeRibbonScroll(-10, 2000, 800)).toBe(0);
  });
  it('returns 0 when page is not scrollable', () => {
    expect(computeRibbonScroll(0, 800, 800)).toBe(0);
  });
});

import { buildRibbonPointsInto, RIBBON_LAYERS, NUM_POINTS } from './ribbonUtils';

describe('buildRibbonPointsInto', () => {
  it('fills exactly NUM_POINTS * 3 floats', () => {
    const out = new Float32Array(NUM_POINTS * 3);
    buildRibbonPointsInto(0, 0, RIBBON_LAYERS[0], 20, out);
    expect(out.length).toBe(NUM_POINTS * 3);
  });

  it('x values span roughly -viewWidth/2 to +viewWidth/2', () => {
    const out = new Float32Array(NUM_POINTS * 3);
    buildRibbonPointsInto(0, 0, RIBBON_LAYERS[0], 20, out);
    expect(out[0]).toBeCloseTo(-10, 1);                   // first x
    expect(out[(NUM_POINTS - 1) * 3]).toBeCloseTo(10, 1); // last x
  });

  it('y values stay within amplitude envelope', () => {
    const layer = RIBBON_LAYERS[0]; // amplitude 0.6, yOffset -2.5
    const out = new Float32Array(NUM_POINTS * 3);
    buildRibbonPointsInto(0, 0, layer, 20, out);
    const maxAmp = layer.amplitude * 1.3 + Math.abs(layer.yOffset); // conservative bound
    for (let i = 0; i < NUM_POINTS; i++) {
      expect(Math.abs(out[i * 3 + 1])).toBeLessThanOrEqual(maxAmp);
    }
  });

  it('at scrollProgress=0 amplitude is reduced vs scrollProgress=1', () => {
    const out0 = new Float32Array(NUM_POINTS * 3);
    const out1 = new Float32Array(NUM_POINTS * 3);
    buildRibbonPointsInto(0, 0, RIBBON_LAYERS[2], 20, out0); // scroll=0
    buildRibbonPointsInto(0, 1, RIBBON_LAYERS[2], 20, out1); // scroll=1
    // compare max Y deviation from yOffset
    let max0 = 0, max1 = 0;
    for (let i = 0; i < NUM_POINTS; i++) {
      max0 = Math.max(max0, Math.abs(out0[i * 3 + 1] - RIBBON_LAYERS[2].yOffset));
      max1 = Math.max(max1, Math.abs(out1[i * 3 + 1] - RIBBON_LAYERS[2].yOffset));
    }
    expect(max1).toBeGreaterThan(max0);
  });
});

import { buildSpinePointsInto } from './ribbonUtils';

describe('buildSpinePointsInto', () => {
  it('fills exactly NUM_POINTS * 3 floats', () => {
    const out = new Float32Array(NUM_POINTS * 3);
    buildSpinePointsInto(0, 0, 20, out);
    expect(out.length).toBe(NUM_POINTS * 3);
  });

  it('z values are always 0 (spine stays centred)', () => {
    const out = new Float32Array(NUM_POINTS * 3);
    buildSpinePointsInto(1.5, 0.5, 20, out);
    for (let i = 0; i < NUM_POINTS; i++) {
      expect(out[i * 3 + 2]).toBe(0);
    }
  });
});
