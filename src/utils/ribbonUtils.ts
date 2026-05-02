// src/utils/ribbonUtils.ts

export const NUM_POINTS = 80;

export interface RibbonLayerConfig {
  yOffset: number;
  amplitude: number;
  color: string;
  opacity: number;
  phaseOffset: number;
}

export const RIBBON_LAYERS: RibbonLayerConfig[] = [
  { yOffset: -2.5, amplitude: 0.6, color: '#6366f1', opacity: 0.25, phaseOffset: 0.0 },
  { yOffset: -1.5, amplitude: 0.7, color: '#6366f1', opacity: 0.35, phaseOffset: 0.3 },
  { yOffset: -0.5, amplitude: 0.8, color: '#1A8FA8', opacity: 0.50, phaseOffset: 0.6 },
  { yOffset:  0.5, amplitude: 0.9, color: '#1A8FA8', opacity: 0.55, phaseOffset: 0.9 },
  { yOffset:  1.5, amplitude: 1.0, color: '#E07A5F', opacity: 0.55, phaseOffset: 1.2 },
  { yOffset:  2.5, amplitude: 1.1, color: '#E07A5F', opacity: 0.60, phaseOffset: 1.5 },
];

/**
 * Maps scroll position to 0–1 across the full page height.
 */
export function computeRibbonScroll(
  scrollY: number,
  docHeight: number,
  winHeight: number
): number {
  const maxScroll = docHeight - winHeight;
  if (maxScroll <= 0) return 0;
  return Math.min(Math.max(scrollY / maxScroll, 0), 1);
}

/**
 * Writes NUM_POINTS * 3 floats into `out` for one ribbon layer.
 * Mutates `out` in place — no allocation.
 *
 * @param time           - seconds elapsed
 * @param scrollProgress - 0 (hero) to 1 (page bottom)
 * @param layer          - layer configuration
 * @param viewWidth      - world-space width of the canvas
 * @param out            - pre-allocated Float32Array of length NUM_POINTS * 3
 */
export function buildRibbonPointsInto(
  time: number,
  scrollProgress: number,
  layer: RibbonLayerConfig,
  viewWidth: number,
  out: Float32Array
): void {
  const ampScale  = 0.3 + scrollProgress * 0.7;  // 0.3 at top → 1.0 at bottom
  const freqScale = 1.0 + scrollProgress * 1.5;  // 1.0 → 2.5
  const timeScale = 0.8 + scrollProgress * 0.4;  // 0.8 → 1.2

  for (let i = 0; i < NUM_POINTS; i++) {
    const t     = i / (NUM_POINTS - 1);
    const x     = (t - 0.5) * viewWidth;
    const phase = t * Math.PI * 4 * freqScale - time * timeScale + layer.phaseOffset;
    const y     = layer.yOffset
                + Math.sin(phase) * layer.amplitude * ampScale
                + Math.sin(phase * 0.5 + time * 0.4) * layer.amplitude * ampScale * 0.3;
    const z     = (layer.yOffset / 5) * 0.5;

    out[i * 3]     = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
}

/**
 * Writes the bright centre spine positions into `out`.
 * The spine is a single sine wave at y=0, always z=0.
 */
export function buildSpinePointsInto(
  time: number,
  scrollProgress: number,
  viewWidth: number,
  out: Float32Array
): void {
  const ampScale  = 0.3 + scrollProgress * 0.7;
  const freqScale = 1.0 + scrollProgress * 1.5;

  for (let i = 0; i < NUM_POINTS; i++) {
    const t     = i / (NUM_POINTS - 1);
    const x     = (t - 0.5) * viewWidth;
    const phase = t * Math.PI * 4 * freqScale - time * 0.8;
    const y     = Math.sin(phase) * 1.5 * ampScale;

    out[i * 3]     = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = 0;
  }
}
