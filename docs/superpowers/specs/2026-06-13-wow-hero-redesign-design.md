# Wow Hero Redesign — Approach C: Product Console + Audio-Reactive 3D

**Date:** 2026-06-13
**Status:** Approved design, pending implementation plan
**Owner:** Ali Fakih
**Successor of:** `2026-05-02-ribbon-waveform-design.md`

## Goal

Turn the TALKYS landing page into a continuous, audio-reactive scroll experience that earns "wow" without sacrificing the credibility a B2B buyer needs. The product must demonstrate itself within five seconds of arrival, in either Arabic or English, on either desktop or mobile.

## Constraints (decided during brainstorming)

| Decision | Outcome |
|---|---|
| Audience | All four — SMB restaurants/retail, vehicle dealerships, hotels/enterprise, investors/press |
| Primary outcome | Immediate understanding — visitor grasps what Talkys does in ≤5s |
| Scope | Full top-to-bottom orchestration (one continuous narrative, not a hero plus loose sections) |
| Audio | Central — real recorded AI voice agents are the wow lever |
| Mobile | Adapted — keeps audio + tabs + transcripts, simplifies motion |
| Bilingual | Geo-detect — Lebanon IPs default to Arabic+RTL, others to English. Manual toggle wins. |
| Engine | Existing **React Three Fiber + GSAP**. No PlayCanvas or new 3D dependencies. |

## Approach

**The Product Console with an audio-reactive 3D layer behind it.**

Three stacked layers:

1. **Ambient (Layer 1)** — gradient orbs + industry color tint. Fixed background.
2. **3D scene (Layer 2)** — the existing ribbon waveform, now driven by scroll progress AND live audio FFT data.
3. **Product UI (Layer 3)** — a new `Console` component that looks and behaves like the real Talkys admin panel. Lives at the center of the hero, then releases to normal flow on scroll.

The 3D never competes with the product UI. It listens to user behavior (scroll, tab clicks, audio playback) and reacts.

## Narrative — scroll-by-scroll

| # | Section | Story beat | 3D state | Color signature |
|---|---|---|---|---|
| 1 | Hero | "Talkys is taking calls right now" | Audio-reactive ribbon behind the live console | Active industry tint (default terracotta) |
| 2 | Problem | "Calls overflow. You lose orders." | Ribbon fragments | Muted, low saturation |
| 3 | Solution | "One agent. Every call. 24/7." | Fragments re-converge to a bright single thread | Brand teal, full saturation |
| 4 | HowItWorks | "Plug in → listen → respond → log." | Thread becomes a 4-node flow diagram | Teal + terracotta accents |
| 5 | Features | "What it actually does." | Network mesh (many calls in parallel) | Cool steel |
| 6 | SocialMedia | "Handles DMs and WhatsApp too." | Network grows tendrils to social icons | Multi-color |
| 7 | Industries | "Built for your business." | Network becomes interactive globe of LB call activity | Per-tab industry color |
| 8 | GettingStarted | "3 steps. Today." | Globe collapses to pulsing CTA ring | Terracotta, urgent |
| 9 | Footer | (existing) | Quiet decay back to idle ribbon | Dark |

Scroll progress maps to a single `uScroll` uniform 0→1 driving one continuous camera+mesh evolution. Sections are not 9 isolated animations; they are 9 keyframes on a single timeline.

## Architecture

### Layer 1 — Ambient (existing, extended)

- Keep current gradient orbs and `BackgroundCanvas`
- Add an `industry-theme` context provider exposing the active industry's color palette
- 600ms eased interpolation when theme changes

### Layer 2 — 3D scene (R3F, audio-reactive)

- Single canvas, rendered behind everything (`z-index: -1`, `pointer-events: none`)
- Two driving inputs:
  - `uScroll: float` — fed by GSAP ScrollTrigger watching `document.body`
  - `uAudioBands: float[8]` — fed by `AnalyserNode.getByteFrequencyData()`, downsampled to 8 bands, smoothed with a 4-frame moving average
- Idle behavior (no audio playing): current ribbon animation continues unchanged
- Active behavior (audio playing): bar amplitudes track `uAudioBands`, ribbon spine modulates with low-frequency band
- Morph state is a discrete enum `{ ribbon, fragments, thread, flow, network, social, globe, cta-ring }`; `useFrame` lerps between current and target geometry over ~400ms when the active section changes

### Layer 3 — Product Console (new)

