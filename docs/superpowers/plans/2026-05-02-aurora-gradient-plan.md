# Aurora Gradient Mesh Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace BackgroundCanvas with a full-screen GLSL aurora — 5 glowing blobs drift on Lissajous paths in screen-blend mode, with film grain and scroll-driven wakeup.

**Architecture:** A single R3F `PlaneGeometry` fills the viewport, driven by a custom `ShaderMaterial`. All animation lives in GLSL uniforms (`uTime`, `uScrollProgress`) updated each frame via `useFrame`. No per-frame JS allocation. `auroraUtils.ts` holds blob configs and colour-lerp helpers that are unit-testable without a GPU.

**Tech Stack:** React Three Fiber, Three.js ShaderMaterial, GLSL, Vitest, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/utils/auroraUtils.ts` | **Create** | Blob configs, hex-to-vec3 conversion, colour lerp |
| `src/utils/auroraUtils.test.ts` | **Create** | Unit tests for helpers |
| `src/components/BackgroundCanvas.tsx` | **Replace** | R3F Canvas, AuroraPlane with ShaderMaterial |

---

### Task 1: auroraUtils.ts — blob config + hex helpers

**Files:**
- Create: `src/utils/auroraUtils.ts`
- Create: `src/utils/auroraUtils.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/utils/auroraUtils.test.ts
import { describe, it, expect } from 'vitest';
import { hexToVec3, lerpColor, BLOB_CONFIGS } from './auroraUtils';

describe('hexToVec3', () => {
  it('converts white to [1,1,1]', () => {
    expect(hexToVec3('#ffffff')).toEqual([1, 1, 1]);
  });
  it('converts black to [0,0,0]', () => {
    expect(hexToVec3('#000000')).toEqual([0, 0, 0]);
  });
  it('converts teal #1A8FA8 correctly', () => {
    const [r, g, b] = hexToVec3('#1A8FA8');
    expect(r).toBeCloseTo(0.102, 2);
    expect(g).toBeCloseTo(0.561, 2);
    expect(b).toBeCloseTo(0.659, 2);
  });
});

describe('lerpColor', () => {
  it('returns a at t=0', () => {
    expect(lerpColor([1, 0, 0], [0, 1, 0], 0)).toEqual([1, 0, 0]);
  });
  it('returns b at t=1', () => {
    expect(lerpColor([1, 0, 0], [0, 1, 0], 1)).toEqual([0, 1, 0]);
  });
  it('returns midpoint at t=0.5', () => {
    const result = lerpColor([0, 0, 0], [1, 1, 1], 0.5);
    expect(result[0]).toBeCloseTo(0.5);
    expect(result[1]).toBeCloseTo(0.5);
    expect(result[2]).toBeCloseTo(0.5);
  });
});

describe('BLOB_CONFIGS', () => {
  it('has exactly 5 blobs', () => {
    expect(BLOB_CONFIGS.length).toBe(5);
  });
  it('each blob has color, speed, phase, radius, baseX, baseY', () => {
    BLOB_CONFIGS.forEach(b => {
      expect(typeof b.color).toBe('string');
      expect(typeof b.speed).toBe('number');
      expect(typeof b.phase).toBe('number');
      expect(typeof b.radius).toBe('number');
      expect(typeof b.baseX).toBe('number');
      expect(typeof b.baseY).toBe('number');
    });
  });
});
```

- [ ] **Step 2: Run to confirm fail**

```bash
npm test -- auroraUtils
```
Expected: FAIL — module not found.

- [ ] **Step 3: Create auroraUtils.ts**

```typescript
// src/utils/auroraUtils.ts

export interface BlobConfig {
  color: string;  // hex
  speed: number;  // Lissajous drift speed (radians per frame tick)
  phase: number;  // starting phase offset
  radius: number; // blob coverage radius in UV space (0–1)
  baseX: number;  // base UV x position (0–1)
  baseY: number;  // base UV y position (0–1)
}

export const BLOB_CONFIGS: BlobConfig[] = [
  { color: '#6366f1', speed: 0.00031, phase: 0.0, radius: 0.55, baseX: 0.25, baseY: 0.40 },
  { color: '#1A8FA8', speed: 0.00027, phase: 1.1, radius: 0.50, baseX: 0.70, baseY: 0.35 },
  { color: '#E07A5F', speed: 0.00035, phase: 2.2, radius: 0.45, baseX: 0.50, baseY: 0.70 },
  { color: '#8b5cf6', speed: 0.00029, phase: 3.3, radius: 0.40, baseX: 0.15, baseY: 0.70 },
  { color: '#06b6d4', speed: 0.00033, phase: 4.4, radius: 0.40, baseX: 0.85, baseY: 0.65 },
];

/**
 * Converts a CSS hex color string to a normalised [r, g, b] triple (0–1 each).
 */
export function hexToVec3(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [
    ((n >> 16) & 0xff) / 255,
    ((n >>  8) & 0xff) / 255,
    ( n        & 0xff) / 255,
  ];
}

/**
 * Linear interpolation between two [r, g, b] triples.
 */
