# 3D Background Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-page ambient 3D canvas — a wireframe globe that slowly rotates at the top, then unravels its grid lines into a rippling wave grid as the user scrolls down.

**Architecture:** A single `BackgroundCanvas` component renders a fixed R3F `<Canvas>` covering the full viewport behind all page content. A `MorphMesh` inside it owns all geometry: two shared position arrays (sphere + wave plane) with line-segment index buffers, lerped every frame by a scroll-driven `morphProgress` ref. Pure math functions live in `morphUtils.ts` for testability.

**Tech Stack:** React 19 + TypeScript + Vite + Three.js 0.183.2 + @react-three/fiber 9.5.0 + @react-three/drei 10.7.7 + vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/utils/morphUtils.ts` | Create | Pure math: sphere/plane position builders, lerp, scroll progress, color helpers, index buffers |
| `src/utils/morphUtils.test.ts` | Create | Unit tests for all morphUtils functions |
| `src/components/BackgroundCanvas.tsx` | Create | Fixed R3F canvas + MorphMesh component |
| `src/App.tsx` | Modify | Mount `<BackgroundCanvas />` as first child inside ThemeProvider |
| `vite.config.ts` | Modify | Add vitest test config block |
| `package.json` | Modify | Add vitest dev dependency + `test` script |

---

## Task 1: Add vitest

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`

- [ ] **Step 1: Install vitest**

```bash
npm install --save-dev vitest
```

Expected output: vitest added to `node_modules`, no errors.

- [ ] **Step 2: Add test script to package.json**

In `package.json`, update the `"scripts"` block:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
},
```

- [ ] **Step 3: Add vitest config to vite.config.ts**

```ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Verify vitest runs (no tests yet = passes)**

```bash
npm test
```

Expected: `No test files found` or `0 tests passed`. No error exit code.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts
git commit -m "chore: add vitest for unit testing morphUtils"
```

---

## Task 2: Create morphUtils.ts with pure math functions

**Files:**
- Create: `src/utils/morphUtils.ts`
- Create: `src/utils/morphUtils.test.ts`

### 2a — Write the failing tests first

- [ ] **Step 1: Create test file**

Create `src/utils/morphUtils.test.ts`:

```ts
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
    // maxScroll = 1200, 65% of that = 780, ratio = 780/1200 = 0.65, /0.65 = 1
    expect(computeMorphProgress(780, 2000, 800)).toBe(1);
  });
  it('clamps to 1 beyond 65%', () => {
    expect(computeMorphProgress(1200, 2000, 800)).toBe(1);
  });
  it('returns 0 when docHeight <= windowHeight', () => {
    expect(computeMorphProgress(0, 800, 800)).toBe(0);
  });
  it('returns ~0.5 at 32.5% scroll', () => {
    // 32.5% of 1200 = 390, ratio = 390/1200 = 0.325, /0.65 = 0.5
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
    // First row (iy=0) all have phi=0 → y = radius * cos(0) = radius
    expect(pos[1]).toBeCloseTo(2.5);  // vertex 0, y
    expect(pos[4]).toBeCloseTo(2.5);  // vertex 1, y
  });
  it('south pole vertices are at y=-radius', () => {
    const pos = buildSpherePositions(2.5, 32, 32);
    // Last row (iy=32) all have phi=PI → y = radius * cos(PI) = -radius
    const lastRowStart = 32 * 33 * 3;
    expect(pos[lastRowStart + 1]).toBeCloseTo(-2.5);
  });
  it('equatorial vertex has y≈0', () => {
    // iy=16 is phi = PI/2 → y = radius * cos(PI/2) ≈ 0
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
    const out = new Float32Array(4 * 4 * 3); // 3 segments = 4x4 vertices
    updateWavePlanePositions(out, 6, 4, 3, 3, 0, 0, 1);
    // ix=1 (of 3): x = (1/3 - 0.5)*6 = -1
    // ix=2 (of 3): x = (2/3 - 0.5)*6 = +1
    // Center ix=1.5 doesn't exist, check symmetry
    expect(out[0]).toBeCloseTo(-3); // ix=0, x = (0 - 0.5)*6 = -3
    expect(out[9]).toBeCloseTo(3);  // ix=3, x = (1 - 0.5)*6 = 3
  });
  it('z displacement is 0 when amplitude=0', () => {
    const out = new Float32Array(9 * 3);
    updateWavePlanePositions(out, 8, 6, 2, 2, 100, 0, 1);
    // All z values should be 0
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
    // Latitude: 33 rows × 32 pairs = 1056 pairs
    // Longitude: 33 cols × 32 pairs = 1056 pairs
    // Total: 2112 pairs = 4224 indices
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
    // step=8: cols 0,8,16,24,32 = 5 meridians × 32 segments × 2 indices = 320
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
    // positions: 3 vertices [1,2,3], [4,5,6], [7,8,9]
    const positions = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const indices = new Uint32Array([2, 0]); // pick vertex 2 then 0
    const out = new Float32Array(6);
    extractIndexedPositions(positions, indices, out);
    expect(Array.from(out)).toEqual([7, 8, 9, 1, 2, 3]);
  });
});
```

- [ ] **Step 2: Run tests — expect all to fail**

```bash
npm test
```

Expected: Multiple "Cannot find module './morphUtils'" errors.

### 2b — Implement morphUtils.ts

- [ ] **Step 3: Create src/utils/morphUtils.ts**

```ts
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
    ? { primary: '#1A8FA8', accent: '#E07A5F', opacity: 0.25 }
    : { primary: '#0F4C5C', accent: '#C96A52', opacity: 0.15 };
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
```

- [ ] **Step 4: Run tests — expect all to pass**

```bash
npm test
```

Expected: All tests pass. Zero failures.

- [ ] **Step 5: Commit**

```bash
git add src/utils/morphUtils.ts src/utils/morphUtils.test.ts
git commit -m "feat: add morphUtils with sphere/wave math and tests"
```

---

## Task 3: Create BackgroundCanvas skeleton

**Files:**
- Create: `src/components/BackgroundCanvas.tsx`

- [ ] **Step 1: Create the skeleton with Canvas and camera only**

Create `src/components/BackgroundCanvas.tsx`:

```tsx
import { Canvas } from '@react-three/fiber';
import { useTheme } from '@/context/ThemeContext';