```
┌─ Talkys Console ────────────── ● Live ─┐
│  [🍔 Restaurant] [🚗 Dealership]      │
│  [🏨 Hotel]      [🛒 Retail]          │
├────────────────────────────────────────┤
│  📞 Active Call · 00:42                │
│  Customer: +961 ▓▓▓▓▓▓                 │
│                                        │
│  > "بدي اطلب بيتزا للساعة ثمانية"    │  ← Typewriter transcript
│  > "تمام، أي نوع بيتزا تحبوا؟"         │
│                                        │
│  ━━━━━━━━━━━━━ ▶ Play sample call     │
│                                        │
│  ┌─ Today's calls ──────────────────┐ │
│  │ 47 handled · 0 missed · 4.8★    │ │
│  └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

**Components**

- `<Console>` — wrapper, owns active-tab state, emits `theme-change` events
- `<ConsoleTabs>` — `role="tablist"` with arrow-key navigation
- `<ActiveCall>` — typewriter transcript + audio control + caller info
- `<MetricStrip>` — today's stats per industry
- `<ConsoleTilt>` — wraps the console, applies CSS perspective transform from mousemove (desktop only)

**Behavior**

- Tab click → loads industry data (transcript, audio src, metrics), emits `theme-change` with the industry palette
- Play button click → resumes shared `AudioContext`, hooks the `<audio>` element through the `AnalyserNode`, starts captions
- Pause / tab away → suspends `AudioContext` to save battery
- Default: no audio plays until the user clicks Play. Explicit, no autoplay.

## Data model

```ts
type Industry = 'restaurant' | 'dealership' | 'hotel' | 'retail'

interface IndustryConfig {
  id: Industry
  label: { en: string; ar: string }
  icon: string
  palette: { primary: string; ambient: string; accent: string }
  demoCall: {
    audio: { en: string; ar: string }     // /audio/{industry}-{lang}.mp3
    captions: { en: string; ar: string }  // /captions/{industry}-{lang}.vtt
    duration: number                       // seconds
    caller: string                         // e.g. "+961 ●● ●● ●●"
  }
  metrics: { handled: number; missed: number; rating: number }
}
```

Lives in `src/data/industries.ts`. Demo calls are short (≤30s) MP3s — 4 industries × 2 languages = 8 files.

## Audio system

```
<audio>                                  R3F ribbon shader
  └─ MediaElementAudioSourceNode         ▲
     └─ AnalyserNode (fftSize=64)        │
        ├─ getByteFrequencyData()  ──────┘ (8-band uniform, every frame)
        └─ → AudioContext.destination      (heard by user)
