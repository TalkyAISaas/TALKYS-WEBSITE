# Design Spec — 3D Ribbon Waveform Background (Option 1)

**Date:** 2026-05-02  
**Status:** Approved for implementation

## Concept

Replace the current globe→wave BackgroundCanvas with a luminous 3D ribbon that twists and breathes like a living voice signal. Inspired by ElevenLabs, Suno, Udio. The ribbon is the visual metaphor for TALKYS: a voice, alive, continuous, intelligent.

## Visual Behaviour

- **Idle state (hero):** 6 ribbon layers stacked with slight Y offset to create 3D depth. Each layer is a sine-wave path animated with time. Front layers are brighter and thicker; back layers are dimmer and thin. Colors shift from indigo (back) → teal (mid) → terracotta (front accent).
- **Scroll morph:** As the user scrolls 0→100%, the ribbon amplitude increases and frequency shifts. At 0% scroll: flat/calm slow sine. At 50%: full 3D ribbon with fast oscillation. At 100%: ribbon flattens back to calm — order taken, resolved.
- **Centre spine:** A single bright white line sits at the geometric centre of all layers — the "voice" itself.
- **Reduced motion:** All animation stops; ribbon renders as a static flat line.

## Technical Approach

- **Geometry:** `TubeGeometry` built from a `CatmullRomCurve3` of ~80 control points. Control points are updated each frame by a sine function driven by `time` uniform and `scrollProgress`.
- **Material:** Custom `ShaderMaterial` — vertex shader displaces control points; fragment shader applies depth-based color lerp (indigo → teal → terracotta) and a fresnel rim glow.
- **Layers:** 6 `Mesh` instances sharing the same curve logic, each with a `yOffset` and `depthScale` prop passed as uniforms.
- **Scroll:** `window.scroll` listener writes into a `useRef` — no React re-renders.
- **Performance:** `DynamicDrawUsage` on position buffer. Single `useFrame` loop. Target 60fps on mid-range devices.

## Files Changed

| File | Change |
|------|--------|
| `src/components/BackgroundCanvas.tsx` | Full replacement — RibbonMesh replaces MorphMesh |
| `src/utils/ribbonUtils.ts` | New — control point math, curve building, color lerp |
| `src/utils/ribbonUtils.test.ts` | New — unit tests for math functions |

## Colors

- Back layers: `#6366f1` (indigo) at opacity 0.3
- Mid layers: `#1A8FA8` (teal) at opacity 0.5  
- Front accent: `#E07A5F` (terracotta) at opacity 0.6
- Centre spine: `rgba(255,255,255,0.7)`

## Success Criteria

- Ribbon visible on dark and light mode
- Smooth 60fps on Chrome/Safari desktop
- Scroll drives amplitude/frequency change
- Reduced-motion respected
- Build passes, no TypeScript errors
