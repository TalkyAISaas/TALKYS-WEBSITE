# 3D Ribbon Waveform Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace BackgroundCanvas with a luminous multi-layer 3D ribbon waveform that breathes as an idle animation and morphs amplitude/frequency as the user scrolls.

**Architecture:** Six `Line` objects rendered via R3F, each following a sine-curve path updated every frame using `DynamicDrawUsage` Float32Arrays. Scroll progress is tracked via a `useRef` listener (zero re-renders). Pure-math helpers in `ribbonUtils.ts` keep the component thin and fully testable.

**Tech Stack:** React Three Fiber, Three.js, Vitest (existing setup), TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/utils/ribbonUtils.ts` | **Create** | Layer configs, point-building math, scroll mapping |
| `src/utils/ribbonUtils.test.ts` | **Create** | Unit tests for every exported function |
| `src/components/BackgroundCanvas.tsx` | **Replace** | R3F Canvas, RibbonScene, RibbonLayer, SpineLine |

---

### Task 1: ribbonUtils.ts — layer config + types

**Files:**
- Create: `src/utils/ribbonUtils.ts`

- [ ] **Step 1: Create the file with layer config and types**

```typescript
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
```

- [ ] **Step 2: Verify file exists**

```bash
ls src/utils/ribbonUtils.ts
```
Expected: file listed.

---

### Task 2: ribbonUtils.ts — scroll progress

**Files:**
- Modify: `src/utils/ribbonUtils.ts`
- Create: `src/utils/ribbonUtils.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
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
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- ribbonUtils
```
Expected: FAIL — `computeRibbonScroll` not exported.

- [ ] **Step 3: Implement computeRibbonScroll**

Append to `src/utils/ribbonUtils.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- ribbonUtils
```
Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/ribbonUtils.ts src/utils/ribbonUtils.test.ts
git commit -m "feat: add ribbonUtils with layer config and scroll mapping"
```

---

### Task 3: ribbonUtils.ts — point builder

**Files:**
- Modify: `src/utils/ribbonUtils.ts`
- Modify: `src/utils/ribbonUtils.test.ts`

- [ ] **Step 1: Write failing tests**

Append to `src/utils/ribbonUtils.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run to confirm fail**

```bash
npm test -- ribbonUtils
```
Expected: FAIL — `buildRibbonPointsInto` not exported.

- [ ] **Step 3: Implement buildRibbonPointsInto**

Append to `src/utils/ribbonUtils.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- ribbonUtils
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/ribbonUtils.ts src/utils/ribbonUtils.test.ts
git commit -m "feat: add buildRibbonPointsInto with scroll-driven amplitude"
```

---

### Task 4: ribbonUtils.ts — spine builder

**Files:**
- Modify: `src/utils/ribbonUtils.ts`
- Modify: `src/utils/ribbonUtils.test.ts`

- [ ] **Step 1: Write failing test**

Append to `src/utils/ribbonUtils.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run to confirm fail**

```bash
npm test -- ribbonUtils
```
Expected: FAIL — `buildSpinePointsInto` not exported.

- [ ] **Step 3: Implement buildSpinePointsInto**

Append to `src/utils/ribbonUtils.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- ribbonUtils
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/ribbonUtils.ts src/utils/ribbonUtils.test.ts
git commit -m "feat: add buildSpinePointsInto for centre spine"
```

---

### Task 5: BackgroundCanvas.tsx — RibbonLayer component

**Files:**
- Modify: `src/components/BackgroundCanvas.tsx` (full replacement)

- [ ] **Step 1: Replace BackgroundCanvas.tsx**