function MorphMesh({ isDark }: { isDark: boolean }) {
  // Placeholder — full implementation in Tasks 4–8
  void isDark;
  return null;
}

export default function BackgroundCanvas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <MorphMesh isDark={isDark} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Mount in App.tsx**

In `src/App.tsx`, add the import and place `<BackgroundCanvas />` as the first child inside `<ThemeProvider>`:

```tsx
import { useEffect, useState } from 'react';
import './App.css';

import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import ProblemSection from './sections/ProblemSection';
import SolutionSection from './sections/SolutionSection';
import HowItWorksSection from './sections/HowItWorksSection';
import FeaturesSection from './sections/FeaturesSection';
import SocialMediaSection from './sections/SocialMediaSection';
import IndustriesSection from './sections/IndustriesSection';
import GettingStartedSection from './sections/GettingStartedSection';
import FooterSection from './sections/FooterSection';
import FloatingObjects from './components/FloatingObjects';
import BackgroundCanvas from './components/BackgroundCanvas';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ThemeProvider>
      <BackgroundCanvas />
      <div className={`min-h-screen bg-background transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <FloatingObjects />
        <Navigation />
        <main>
          <HeroSection />
          <ProblemSection />
          <SolutionSection />
          <HowItWorksSection />
          <FeaturesSection />
          <SocialMediaSection />
          <IndustriesSection />
          <GettingStartedSection />
        </main>
        <FooterSection />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

- [ ] **Step 3: Verify dev server starts without errors**

```bash
npm run dev
```