export function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- auroraUtils
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/auroraUtils.ts src/utils/auroraUtils.test.ts
git commit -m "feat: add auroraUtils with blob config, hexToVec3, lerpColor"
```

---

### Task 2: BackgroundCanvas.tsx — GLSL shaders

**Files:**
- Modify: `src/components/BackgroundCanvas.tsx` (full replacement, written in two steps)

- [ ] **Step 1: Write BackgroundCanvas.tsx with the GLSL shaders and AuroraPlane**

```tsx
// src/components/BackgroundCanvas.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { BLOB_CONFIGS, hexToVec3, lerpColor } from '@/utils/auroraUtils';

// ─── GLSL ────────────────────────────────────────────────────

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// uBlobs layout per blob (index i):
//   uBlobPos[i]    = vec2(x, y) in UV space
//   uBlobColor[i]  = vec3(r, g, b)
//   uBlobRadius[i] = float

const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2  uBlobPos[5];
  uniform vec3  uBlobColor[5];
  uniform float uBlobRadius[5];

  varying vec2 vUv;

  // Pseudo-random for grain
  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec3 color = vec3(0.0);

    // Additive screen-blend: sum blobs
    for (int i = 0; i < 5; i++) {
      vec2  delta = vUv - uBlobPos[i];
      // Correct for aspect ratio distortion (assume 16:9 ish)
      delta.x *= 1.77;
      float dist  = length(delta);
      float blob  = smoothstep(uBlobRadius[i], 0.0, dist);
      // Dim at scroll=0, full brightness at scroll=1
      float brightness = 0.35 + uScrollProgress * 0.65;
      color += uBlobColor[i] * blob * brightness;
    }

    // Screen blend approximation: 1-(1-a)(1-b) clamped
    color = 1.0 - (1.0 - color) * (1.0 - color * 0.3);
    color = clamp(color, 0.0, 1.0);

    // Film grain
    float grainAmt = 0.025 + uScrollProgress * 0.03;
    float grain = (rand(vUv + fract(uTime * 0.01)) - 0.5) * grainAmt;
    color += grain;

    // Slightly darken so content remains readable
    color *= 0.85;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── AuroraPlane ─────────────────────────────────────────────

function AuroraPlane() {
  const matRef    = useRef<THREE.ShaderMaterial>(null!);
  const scrollRef = useRef(0);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Build uniform arrays once from BLOB_CONFIGS
  const blobPositions = useMemo(
    () => BLOB_CONFIGS.map(b => new THREE.Vector2(b.baseX, b.baseY)),
    []
  );
  const blobColors = useMemo(
    () => BLOB_CONFIGS.map(b => {
      const [r, g, b2] = hexToVec3(b.color);
      return new THREE.Vector3(r, g, b2);
    }),
    []
  );
  const blobRadii = useMemo(() => BLOB_CONFIGS.map(b => b.radius), []);

  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uScrollProgress: { value: 0 },
    uBlobPos:        { value: blobPositions },
    uBlobColor:      { value: blobColors },
    uBlobRadius:     { value: blobRadii },
  }), [blobPositions, blobColors, blobRadii]);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0
        ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
        : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    if (!reducedMotion.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
    matRef.current.uniforms.uScrollProgress.value = scrollRef.current;

    // Drift blob positions using Lissajous paths
    if (!reducedMotion.current) {
      const t = matRef.current.uniforms.uTime.value;
      const driftScale = 0.08 + scrollRef.current * 0.12; // more drift as you scroll
      BLOB_CONFIGS.forEach((b, i) => {
        blobPositions[i].x = b.baseX + Math.sin(t * b.speed * 1000 + b.phase) * driftScale;
        blobPositions[i].y = b.baseY + Math.cos(t * b.speed * 1000 * 1.3 + b.phase) * driftScale * 0.75;
      });
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── BackgroundCanvas ────────────────────────────────────────

export default function BackgroundCanvas() {
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
        camera={{ position: [0, 0, 1], fov: 90, near: 0.1, far: 10 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
      >
        <AuroraPlane />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Run dev and verify aurora is visible**

```bash
npm run dev
```
Open http://localhost:5173.
Expected: coloured aurora blobs (indigo, teal, terracotta, violet, cyan) slowly drifting. Background page content visible on top.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npm run build 2>&1 | head -30
```
Expected: clean build with no errors.

- [ ] **Step 4: Run all tests**

```bash
npm test
```
Expected: all auroraUtils tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/BackgroundCanvas.tsx
git commit -m "feat: replace BackgroundCanvas with GLSL aurora gradient mesh"
```

---

### Task 3: Verify scroll, reduced-motion, and light mode

**Files:**
- Read: `src/components/BackgroundCanvas.tsx` (visual verification only)

- [ ] **Step 1: Verify scroll wakeup**

Open http://localhost:5173. Scroll from top to bottom.
Expected: aurora starts dim/centred at top, becomes brighter and blobs drift wider as you scroll. Warmer (more terracotta/orange) tones dominate near the CTA section.

- [ ] **Step 2: Verify reduced-motion**

DevTools → Rendering → Enable "Emulate CSS media: prefers-reduced-motion: reduce".
Expected: blobs freeze at initial positions. No animation. Aurora colours still render.

- [ ] **Step 3: Verify light mode**

Toggle theme in Navigation.
Expected: aurora is more subtle on light background but still visible — the `* 0.85` multiplier in the shader keeps it from washing out light-mode content.

- [ ] **Step 4: Final build check**

```bash
npm run build
```
Expected: clean build.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: aurora gradient background complete — scroll wakeup + reduced-motion"
```