```

- **One shared `AudioContext`** for the whole page. iOS requires it to be created or resumed inside a user gesture — the Play button handler does this.
- Captions: WebVTT cues parsed once on tab activation. Each cue triggers a typewriter render at its start time, character-by-character at ~28cps. Transcript scrolls as cues queue up.
- Lazy load: only the active tab's audio is fetched on demand. First paint ships zero audio bytes.

## Scroll choreography

- One master `ScrollTrigger` mapped to `body` scroll, output `uScroll: 0 → 1`
- Section anchors use `IntersectionObserver` (threshold 0.5) to set `currentSection`
- Section change → emits `theme-change` event and tells the R3F scene which `morphState` to lerp toward
- `useFrame` smoothly interpolates current state toward target — no abrupt jumps on fast scrolls

## Bilingual + geo-detect

- Edge middleware (Vercel `geolocation` header, or fallback to `Accept-Language`) sets `lang` cookie on first visit:
  - `LB` country code → `ar` + `dir="rtl"` + Arabic audio defaults
  - Anything else → `en` + `dir="ltr"` + English audio defaults
- Manual nav toggle always wins, persisted in `lang` cookie
- All copy lives in `src/i18n/{en,ar}.ts`. Existing sections refactor to read from i18n bundle.
- RTL pass: Tailwind `rtl:` variants, mirror only directional icons. Console tabs read RTL-naturally; transcripts already render correctly because they contain real Arabic.

## Mobile adaptation

| Feature | Desktop | Mobile |
|---|---|---|
| Console size | 720×440 floating card | Full-bleed stack |
| Console tilt | ±4° mouse parallax | Off (no mouse) |
| Ribbon point count | 120 | 60 |
| Scroll camera amplitude | 100% | 50% |
| Audio + transcript | ✓ | ✓ |
| Industry color theming | ✓ | ✓ |
| End-of-page convergence (deferred) | ✓ (if shipped) | Off |

## Accessibility

- `prefers-reduced-motion: reduce` → ribbon frozen to idle frame, scroll camera disabled, no tilt
- No autoplay audio anywhere
- Transcript is the source of truth for screen readers; audio is supplementary (`aria-hidden` on the audio control's decorative wave)
- Tabs: `role="tablist"` + arrow-key navigation + visible focus rings
- Keyboard: Play/Pause via Space when console is focused
- `prefers-contrast: more` → solid backgrounds replace gradient orbs

## Performance budget

| Metric | Target |
|---|---|
| Initial JS gzip | ≤180KB (current ~120KB + ~50–60KB for new code) |
| First-meaningful-paint | ≤2.0s on 4G / mid-tier Android |
| FPS during scroll+audio | 60 desktop, 30+ mobile |
| Audio bytes on first paint | 0 (lazy per tab) |
| Per-MP3 size | ~40KB gzipped |

**Fallbacks**

- No WebGL → Layer 2 hidden, Layers 1 and 3 still work; site fully usable
- No `AudioContext` (rare, very old browsers) → audio plays via raw `<audio>`, ribbon stays in idle mode
- Reduced motion → no animation, still fully functional

## Implementation phases

The phases ship independently — each is a release.

### Phase 1 (weeks 1–2) — The Console
- Build `<Console>`, `<ConsoleTabs>`, `<ActiveCall>`, `<MetricStrip>`
- Record + master 4 demo calls in English (Arabic deferred to Phase 3)
- Wire audio playback (plain `<audio>`, no AnalyserNode yet)
- Replace current hero copy with the console
- Ship: even without the 3D reactive layer, this is a meaningful upgrade

### Phase 2 (weeks 3–4) — The reactive 3D
- Add `AnalyserNode`, plumb 8-band uniform into the ribbon shader (moment #1)
- Implement scroll-driven `morphState` keyframes for all 9 sections (moment #3)
- Add `<ConsoleTilt>` wrapper (moment #4)
- Cross-browser test: Safari/iOS audio quirks, Firefox ScrollTrigger

### Phase 3 (week 5) — Theming + bilingual
- Industry-color theming pipeline (moment #2)
- Record + master 4 Arabic demo calls
- Edge middleware for geo-detect
- RTL pass + i18n bundles
- Manual language toggle in nav

### Deferred
- Moment #5 (inter-section morphs) — explicitly cut for risk of looking gimmicky
- Moment #6 (end-of-page convergence) — ship if budget allows after Phase 3

## File-level changes

```
src/
  components/
    Console/
      index.tsx              [new]
      ConsoleTabs.tsx        [new]
      ActiveCall.tsx         [new]
      MetricStrip.tsx        [new]
      ConsoleTilt.tsx        [new]
    BackgroundCanvas.tsx     [edit — accept uAudioBands, morphState props]
  audio/
    AudioGraph.ts            [new — shared AudioContext + AnalyserNode]
    useAudioBands.ts         [new — hook exposing 8-band Float32Array]
  context/
    IndustryThemeContext.tsx [new — active industry + palette]
  data/
    industries.ts            [new]
  i18n/
    en.ts                    [new]
    ar.ts                    [new]
  sections/
    HeroSection.tsx          [edit — host the Console]
    *.tsx                    [edit — i18n + RTL pass]
  utils/
    ribbonUtils.ts           [edit — morphState support]

public/
  audio/                     [new — 8 MP3s]
  captions/                  [new — 8 VTTs]

middleware.ts                [new — geo-detect cookie]
```

## Out of scope

- New design system / component library — keep current shadcn setup
- Backend changes — demos are pre-recorded, no live AI calls on the site (deferred to a future "live demo" feature)
- Analytics rework — keep current GA setup
- Auth / dashboard — this is marketing only

## Open questions for implementation planning

These do not block design approval but the implementation plan must answer them:

1. Demo call scripts — who writes them? (Suggest: one operator interview per industry, 30s scripted recording)
2. Voice talent — use Talkys' actual production voice agents, or hire a voice actor? Production is more authentic; actor is faster.
3. Hosting platform — Vercel (assumed for edge geo-detect) or other? Confirm before middleware design.

---

**Next step:** invoke `writing-plans` skill to produce an executable implementation plan.
