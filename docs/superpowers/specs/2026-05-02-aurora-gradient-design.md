# Design Spec — Aurora Gradient Mesh Background (Option 2)

**Date:** 2026-05-02  
**Status:** Approved for implementation

## Concept

Replace the current globe→wave BackgroundCanvas with a slow-drifting aurora — large coloured light blobs that blend in "screen" mode, creating a Northern Lights effect. Used by Vercel, Luma AI, Perplexity. No hard geometry; pure colour and light. Works behind any content without competing with it.

## Visual Behaviour

- **Idle state:** 5 large radial gradient blobs drift slowly across the canvas on independent Lissajous paths. Blobs use `screen` blending so overlapping areas produce luminous additive colour — never muddy.
- **Scroll morph:** At 0% scroll the blobs are dim and centred. As the user scrolls, amplitude of drift increases and a subtle grain texture intensifies — the aurora "wakes up" as you go deeper into the page. At 100% the colours shift warmer (more terracotta) to match the CTA mood.
- **Grain overlay:** A static noise texture (generated once on canvas) is composited at low opacity over the aurora for a cinematic film-grain feel — prevents the look from feeling too "CSS gradient."
- **Reduced motion:** Blobs freeze in their initial positions; only the slow breath-pulse continues (3s ease-in-out).

## Technical Approach

**Option A — Pure CSS + React (lightest):**  
5 `div` elements with `radial-gradient` backgrounds, animated with `@keyframes` on `transform: translate()`. Grain via an SVG `<feTurbulence>` filter. Zero WebGL, works on any device.

**Option B — WebGL Fragment Shader (richest):**  
Full-screen `PlaneGeometry` with a GLSL fragment shader. Shader sums 5 `smoothstep` radial blobs driven by `sin/cos` of `time` uniform. Additive blending in-shader. Grain via `fract(sin(dot(uv, vec2(12.9898,78.233)))*43758.5453)`. Scroll passed as `uScrollProgress` uniform to shift blob positions and colour temperature.

**Recommendation: Option B** — richer visuals, GPU-driven, no layout reflow.

## Files Changed

| File | Change |
|------|--------|
| `src/components/BackgroundCanvas.tsx` | Full replacement — AuroraMesh replaces MorphMesh |
| `src/utils/auroraUtils.ts` | New — blob config, colour lerp helpers |
| `src/utils/auroraUtils.test.ts` | New — unit tests for colour lerp |

## Blob Configuration

| Blob | Colour | Speed | Phase |
|------|--------|-------|-------|
| 1 | `#6366f1` indigo | 0.00031 | 0.0 |
| 2 | `#1A8FA8` teal | 0.00027 | 1.1 |
| 3 | `#E07A5F` terracotta | 0.00035 | 2.2 |
| 4 | `#8b5cf6` violet | 0.00029 | 3.3 |
| 5 | `#06b6d4` cyan | 0.00033 | 4.4 |

## Success Criteria

- Aurora visible on dark mode (primary use case); subtler on light mode
- 60fps on Chrome/Safari desktop — no layout reflow
- Scroll drives drift amplitude and colour temperature shift
- Grain overlay present without performance hit
- Reduced-motion respected
- Build passes, no TypeScript errors
