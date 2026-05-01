# 3D Background Animation — Design Spec
**Date:** 2026-05-02  
**Status:** Approved

---

## Overview

A full-page ambient 3D canvas for the TALKYS website. A wireframe globe slowly rotates at the top of the page, then unravels its grid lines into a rippling wave grid as the user scrolls down. The animation is purely decorative — low opacity, non-interactive, and always behind page content.

---

## Architecture

### Files Changed

| File | Action |
|------|--------|
| `src/components/BackgroundCanvas.tsx` | Create — full 3D canvas component |
| `src/App.tsx` | Modify — mount `<BackgroundCanvas />` as first child |

No other files are touched. The canvas is fully decoupled from page sections.

### Component Tree

```
App
└── BackgroundCanvas        (position: fixed, z-index: -1, pointer-events: none)
    └── Canvas (R3F)
        └── MorphMesh       (owns all geometry, morph, and scroll logic)
```

---

## Geometry & Morph

### Vertex Match Strategy

Both geometries are constructed with identical segment counts so they morph vertex-to-vertex:

- **Globe:** `SphereGeometry(2.5, 32, 32)` → 33×33 = **1089 vertices**
- **Wave plane:** `PlaneGeometry(18, 12, 32, 32)` → 33×33 = **1089 vertices**

Both sets of positions are stored in typed arrays at mount time. No geometry is recreated at runtime.

### Morph Formula

On each animation frame, vertex positions are computed as:

```js
morphed.x = lerp(sphere.x, plane.x, progress)
morphed.y = lerp(sphere.y, plane.y + wave, progress)
morphed.z = lerp(sphere.z, plane.z, progress)
```

Where `wave = amplitude × sin(plane.x × frequency + time)` — a live sine ripple applied to the wave-plane end state.

### Rendering

- `wireframe: true` on a `LineBasicMaterial` — one draw call
- A second material pass colors every 8th longitude line in the terracotta accent color
- Globe continuously rotates on Y axis at **0.003 rad/frame**
- Wave grid ripples via a `time` value incremented each frame

---

## Scroll Behavior

```js
scrollRatio    = scrollY / (documentHeight - windowHeight)   // 0 → 1
morphProgress  = clamp(scrollRatio / 0.65, 0, 1)             // completes at 65% scroll
```

The morph is fully complete by the time the user reaches the Features section (~65% down the page). The globe rotation and wave ripple continue independently of scroll at all times.

---

## Camera & Positioning

- Camera: `position={[0, 0, 6]}`, looking at origin
- Globe offset: `x: 0.8` — slightly right of center to avoid competing with hero text
- Wave grid: horizontal, fills the lower viewport

---

## Colors & Opacity

| Mode | Primary lines | Accent lines (every 8th longitude) | Opacity |
|------|--------------|-------------------------------------|---------|
| Dark | `#1A8FA8` | `#E07A5F` | 0.25 |
| Light | `#0F4C5C` | `#C96A52` | 0.15 |

Theme is read from `document.documentElement.classList` on mount and on theme change via a `MutationObserver`.

---

## Performance

| Setting | Value |
|---------|-------|
| Vertex count | 1089 |
| Draw calls | 1 (wireframe mesh) |
| Pixel ratio (desktop) | up to 2× |
| Pixel ratio (mobile) | capped at 1.5× via `dpr={[1, 1.5]}` |
| Frame budget | passive — no scroll jank, uses `requestAnimationFrame` |

---

## Accessibility

- `prefers-reduced-motion: reduce` → morph disabled (globe only), rotation drops to 0.0005 rad/frame
- Canvas has `aria-hidden="true"` — purely decorative, invisible to screen readers

---

## Dependencies

All already installed — no new packages required:

- `three` 0.183.2
- `@react-three/fiber` 9.5.0
- `@react-three/drei` 10.7.7