Expected: Vite starts, browser opens, site looks normal (BackgroundCanvas renders nothing visible yet). No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/BackgroundCanvas.tsx src/App.tsx
git commit -m "feat: add BackgroundCanvas skeleton with fixed R3F canvas"
```

---

## Task 4: Implement MorphMesh — globe geometry and main wireframe

**Files:**
- Modify: `src/components/BackgroundCanvas.tsx`

- [ ] **Step 1: Replace MorphMesh with full geometry implementation**

Replace the entire `MorphMesh` function in `src/components/BackgroundCanvas.tsx`:

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';
import {
  buildSpherePositions,
  buildGridLineIndices,
  buildMeridianLineIndices,
  updateWavePlanePositions,
  morphPositions,
  extractIndexedPositions,
  getThemeColors,
  computeMorphProgress,
} from '@/utils/morphUtils';

const W_SEG = 32;
const H_SEG = 32;
const WAVE_AMPLITUDE = 0.3;
const WAVE_FREQUENCY = 0.5;
const PLANE_WIDTH = 18;
const PLANE_HEIGHT = 12;
const GLOBE_RADIUS = 2.5;

function MorphMesh({ isDark }: { isDark: boolean }) {
  const morphProgressRef = useRef(0);
  const timeRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  // --- Build static data once ---
  const spherePos = useMemo(
    () => buildSpherePositions(GLOBE_RADIUS, W_SEG, H_SEG),
    []
  );
  const gridIdx = useMemo(() => buildGridLineIndices(W_SEG, H_SEG), []);
  const meridianIdx = useMemo(() => buildMeridianLineIndices(W_SEG, H_SEG, 8), []);

  // Working arrays (mutated each frame, never recreated)
  const currentPlane = useMemo(
    () => new Float32Array(spherePos.length),
    [spherePos]
  );
  const morphed = useMemo(
    () => new Float32Array(spherePos),  // start as sphere
    [spherePos]
  );
  const accentMorphed = useMemo(
    () => new Float32Array(meridianIdx.length * 3),
    [meridianIdx]
  );

  // --- Build geometries ---
  const mainGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(morphed, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setIndex(new THREE.BufferAttribute(gridIdx, 1));
    return geo;
  }, [morphed, gridIdx]);

  const accentGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(accentMorphed, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    return geo;
  }, [accentMorphed]);

  // --- Materials (recreated when theme changes) ---
  const mainMat = useMemo(() => {
    const { primary, opacity } = getThemeColors(isDark);
    return new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity });
  }, [isDark]);
  const accentMat = useMemo(() => {
    const { accent, opacity } = getThemeColors(isDark);
    return new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: opacity * 0.8 });
  }, [isDark]);

  // --- Scroll listener ---
  useEffect(() => {
    const onScroll = () => {
      morphProgressRef.current = computeMorphProgress(
        window.scrollY,
        document.body.scrollHeight,
        window.innerHeight
      );
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --- Animation loop ---
  useFrame(() => {
    timeRef.current += 0.008;
    const progress = morphProgressRef.current;

    // Update wave plane for current time
    updateWavePlanePositions(
      currentPlane, PLANE_WIDTH, PLANE_HEIGHT, W_SEG, H_SEG,
      timeRef.current, WAVE_AMPLITUDE, WAVE_FREQUENCY
    );

    // Morph sphere → wave plane
    morphPositions(spherePos, currentPlane, progress, morphed);

    // Extract accent meridian positions from morphed
    extractIndexedPositions(morphed, meridianIdx, accentMorphed);

    // Flag both geometries for GPU upload
    (mainGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (accentGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // Rotate globe; drift group x from 0.8 → 0 as morph progresses
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.position.x = 0.8 * (1 - progress);
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={mainGeo} material={mainMat} />
      <lineSegments geometry={accentGeo} material={accentMat} />
    </group>
  );
}

export default function BackgroundCanvas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <MorphMesh isDark={isDark} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Expected: A faint teal wireframe globe visible in the background. No console errors. Scrolling begins the unravel morph. Theme toggle switches colors.

- [ ] **Step 3: Commit**

```bash
git add src/components/BackgroundCanvas.tsx
git commit -m "feat: implement MorphMesh with globe-to-wave vertex lerp and scroll morph"
```

---

## Task 5: Add reduced-motion accessibility

**Files:**
- Modify: `src/components/BackgroundCanvas.tsx`

- [ ] **Step 1: Add reduced-motion check to MorphMesh**

Add a `reducedMotion` ref at the top of `MorphMesh`, just after the other refs:

```tsx
const reducedMotion = useRef(
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
);
```

- [ ] **Step 2: Apply reduced-motion inside useFrame**

Replace the `useFrame` block's rotation and scroll-morph lines with:

```tsx
useFrame(() => {
  timeRef.current += 0.008;
  const progress = reducedMotion.current ? 0 : morphProgressRef.current;
  const rotSpeed = reducedMotion.current ? 0.0005 : 0.003;

  updateWavePlanePositions(
    currentPlane, PLANE_WIDTH, PLANE_HEIGHT, W_SEG, H_SEG,
    timeRef.current, WAVE_AMPLITUDE, WAVE_FREQUENCY
  );

  morphPositions(spherePos, currentPlane, progress, morphed);
  extractIndexedPositions(morphed, meridianIdx, accentMorphed);

  (mainGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  (accentGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

  if (groupRef.current) {
    groupRef.current.rotation.y += rotSpeed;
    groupRef.current.position.x = 0.8 * (1 - progress);
  }
});
```

- [ ] **Step 3: Verify dev server still works**

```bash
npm run dev
```

Expected: Site works normally. No errors. (Reduced-motion behavior only visible when OS setting is enabled.)

- [ ] **Step 4: Commit**

```bash
git add src/components/BackgroundCanvas.tsx
git commit -m "feat: respect prefers-reduced-motion in BackgroundCanvas"
```

---

## Task 6: Final verification

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All morphUtils tests pass. Zero failures.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build completes with no TypeScript errors.

- [ ] **Step 3: Visual check — dark mode**

```bash
npm run dev
```

Open site in browser (dark mode). Verify:
- [ ] Faint teal wireframe globe visible behind hero section
- [ ] Globe slowly rotates
- [ ] Globe is positioned slightly right of center
- [ ] Scrolling causes globe to unravel into wave grid
- [ ] Wave grid ripples continuously
- [ ] Morph is complete by the Features section (~65% scroll)
- [ ] At least 4 terracotta-colored meridian lines visible on the globe

- [ ] **Step 4: Visual check — light mode**

Toggle theme to light mode. Verify:
- [ ] Lines switch to dark teal (#0F4C5C) on the cream background
- [ ] Opacity is lower/more subtle than dark mode
- [ ] No jarring transition artifacts

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: complete 3D background animation — globe unravels to wave grid on scroll"
```