```tsx
// src/components/BackgroundCanvas.tsx
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  RIBBON_LAYERS,
  RibbonLayerConfig,
  NUM_POINTS,
  buildRibbonPointsInto,
  buildSpinePointsInto,
  computeRibbonScroll,
} from '@/utils/ribbonUtils';

// ─── RibbonLayer ─────────────────────────────────────────────

interface RibbonLayerProps {
  config: RibbonLayerConfig;
  timeRef: React.MutableRefObject<number>;
  scrollRef: React.MutableRefObject<number>;
}

function RibbonLayer({ config, timeRef, scrollRef }: RibbonLayerProps) {
  const attrRef = useRef<THREE.BufferAttribute>(null!);
  const posArr  = useMemo(() => new Float32Array(NUM_POINTS * 3), []);

  useFrame(() => {
    buildRibbonPointsInto(timeRef.current, scrollRef.current, config, 20, posArr);
    attrRef.current.needsUpdate = true;
  });

  return (
    <line>
      <bufferGeometry>
        {/* @ts-expect-error — ref on bufferAttribute is valid in R3F */}
        <bufferAttribute
          ref={attrRef}
          attach="attributes-position"
          array={posArr}
          count={NUM_POINTS}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={config.color}
        transparent
        opacity={config.opacity}
      />
    </line>
  );
}

// ─── SpineLine ───────────────────────────────────────────────

interface SpineLineProps {
  timeRef: React.MutableRefObject<number>;
  scrollRef: React.MutableRefObject<number>;
}

function SpineLine({ timeRef, scrollRef }: SpineLineProps) {
  const attrRef = useRef<THREE.BufferAttribute>(null!);
  const posArr  = useMemo(() => new Float32Array(NUM_POINTS * 3), []);

  useFrame(() => {
    buildSpinePointsInto(timeRef.current, scrollRef.current, 20, posArr);
    attrRef.current.needsUpdate = true;
  });

  return (
    <line>
      <bufferGeometry>
        {/* @ts-expect-error — ref on bufferAttribute is valid in R3F */}
        <bufferAttribute
          ref={attrRef}
          attach="attributes-position"
          array={posArr}
          count={NUM_POINTS}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.7} />
    </line>
  );
}

// ─── RibbonScene ─────────────────────────────────────────────

function RibbonScene() {
  const timeRef   = useRef(0);
  const scrollRef = useRef(0);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = computeRibbonScroll(
        window.scrollY,
        document.body.scrollHeight,
        window.innerHeight
      );
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion.current) timeRef.current += delta;
  });

  return (
    <group>
      {RIBBON_LAYERS.map((layer, i) => (
        <RibbonLayer
          key={i}
          config={layer}
          timeRef={timeRef}
          scrollRef={scrollRef}
        />
      ))}
      <SpineLine timeRef={timeRef} scrollRef={scrollRef} />
    </group>
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
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <RibbonScene />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Run dev server and verify ribbon is visible**

```bash
npm run dev
```
Open http://localhost:5173. Expected: animated ribbon layers visible in the hero section. No console errors.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npm run build 2>&1 | head -30
```
Expected: build succeeds with no TS errors (the `@ts-expect-error` suppresses the one known R3F ref issue).

- [ ] **Step 4: Run all tests**

```bash
npm test
```
Expected: all ribbonUtils tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/BackgroundCanvas.tsx
git commit -m "feat: replace BackgroundCanvas with 6-layer ribbon waveform"
```

---

### Task 6: Verify scroll behaviour and reduced-motion

**Files:**
- Read: `src/components/BackgroundCanvas.tsx` (no changes expected)

- [ ] **Step 1: Verify scroll drives amplitude**

Open http://localhost:5173. Scroll from top to bottom slowly.
Expected: ribbon starts flat/calm at the top, amplitude increases as you scroll deeper, flattens toward the CTA section.

- [ ] **Step 2: Verify reduced-motion**

In browser DevTools → Rendering → Enable "Emulate CSS media: prefers-reduced-motion: reduce".
Expected: ribbon freezes (no animation), renders as static sine curves. No console errors.

- [ ] **Step 3: Verify dark and light mode**

Click the theme toggle in Navigation. Expected: ribbon visible in both dark (indigo/teal/terracotta on dark bg) and light mode (same colours on light bg — subtler but present).

- [ ] **Step 4: Final build check**

```bash
npm run build
```
Expected: clean build, no errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: ribbon waveform background complete — scroll morph + reduced-motion"
```
