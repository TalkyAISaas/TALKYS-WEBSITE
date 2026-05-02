/** Linear interpolation between a and b by t (0–1). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Maps scroll position to morph progress (0 = globe, 1 = wave grid).
 * Morph completes at 65% of total page scroll.
 */
export function computeMorphProgress(
  scrollY: number,
  docHeight: number,
  winHeight: number
): number {
  const maxScroll = docHeight - winHeight;
  if (maxScroll <= 0) return 0;
  const ratio = scrollY / maxScroll;
  return Math.min(Math.max(ratio / 0.65, 0), 1);
}

/**
 * Builds sphere vertex positions matching Three.js SphereGeometry(radius, wSeg, hSeg).
 * Outer loop: latitude rows (iy 0..hSeg), inner: longitude cols (ix 0..wSeg).
 * Total: (wSeg+1)*(hSeg+1) vertices.
 */
export function buildSpherePositions(
  radius: number,
  wSeg: number,
  hSeg: number
): Float32Array {
  const count = (wSeg + 1) * (hSeg + 1);
  const pos = new Float32Array(count * 3);
  let i = 0;
  for (let iy = 0; iy <= hSeg; iy++) {
    const phi = (iy / hSeg) * Math.PI;
    for (let ix = 0; ix <= wSeg; ix++) {
      const theta = (ix / wSeg) * Math.PI * 2;
      pos[i++] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i++] = radius * Math.cos(phi);
      pos[i++] = radius * Math.sin(phi) * Math.sin(theta);
    }
  }
  return pos;
}

/**
 * Writes wave-plane vertex positions into `out`.
 * Plane faces camera (XY), wave displaces in Z: z = amplitude * sin(x * frequency + time).
 * Total: (wSeg+1)*(hSeg+1) vertices — must match buildSpherePositions segment counts.
 */
export function updateWavePlanePositions(
  out: Float32Array,
  width: number,
  height: number,
  wSeg: number,
  hSeg: number,
  time: number,
  amplitude: number,
  frequency: number
): void {
  let i = 0;
  for (let iy = 0; iy <= hSeg; iy++) {
    for (let ix = 0; ix <= wSeg; ix++) {
      const x = (ix / wSeg - 0.5) * width;
      const y = (iy / hSeg - 0.5) * height;
      const z = amplitude * Math.sin(x * frequency + time);
      out[i++] = x;
      out[i++] = y;
      out[i++] = z;
    }
  }
}

/**
 * Lerps all positions from sphere to plane, writing into `out`.
 * All three arrays must have the same length.
 */
export function morphPositions(
  sphere: Float32Array,
  plane: Float32Array,
  progress: number,
  out: Float32Array
): void {
  for (let i = 0; i < out.length; i++) {
    out[i] = sphere[i] + (plane[i] - sphere[i]) * progress;
  }
}

/** Returns brand colors and opacity for the current theme. */
export function getThemeColors(isDark: boolean): {
  primary: string;
  accent: string;
  opacity: number;
} {
  return isDark
    ? { primary: '#1A8FA8', accent: '#E07A5F', opacity: 0.6 }
    : { primary: '#0F4C5C', accent: '#C96A52', opacity: 0.45 };
}

/**
 * Builds index buffer for LineSegments: all latitude (horizontal) +
 * all longitude (vertical) grid lines.
 * Latitude: (hSeg+1) rows × wSeg pairs. Longitude: (wSeg+1) cols × hSeg pairs.
 */
export function buildGridLineIndices(wSeg: number, hSeg: number): Uint32Array {
  const pairs: number[] = [];
  // Latitude lines
  for (let iy = 0; iy <= hSeg; iy++) {
    for (let ix = 0; ix < wSeg; ix++) {
      pairs.push(iy * (wSeg + 1) + ix, iy * (wSeg + 1) + ix + 1);
    }
  }
  // Longitude lines
  for (let ix = 0; ix <= wSeg; ix++) {
    for (let iy = 0; iy < hSeg; iy++) {
      pairs.push(iy * (wSeg + 1) + ix, (iy + 1) * (wSeg + 1) + ix);
    }
  }
  return new Uint32Array(pairs);
}

/**
 * Builds index buffer for LineSegments covering every `step`-th longitude meridian.
 * step=8 on wSeg=32 gives meridians at ix=0,8,16,24,32 (5 meridians).
 */
export function buildMeridianLineIndices(
  wSeg: number,
  hSeg: number,
  step: number
): Uint32Array {
  const pairs: number[] = [];
  for (let ix = 0; ix <= wSeg; ix += step) {
    for (let iy = 0; iy < hSeg; iy++) {
      pairs.push(iy * (wSeg + 1) + ix, (iy + 1) * (wSeg + 1) + ix);
    }
  }
  return new Uint32Array(pairs);
}

/**
 * Extracts vertex positions by index into `out`.
 * Each index in `indices` picks one vertex (3 floats) from `positions`.
 * `out` must have length = indices.length * 3.
 */
export function extractIndexedPositions(
  positions: Float32Array,
  indices: Uint32Array,
  out: Float32Array
): void {
  for (let i = 0; i < indices.length; i++) {
    const src = indices[i] * 3;
    const dst = i * 3;
    out[dst]     = positions[src];
    out[dst + 1] = positions[src + 1];
    out[dst + 2] = positions[src + 2];
  }
}
