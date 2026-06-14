# Talkys Bright Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the entire Talkys marketing site to match the bright cream + coral aesthetic from `3d-effects-demo.html` — keep all existing content (Console, 4 problem cards, 5-step flow, 9 features, 8 industries, social, full form), drop dark mode + 3D background, add Testimonials + Logo Marquee sections, the Aria agent orb, and the floating brand tiles in the hero.

**Architecture:** Light-only design driven by CSS custom properties (`--bg`, `--accent`, etc.) defined once in `src/index.css`, mirrored in Tailwind theme tokens. Reusable `ChipEyebrow` component for every section header. Shared keyframes (bob-tile, orb-breathe, orb-ripple, step-active, scroll-logos, wave-pulse) live in `index.css`. The existing i18n infrastructure stays; section components keep their `useT()` calls and only their visual layer changes. The `ThemeContext`, `BackgroundCanvas`, and `FloatingObjects` are removed.

**Tech Stack:**
- React 19 + TypeScript + Vite (unchanged)
- Tailwind CSS 3.4 — strip `darkMode`, replace warm-token semantics
- New webfonts: Caveat (handwriting accent) + keep Inter/Outfit
- `vanilla-tilt` (~6KB) added for the bento-cell card tilts in Features
- No more `three`, `@react-three/fiber`, `@react-three/drei` imports — packages remain in `package.json` (cleanup out of scope)
- All existing i18n keys preserved; ~10 new keys added (testimonials, trust strip, scribble)

**Reference:** `/Users/alfakih/Documents/TALKYS-WEBSITE/3d-effects-demo.html` is the source of truth for visuals. Open it in a browser before working on Phase B tasks.

---

## File Structure

**New files (Phase A + C):**
- `src/components/ChipEyebrow.tsx` — `<ChipEyebrow>FEATURES</ChipEyebrow>` reusable header chip.
- `src/components/AccentItalic.tsx` — `<AccentItalic>Word</AccentItalic>` semantic wrapper that renders a coral italic span. (One-line helper that section headers use.)
- `src/sections/TestimonialsSection.tsx` — new section with 3 testimonial cards.
- `src/sections/LogoMarqueeSection.tsx` — new section: infinite horizontal-scrolling logo strip.
- `src/components/HeroFloatingTiles.tsx` — 4 absolute-positioned bobbing icon tiles for the hero corners.
- `src/components/HeroArcs.tsx` — full-bleed SVG concentric arcs as hero background.
- `src/components/AriaOrb.tsx` — breathing orb + 3 expanding rings + label, used in `SolutionSection`.

**Modified files:**
- `src/App.tsx` — drop `ThemeProvider`, `BackgroundCanvas`, `FloatingObjects`. Insert `TestimonialsSection` and `LogoMarqueeSection` between Industries and GettingStarted.
- `src/main.tsx` — no functional change; LocaleProvider still wraps.
- `index.html` — drop `lang="en"` (LocaleProvider sets it at runtime; keep as initial value) and set `<html>` background color via inline style to avoid white flash before CSS loads.
- `tailwind.config.js` — drop `darkMode`, retune `colors` to the new palette, add Caveat to font families, add new shadow utilities, register the new keyframes.
- `src/index.css` — drop `.dark` and `:root:not(.dark)` override blocks; load Caveat font; redefine `:root` CSS variables; add shared component classes (`chip-eyebrow`, `accent-italic`, `bob-tile`, `orb-breathe`, `orb-ripple`, `step-active`, `scroll-logos`, `wave-pulse`).
- `src/sections/Navigation.tsx` — cream blurred bg, dot logo, plain dark CTA, drop theme toggle, drop dark: variants.
- `src/sections/HeroSection.tsx` — drop video bg, drop gradient orbs, drop animate-on-scroll observer mess; insert `<HeroArcs>` + `<HeroFloatingTiles>` + chip eyebrow + giant headline (with `AccentItalic`) + light buttons + scribble + trust strip. Keep `<Console>` below the trust strip, untouched in structure.
- `src/sections/ProblemSection.tsx` — restyle 4 cards: white bg, italic coral stat replaces the image, hover lift, chip eyebrow.
- `src/sections/SolutionSection.tsx` — replace agent-card cycler with `<AriaOrb>` on the right; restyle bullets list and chip eyebrow on the left; cream-soft section bg.
- `src/sections/HowItWorksSection.tsx` — convert to 5-step stepper with traveling coral pulse + step-active cycling animation. Keeps all 5 steps and existing translation keys.
- `src/sections/FeaturesSection.tsx` — restyle 9-card grid to white-on-cream bento. Add tilt to all cards (`vanilla-tilt`). The "Live Analytics" feature card gets the demo's waveform visual.
- `src/sections/SocialMediaSection.tsx` — restyle phone preview + integration grid in the new aesthetic.
- `src/sections/IndustriesSection.tsx` — chip eyebrow, hover-coral icon on each tab card, restyled active panel.
- `src/sections/GettingStartedSection.tsx` — white form card on cream bg with coral and teal radial glows; coral submit button.
- `src/sections/FooterSection.tsx` — convert to dark navy footer with newsletter input + dark social pill buttons. (Intentional dark accent on a light page — matches demo.)
- `src/components/Console/index.tsx` — adjust shell to cream palette: white bg, soft shadow, no backdrop blur.
- `src/components/Console/ConsoleTabs.tsx` — active tab pill becomes coral (`#0e4f5c` → coral on active per demo language).
- `src/components/Console/MetricStrip.tsx` — neutral white card, no change to logic.
- `src/components/Console/ActiveCall.tsx` — no logic change; restyle play button + progress bar.
- `src/i18n/translations/en.ts` — add `hero.trustStrip`, `hero.trustLogos`, `hero.scribble`, `testimonials.*`, `marquee.cta`.
- `src/i18n/translations/ar.ts` — mirror the new keys with Arabic translations.

**Deleted files:**
- `src/context/ThemeContext.tsx` — dark mode removed.
- `src/components/BackgroundCanvas.tsx` — 3D bg removed.
- `src/components/FloatingObjects.tsx` — 3D floats removed.

**Untouched:**
- All test files for `captions`, `typewriter`, `geo`, `translate`, `morphUtils`, `ribbonUtils`, `industries`.
- `src/data/industries.ts` (bilingual labels + audio/caption paths still apply).
- `src/utils/*.ts` (caption parsing, etc.).

---

## Phase A — Foundation

### Task 1: Remove dark mode and 3D background imports

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/sections/Navigation.tsx` (remove theme toggle JSX only — full restyle is Task 6)
- Delete: `src/context/ThemeContext.tsx`
- Delete: `src/components/BackgroundCanvas.tsx`
- Delete: `src/components/FloatingObjects.tsx`

- [ ] **Step 1: Rewrite `src/App.tsx`**

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
import TestimonialsSection from './sections/TestimonialsSection';
import LogoMarqueeSection from './sections/LogoMarqueeSection';
import GettingStartedSection from './sections/GettingStartedSection';
import FooterSection from './sections/FooterSection';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <SocialMediaSection />
        <IndustriesSection />
        <TestimonialsSection />
        <LogoMarqueeSection />
        <GettingStartedSection />
      </main>
      <FooterSection />
    </div>
  );
}

export default App;
```

Note: imports for `TestimonialsSection` and `LogoMarqueeSection` reference files that don't yet exist. Task 16 and 17 create them. To keep the build green between tasks, the implementer should create temporary placeholder files in this step:

```tsx
// src/sections/TestimonialsSection.tsx (placeholder)
const TestimonialsSection = () => null;
export default TestimonialsSection;
```

```tsx
// src/sections/LogoMarqueeSection.tsx (placeholder)
const LogoMarqueeSection = () => null;
export default LogoMarqueeSection;
```

- [ ] **Step 2: Strip the theme toggle from `src/sections/Navigation.tsx`**

The file currently imports `Sun, Moon` from lucide-react and `useTheme` from `../context/ThemeContext`. Remove those imports and remove the two `<button>` elements that render `Sun`/`Moon`. Keep the `<LanguageSwitcher />` placement.

Specifically remove these imports:
```tsx
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
```

Replace with:
```tsx
import { Menu, X } from 'lucide-react';
```

Remove the line `const { theme, toggleTheme } = useTheme();` from inside the component.

Remove the two theme toggle `<button>` blocks (desktop + mobile) — they contain `onClick={toggleTheme}` and render `theme === 'light' ? <Moon … /> : <Sun … />`. Delete the entire surrounding `<button>` in both the desktop and mobile button rows.

Do NOT yet restyle Navigation further — that's Task 6.

- [ ] **Step 3: Delete three files**

```bash
rm src/context/ThemeContext.tsx
rm src/components/BackgroundCanvas.tsx
rm src/components/FloatingObjects.tsx
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json`

Expected: clean. If there are import errors for `ThemeContext` from any file, grep them out:
```bash
rg "ThemeContext|BackgroundCanvas|FloatingObjects|useTheme" src/
```
The only remaining hits should be in deleted-file path strings or comments. If the grep returns code references, edit those files to remove the import.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/sections/Navigation.tsx src/sections/TestimonialsSection.tsx src/sections/LogoMarqueeSection.tsx
git rm src/context/ThemeContext.tsx src/components/BackgroundCanvas.tsx src/components/FloatingObjects.tsx
git commit -m "refactor: drop dark mode + 3D background, scaffold new section files"
```

---

### Task 2: Update CSS tokens, fonts, and Tailwind config to the bright palette

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Modify: `index.html` (set initial body bg to avoid flash)

- [ ] **Step 1: Replace `tailwind.config.js` entirely**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'bg-soft': 'hsl(var(--bg-soft))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          soft: 'hsl(var(--accent-soft))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        // Brand hex values (used where we explicitly want them — gradients, shadows)
        teal: { DEFAULT: '#0e4f5c', light: '#156675' },
        coral: { DEFAULT: '#e57756', soft: '#f5a585' },
        cream: { DEFAULT: '#fdf9f5', soft: '#f7efe7' },
        navy: '#1a1f2e',
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      boxShadow: {
        tile: '0 18px 40px -10px rgba(14,79,92,0.14), 0 4px 12px -4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
        card: '0 14px 36px -14px rgba(14,79,92,0.18), 0 2px 8px -2px rgba(0,0,0,0.04)',
        'card-hover': '0 24px 50px -18px rgba(14,79,92,0.22)',
        coral: '0 12px 30px -10px rgba(229,119,86,0.55)',
        'coral-strong': '0 20px 50px -18px rgba(229,119,86,0.55)',
      },
      borderRadius: {
        'pill': '999px',
      },
      keyframes: {
        'bob-tile': {
          '0%,100%': { transform: 'rotate(var(--rot, 0deg)) translateY(0)' },
          '50%':     { transform: 'rotate(var(--rot, 0deg)) translateY(-14px)' },
        },
        'orb-breathe': {
          '0%,100%': { transform: 'translate(-50%, -50%) scale(1)' },
          '50%':     { transform: 'translate(-50%, -50%) scale(1.05)' },
        },
        'orb-ripple': {
          '0%':   { width: '120px', height: '120px', opacity: '0.6', borderWidth: '1.5px' },
          '100%': { width: '420px', height: '420px', opacity: '0',   borderWidth: '0.5px' },
        },
        'live-blink': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.4' },
        },
        'wave-pulse': {
          '0%,100%': { height: '10%', opacity: '0.55' },
          '50%':     { height: '95%', opacity: '1' },
        },
        'scroll-logos': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'travel-pulse': {
          '0%':   { left: '16%', opacity: '0', transform: 'scale(0.8)' },
          '4%':   { left: '16%', opacity: '1', transform: 'scale(1.2)' },
          '30%':  { left: '16%', opacity: '1', transform: 'scale(1.2)' },
          '37%':  { left: '50%', opacity: '1', transform: 'scale(1.2)' },
          '63%':  { left: '50%', opacity: '1', transform: 'scale(1.2)' },
          '70%':  { left: '84%', opacity: '1', transform: 'scale(1.2)' },
          '96%':  { left: '84%', opacity: '1', transform: 'scale(1.2)' },
          '100%': { left: '84%', opacity: '0', transform: 'scale(0.8)' },
        },
        'step-active': {
          '0%, 30%': {
            transform: 'translateY(-8px)',
            background: '#fef4ed',
            borderColor: 'rgba(229,119,86,0.45)',
            boxShadow: '0 26px 56px -16px rgba(229,119,86,0.38), 0 6px 18px -8px rgba(229,119,86,0.25)',
          },
          '33%, 100%': {
            transform: 'translateY(0)',
            background: '#fff',
            borderColor: 'rgba(0,0,0,0.06)',
            boxShadow: '0 14px 36px -14px rgba(14,79,92,0.18), 0 2px 8px -2px rgba(0,0,0,0.04)',
          },
        },
        'chip-active': {
          '0%, 30%': {
            background: 'rgba(229,119,86,0.14)',
            borderColor: 'rgba(229,119,86,0.4)',
          },
          '33%, 100%': {
            background: '#fdf9f5',
            borderColor: 'rgba(0,0,0,0.06)',
          },
        },
      },
      animation: {
        'bob-tile': 'bob-tile 5s ease-in-out infinite',
        'orb-breathe': 'orb-breathe 3s ease-in-out infinite',
        'orb-ripple': 'orb-ripple 4s ease-out infinite',
        'live-blink': 'live-blink 2s ease-in-out infinite',
        'wave-pulse': 'wave-pulse 1.4s ease-in-out infinite',
        'scroll-logos': 'scroll-logos 30s linear infinite',
        'travel-pulse': 'travel-pulse 9s ease-in-out infinite',
        'step-active': 'step-active 9s ease-in-out infinite',
        'chip-active': 'chip-active 9s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

Key changes from old config: no `darkMode`, no `cream`/`sand`/`beige`/`navy.light`/`navy.lighter` (those mapped to old palette), no warm color tokens (`terracotta`, `charcoal`). New tokens: `coral`, `accent.soft`, `bg-soft`, `script` font family, all demo-derived keyframes registered.

- [ ] **Step 2: Replace `src/index.css` entirely**

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 30 60% 97%;        /* #fdf9f5 cream */
    --bg-soft:    27 51% 94%;        /* #f7efe7 soft cream */
    --foreground: 224 26% 14%;       /* #1a1f2e dark navy */
    --card: 0 0% 100%;
    --card-foreground: 224 26% 14%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 26% 14%;
    --primary: 192 76% 21%;          /* #0e4f5c teal */
    --primary-foreground: 0 0% 100%;
    --secondary: 27 51% 94%;
    --secondary-foreground: 224 26% 14%;
    --muted: 27 30% 92%;
    --muted-foreground: 220 9% 46%;  /* #6b7280 */
    --accent: 14 71% 62%;            /* #e57756 coral */
    --accent-soft: 16 86% 73%;       /* #f5a585 */
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 0% / 0.06;        /* rgba(0,0,0,0.06) */
    --input: 0 0% 0% / 0.06;
    --ring: 14 71% 62%;
    --radius: 1rem;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'Inter', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', system-ui, sans-serif;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', system-ui, sans-serif;
    letter-spacing: -0.02em;
  }

  html[dir='rtl'] body {
    font-family: 'Noto Sans Arabic', 'Inter', system-ui, sans-serif;
  }
  html[dir='rtl'] h1,
  html[dir='rtl'] h2,
  html[dir='rtl'] h3,
  html[dir='rtl'] h4 {
    font-family: 'Noto Sans Arabic', 'Outfit', system-ui, sans-serif;
    letter-spacing: 0;
  }
}

@layer components {
  /* Chip eyebrow shared style for every section header */
  .chip-eyebrow {
    @apply inline-flex items-center gap-2.5 bg-white border border-black/[0.06] px-3.5 py-1.5 rounded-lg text-[11.5px] font-semibold tracking-[0.22em] text-foreground;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }
  .chip-eyebrow .bracket {
    @apply text-accent font-bold text-[13px];
  }

  /* Headline accent — italic coral */
  .accent-italic {
    @apply text-accent italic;
  }

  /* Section headlines */
  .giant-headline {
    @apply font-heading font-bold text-foreground;
    font-size: clamp(48px, 8.5vw, 92px);
    letter-spacing: -0.035em;
    line-height: 1;
  }
  .section-headline {
    @apply font-heading font-bold text-foreground;
    font-size: clamp(34px, 5vw, 56px);
    letter-spacing: -0.03em;
    line-height: 1.05;
  }

  /* CTA buttons */
  .btn-coral {
    @apply bg-accent text-white border-0 px-7 py-[15px] rounded-xl text-[15px] font-semibold cursor-pointer transition-transform;
    box-shadow: 0 12px 30px -10px rgba(229,119,86,0.55);
  }
  .btn-coral:hover { transform: translateY(-2px); }

  .btn-dark {
    @apply bg-navy text-white border-0 px-7 py-[15px] rounded-xl text-[15px] font-semibold cursor-pointer transition-transform;
  }
  .btn-dark:hover { transform: translateY(-2px); }

  /* Handwritten scribble (used near hero CTA) */
  .scribble {
    @apply absolute flex items-end gap-1 pointer-events-none;
    top: 100%;
    left: 40px;
    margin-top: 8px;
  }
  .scribble svg { width: 60px; height: 38px; flex-shrink: 0; }
  .scribble .script {
    @apply font-script text-accent;
    font-size: 22px;
    font-weight: 500;
    white-space: nowrap;
    transform: rotate(-3deg);
    line-height: 1;
  }
}

@layer utilities {
  .text-balance { text-wrap: balance; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.22); }

/* Selection */
::selection { background: rgba(229,119,86,0.25); color: inherit; }

/* Focus styles */
button:focus-visible, a:focus-visible {
  outline: 2px solid #e57756;
  outline-offset: 2px;
}
```

Old `:root:not(.dark)` and `.dark` overrides, the existing `card-gradient-border`/`card-dark`/`waveform-bar`/`gradient-orb`/`futuristic-grid`/`section-divider`/`ripple-ring`/`slideInFromRight` etc. helpers are GONE. Any section that referenced them must be rewritten in subsequent tasks. (If the build fails mid-restyle, that's expected — only Task 20 final QA confirms green.)

- [ ] **Step 3: Update `index.html`**

Replace the body of `index.html` with:

```html
<!doctype html>
<html lang="en" style="background:#fdf9f5">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Talkys — AI Voice Agents</title>
  </head>
  <body style="background:#fdf9f5">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

The inline background avoids a white flash before the Tailwind layer paints.

- [ ] **Step 4: Verify Tailwind compiles**

Run: `npm run build`

Expected: builds. There WILL be classnames in section files that no longer exist (e.g., `card-gradient-border`, `gradient-orb`). Tailwind will simply ignore unknown utility names. The build won't fail. Visual breakage is expected until Phase B is complete.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js src/index.css index.html
git commit -m "feat(design): introduce cream/coral palette, Caveat font, and shared keyframes"
```

---

### Task 3: Add `ChipEyebrow` and `AccentItalic` shared components + install vanilla-tilt

**Files:**
- Create: `src/components/ChipEyebrow.tsx`
- Create: `src/components/AccentItalic.tsx`
- Modify: `package.json` (add vanilla-tilt)

- [ ] **Step 1: Create `src/components/ChipEyebrow.tsx`**

```tsx
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function ChipEyebrow({ children, className = '' }: Props) {
  return (
    <div className={`chip-eyebrow ${className}`}>
      <span className="bracket" aria-hidden="true">‹</span>
      <span>{children}</span>
      <span className="bracket" aria-hidden="true">›</span>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/AccentItalic.tsx`**

```tsx
import type { ReactNode } from 'react';

export function AccentItalic({ children }: { children: ReactNode }) {
  return <span className="accent-italic">{children}</span>;
}
```

- [ ] **Step 3: Install `vanilla-tilt`**

```bash
npm install vanilla-tilt
```

Verify it was added to `dependencies` in `package.json`.

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json`

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/ChipEyebrow.tsx src/components/AccentItalic.tsx package.json package-lock.json
git commit -m "feat(design): add ChipEyebrow + AccentItalic shared components and vanilla-tilt dep"
```

---

### Task 4: Add hero ornament components (HeroArcs + HeroFloatingTiles) and the AriaOrb

**Files:**
- Create: `src/components/HeroArcs.tsx`
- Create: `src/components/HeroFloatingTiles.tsx`
- Create: `src/components/AriaOrb.tsx`

- [ ] **Step 1: Create `src/components/HeroArcs.tsx`**

```tsx
export function HeroArcs() {
  return (
    <svg
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="rgba(14,79,92,0.08)" strokeWidth="1">
        <circle cx="800" cy="450" r="900" />
        <circle cx="800" cy="450" r="1100" />
        <circle cx="800" cy="450" r="1300" />
        <circle cx="800" cy="450" r="1500" />
        <circle cx="800" cy="450" r="1700" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/HeroFloatingTiles.tsx`**

```tsx
import { Phone, Headphones, Calendar, Sparkles } from 'lucide-react';

interface TileProps {
  position: 'tl' | 'tr' | 'bl' | 'br';
  rotation: number;
  delay: number;
  Icon: typeof Phone;
}

const POSITION_CLASS: Record<TileProps['position'], string> = {
  tl: 'top-[14%] left-[8%]',
  tr: 'top-[14%] right-[8%]',
  bl: 'bottom-[22%] left-[9%]',
  br: 'bottom-[22%] right-[9%]',
};

function FloatingTile({ position, rotation, delay, Icon }: TileProps) {
  return (
    <div className={`absolute z-[1] ${POSITION_CLASS[position]}`}>
      <div
        className="w-[88px] h-[88px] bg-white rounded-[22px] flex items-center justify-center shadow-tile text-primary animate-bob-tile"
        style={{ ['--rot' as string]: `${rotation}deg`, animationDelay: `${delay}s` }}
      >
        <Icon className="w-8 h-8" strokeWidth={2} />
      </div>
    </div>
  );
}

export function HeroFloatingTiles() {
  return (
    <>
      <FloatingTile position="tl" rotation={-12} delay={0}   Icon={Phone} />
      <FloatingTile position="tr" rotation={10}  delay={1}   Icon={Headphones} />
      <FloatingTile position="bl" rotation={-8}  delay={2}   Icon={Calendar} />
      <FloatingTile position="br" rotation={14}  delay={0.5} Icon={Sparkles} />
    </>
  );
}
```

- [ ] **Step 3: Create `src/components/AriaOrb.tsx`**

```tsx
import { Headphones } from 'lucide-react';
import { useT } from '@/context/LocaleContext';

export function AriaOrb() {
  const t = useT();
  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      {/* Three expanding rings */}
      <span
        className="absolute top-1/2 left-1/2 border-[1.5px] border-accent/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-orb-ripple"
        style={{ width: 120, height: 120, animationDelay: '0s' }}
        aria-hidden="true"
      />
      <span
        className="absolute top-1/2 left-1/2 border-[1.5px] border-accent/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-orb-ripple"
        style={{ width: 120, height: 120, animationDelay: '1.3s' }}
        aria-hidden="true"
      />
      <span
        className="absolute top-1/2 left-1/2 border-[1.5px] border-accent/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-orb-ripple"
        style={{ width: 120, height: 120, animationDelay: '2.6s' }}
        aria-hidden="true"
      />

      {/* Breathing core */}
      <div
        className="absolute top-1/2 left-1/2 w-[110px] h-[110px] rounded-full flex items-center justify-center text-white animate-orb-breathe z-[3]"
        style={{
          background: 'linear-gradient(135deg, #0e4f5c 0%, #e57756 100%)',
          boxShadow: '0 20px 50px -10px rgba(229,119,86,0.5)',
        }}
      >
        <Headphones className="w-9 h-9" strokeWidth={2} />
      </div>

      {/* Label */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-[13px] text-muted-foreground tracking-[0.04em] whitespace-nowrap">
        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 align-middle animate-live-blink shadow-[0_0_6px_#16a34a]" />
        <strong className="text-foreground font-bold">{t('solution.ariaName') as string}</strong>
        <span> · {t('solution.ariaTagline') as string}</span>
      </div>
    </div>
  );
}
```

Note: `solution.ariaName` and `solution.ariaTagline` are new translation keys added in Task 18.

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json`

Expected: clean. The unresolved `solution.ariaName` is a string lookup, not a compile-time check — it resolves at runtime to the key itself (with a dev warn) until Task 18 adds the keys. That's acceptable for now.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroArcs.tsx src/components/HeroFloatingTiles.tsx src/components/AriaOrb.tsx
git commit -m "feat(design): add HeroArcs, HeroFloatingTiles, AriaOrb decorative components"
```

---

## Phase B — Section-by-section restyle

For every Phase B task: KEEP the existing `useT()` hook and all `t('…')` translation calls. Only the visual layer (JSX structure + className strings) changes. Existing dictionary entries stay valid.

### Task 5: Restyle `Navigation`

**Files:** `src/sections/Navigation.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useT();

  useEffect(() => {
    // Lock body scroll when mobile menu open
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: t('nav.links.howItWorks') as string, href: '#how-it-works' },
    { label: t('nav.links.features') as string, href: '#features' },
    { label: t('nav.links.industries') as string, href: '#industries' },
    { label: t('nav.links.integrations') as string, href: '#integrations' },
    { label: t('nav.links.getStarted') as string, href: '#get-started' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/82 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-[22px] font-extrabold text-foreground tracking-[-0.04em]"
          >
            Talkys<span className="text-accent">.</span>
          </a>

          <ul className="hidden lg:flex gap-[30px] list-none">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="text-foreground text-[14.5px] font-medium hover:text-accent transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3.5">
            <LanguageSwitcher />
            <button
              onClick={() => scrollToSection('#get-started')}
              className="bg-foreground text-white border-0 px-[18px] py-2.5 rounded-[9px] text-[14px] font-semibold cursor-pointer hover:-translate-y-0.5 transition-transform inline-flex items-center gap-1.5"
            >
              {t('nav.bookDemo') as string}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="relative flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="text-2xl font-heading font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button onClick={() => scrollToSection('#get-started')} className="btn-coral mt-2">
            {t('nav.bookDemo') as string}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
```

The LanguageSwitcher button itself uses styles from Task 5 of the i18n plan (`bg-black/[0.05]`). Since dark mode is gone, the `dark:bg-white/[0.06]` classes inside that component become no-ops; no edit needed.

- [ ] **Step 2: Verify build + visual sanity**

Run: `npx tsc --noEmit -p tsconfig.app.json` — must be clean.
Run: `npm run dev`, open http://localhost:5173, confirm the nav renders with cream blurred bg, "Talkys." dot logo, dark CTA button.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Navigation.tsx
git commit -m "feat(design): restyle Navigation with cream blurred bg and dot logo"
```

---

### Task 6: Restyle `HeroSection`

**Files:** `src/sections/HeroSection.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Console } from '@/components/Console';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';
import { HeroArcs } from '@/components/HeroArcs';
import { HeroFloatingTiles } from '@/components/HeroFloatingTiles';
import { useT } from '@/context/LocaleContext';

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative overflow-hidden min-h-[90vh] flex items-center justify-center bg-background px-6 pt-20 pb-32">
      <HeroArcs />
      <HeroFloatingTiles />

      <div className="relative z-[2] max-w-[900px] mx-auto text-center">
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-8">
          <ChipEyebrow>{t('hero.badge') as string}</ChipEyebrow>
        </div>

        <h1 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 giant-headline mb-7">
          {t('hero.title') as string}{' '}
          <AccentItalic>Talkys</AccentItalic>
        </h1>

        <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 text-[17px] text-muted-foreground max-w-[560px] mx-auto mb-9 leading-[1.5]">
          {t('hero.subtitle') as string}
        </p>

        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 inline-flex gap-3 flex-wrap justify-center relative">
          <button
            onClick={() => document.querySelector('#get-started')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-coral inline-flex items-center gap-2"
          >
            {t('hero.ctaPrimary') as string}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
          <button
            onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-dark inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {t('hero.ctaSecondary') as string}
          </button>

          <div className="scribble">
            <svg viewBox="0 0 60 38" fill="none" aria-hidden="true">
              <path d="M 4 32 C 18 32, 35 22, 50 6" stroke="#e57756" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 44 6 L 52 4 L 52 13" stroke="#e57756" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="script">{t('hero.scribble') as string}</span>
          </div>
        </div>

        {/* Console below CTAs */}
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-[400ms] mt-14">
          <Console />
        </div>
      </div>

      {/* Trust strip */}
      <div className="absolute bottom-9 left-0 right-0 text-center z-[2]">
        <div className="text-[11.5px] tracking-[0.18em] text-muted-foreground inline-flex items-center gap-3.5 before:content-[''] before:w-[60px] before:h-px before:bg-black/12 after:content-[''] after:w-[60px] after:h-px after:bg-black/12">
          {t('hero.trustLabel') as string}{' '}
          <strong className="text-foreground font-bold">{t('hero.trustCount') as string}</strong>{' '}
          {t('hero.trustSuffix') as string}
        </div>
        <div className="mt-4 flex gap-12 justify-center items-center flex-wrap">
          {(t<string[]>('hero.trustLogos')).map((logo) => (
            <span key={logo} className="font-bold text-[19px] tracking-[-0.02em] text-foreground/50">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
```

Notes:
- The `t('hero.trustLabel') / .trustCount / .trustSuffix / .trustLogos / .scribble` keys don't exist yet. Task 18 adds them. Until then, runtime renders the key string. That's a temporary UI defect we accept; Task 18 fixes it.
- Removed the video bg, the two gradient orbs, and the bottom fade-to-bg gradient. Simpler hero, lighter DOM.
- Headline becomes "Meet [Talkys]." with the brand name in italic coral.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — must be clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/HeroSection.tsx
git commit -m "feat(design): rebuild HeroSection with arcs, floating tiles, scribble, trust strip"
```

---

### Task 7: Restyle the `Console` shell (index, tabs, metrics, ActiveCall)

**Files:**
- Modify: `src/components/Console/index.tsx`
- Modify: `src/components/Console/ConsoleTabs.tsx`
- Modify: `src/components/Console/MetricStrip.tsx`
- Modify: `src/components/Console/ActiveCall.tsx`

The component logic stays identical; only the visual chrome (className strings) changes.

- [ ] **Step 1: Update `src/components/Console/index.tsx`**

Replace the JSX returned from `Console()` (keep imports + state):

```tsx
return (
  <div className="w-full max-w-[720px] mx-auto rounded-3xl border border-black/[0.06] bg-white shadow-card overflow-hidden">
    {/* Header bar */}
    <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06] bg-background">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
        </div>
        <span className="ms-2 text-xs font-medium text-muted-foreground">
          {t('console.label') as string}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        <span>{t('console.live') as string}</span>
      </div>
    </div>

    {/* Body */}
    <div className="p-5 space-y-4">
      <ConsoleTabs active={activeId} onChange={setActiveId} />
      <ActiveCall key={active.id} industry={active} />
      <MetricStrip {...active.metrics} />
    </div>
  </div>
);
```

Key changes: `bg-background/80` → `bg-white`; `shadow-[0_20px_60px_-15px_…]` → `shadow-card`; `border-foreground/10` → `border-black/[0.06]`; live dot color → `bg-accent`.

- [ ] **Step 2: Update `src/components/Console/ConsoleTabs.tsx`**

Replace `<Tabs.Trigger>` className string with:

```tsx
className={`
  flex items-center justify-center gap-2 px-3 py-2 rounded-lg
  border border-black/[0.06] bg-background
  text-sm font-medium text-foreground/70
  hover:bg-bg-soft hover:text-foreground
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
  transition-colors duration-200
  data-[state=active]:bg-accent data-[state=active]:text-white
  data-[state=active]:border-accent
`}
```

Was: `data-[state=active]:bg-[#0F4C5C] ... data-[state=active]:border-[#0F4C5C]`. Coral active state matches the demo's hover-coral aesthetic.

- [ ] **Step 3: Update `src/components/Console/MetricStrip.tsx`**

Replace the outer wrapper className:

```tsx
<div className="rounded-2xl border border-black/[0.06] bg-background px-4 py-3">
```

(was: `bg-foreground/[0.03]`). Star icon color stays accent.

- [ ] **Step 4: Update `src/components/Console/ActiveCall.tsx`**

Change the play button className from `bg-[#0F4C5C] hover:bg-[#1A8FA8]` to `bg-accent hover:bg-accent-soft`. Change the progress bar gradient `from-[#0F4C5C] to-[#1A8FA8]` to `from-accent to-accent-soft`. Change the speaker label color in cues from `text-[#1A8FA8]` to `text-accent`. Change the transcript-prompt italic text color from `text-foreground/40` to `text-muted-foreground`. Border colors `border-foreground/10` → `border-black/[0.06]`. Background `bg-foreground/[0.02]` → `bg-background`.

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/Console/
git commit -m "feat(design): restyle Console (header, tabs, metrics, ActiveCall) to cream/coral"
```

---

### Task 8: Restyle `ProblemSection`

**Files:** `src/sections/ProblemSection.tsx`

- [ ] **Step 1: Replace the JSX in ProblemSection**

Keep all hooks, `t()` calls, `problemCopy`, and the local `problems` array merge. Replace the `return (…)` block with:

```tsx
return (
  <section ref={sectionRef} className="relative py-24 lg:py-32">
    <div className="max-w-[1100px] mx-auto px-6">
      <div className="text-center mb-12">
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5">
          <ChipEyebrow>{(t('problem.eyebrow') as string) || 'THE PROBLEM'}</ChipEyebrow>
        </div>
        <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
          {t('problem.titlePrefix') as string}{' '}
          <AccentItalic>{t('problem.titleHighlight') as string}</AccentItalic>{' '}
          {t('problem.titleSuffix') as string}
        </h2>
        <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[540px] mx-auto">
          {t('problem.subtitle') as string}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[18px]">
        {problems.map((problem, index) => (
          <div
            key={index}
            className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700"
            style={{ transitionDelay: `${(index + 2) * 100}ms` }}
          >
            <div className="bg-white border border-black/[0.06] rounded-[22px] p-10 px-7 shadow-card text-center hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 h-full">
              <div className="text-[60px] font-bold tracking-[-0.04em] leading-none text-accent italic mb-3.5">
                <AnimatedCounter end={problem.stat.value} suffix={problem.stat.suffix} visible={isVisible} locale={locale} />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2 tracking-[-0.015em]">{problem.title}</h4>
              <p className="text-muted-foreground text-sm leading-[1.5]">{problem.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
```

Add imports at the top:
```tsx
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';
```

You can remove the `lucide-react` imports `PhoneOff, Users, RefreshCw, TrendingUp` — the icons aren't used in the new layout. The `problems` array's `icon: PhoneOff` etc. entries can also be removed since the JSX no longer references them. Trim down the `problems = […].map(…)` source to:

```tsx
const problems = [
  { stat: { value: 62, suffix: '%' } },
  { stat: { value: 3, suffix: 'x' } },
  { stat: { value: 23, suffix: '%' } },
  { stat: { value: 1500, suffix: '$' } },
].map((p, i) => ({ ...p, ...problemCopy[i] }));
```

The `image` field is also removed.

The new `problem.eyebrow` translation key falls back to "THE PROBLEM" if missing (the `||` after the t() call). Task 18 adds the key.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/ProblemSection.tsx
git commit -m "feat(design): restyle ProblemSection cards with italic coral stat, no images"
```

---

### Task 9: Restyle `SolutionSection` with `AriaOrb`

**Files:** `src/sections/SolutionSection.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';
import { AriaOrb } from '@/components/AriaOrb';

const SolutionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const featuresCopy = t<string[]>('solution.features');

  return (
    <section ref={sectionRef} id="solution" className="bg-bg-soft py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5">
            <ChipEyebrow>{(t('solution.eyebrow') as string) || 'THE SOLUTION'}</ChipEyebrow>
          </div>

          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline mb-5">
            {t('solution.titleLine1') as string}{' '}
            <AccentItalic>{t('solution.titleLine2') as string}</AccentItalic>
          </h2>

          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 text-[17px] text-muted-foreground mb-7 leading-[1.55]">
            {t('solution.paragraph') as string}
          </p>

          <ul className="list-none space-y-5">
            {featuresCopy.map((text, i) => (
              <li
                key={i}
                className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 flex items-start gap-3.5"
                style={{ transitionDelay: `${200 + i * 80}ms` }}
              >
                <div className="w-7 h-7 bg-accent rounded-[9px] flex items-center justify-center text-white flex-shrink-0 shadow-[0_6px_16px_-6px_rgba(229,119,86,0.55)]">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <div>
                  <strong className="block text-[15.5px] text-foreground font-bold mb-0.5">{text}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-[440px] flex items-center justify-center">
          <AriaOrb />
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
```

The previous `agents` cycler and the team-image card are removed. The features list is rendered as Check-bulleted list. The right column is just the `<AriaOrb />`.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/SolutionSection.tsx
git commit -m "feat(design): replace agent cycler with AriaOrb in SolutionSection"
```

---

### Task 10: Restyle `HowItWorksSection` as cycling stepper

**Files:** `src/sections/HowItWorksSection.tsx`

The new design uses a 3-step row with an animated traveling pulse. Our existing content has 5 steps. Compromise: keep all 5 steps in a responsive grid (5 columns on lg, stacked on mobile), and have ONE step at a time be the "active" highlighted card. Loop the active state across all 5 over a 15-second cycle. Drop the traveling-dot connector (it'd be awkward across 5 columns); instead, the active card cycles through.

- [ ] **Step 1: Replace the file contents**

```tsx
import { useEffect, useRef, useState } from 'react';
import { Phone, MessageCircle, ShoppingCart, Send, BarChart3 } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const ICONS = [Phone, MessageCircle, ShoppingCart, Send, BarChart3];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const t = useT();
  const stepsCopy = t<{ title: string; description: string; detail: string }[]>('howItWorks.steps');

  useEffect(() => {
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const visObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          visObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => animObserver.observe(el));
    if (sectionRef.current) visObserver.observe(sectionRef.current);
    return () => {
      animObserver.disconnect();
      visObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5">
            <ChipEyebrow>{(t('howItWorks.eyebrow') as string) || 'HOW IT WORKS'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('howItWorks.titlePrefix') as string}{' '}
            <AccentItalic>{t('howItWorks.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[540px] mx-auto">
            {t('howItWorks.subtitle') as string}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200">
          {stepsCopy.map((step, i) => {
            const Icon = ICONS[i];
            const isActive = activeStep === i;
            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`text-left rounded-[22px] p-7 border transition-all duration-500 ${
                  isActive
                    ? 'bg-[#fef4ed] border-accent/45 shadow-coral -translate-y-2'
                    : 'bg-white border-black/[0.06] shadow-card hover:-translate-y-0.5'
                }`}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10.5px] font-bold tracking-[0.22em] mb-5 border transition-colors ${
                  isActive
                    ? 'bg-accent/15 border-accent/40 text-foreground'
                    : 'bg-background border-black/[0.06] text-foreground'
                }`}>
                  <span className="text-accent text-[12px]">‹</span>
                  {t('howItWorks.stepLabel') as string} {String(i + 1).padStart(2, '0')}
                  <span className="text-accent text-[12px]">›</span>
                </div>

                <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center text-white mb-5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-accent to-accent-soft shadow-[0_10px_24px_-10px_rgba(229,119,86,0.5)]'
                    : 'bg-gradient-to-br from-teal to-teal-light shadow-[0_10px_24px_-10px_rgba(14,79,92,0.5)]'
                }`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>

                <h4 className="text-[20px] font-bold text-foreground mb-2 tracking-[-0.015em] font-heading">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-[1.5]">
                  {step.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {(t<string[]>('howItWorks.integrations')).map((integration) => (
            <div
              key={integration}
              className="px-5 py-2.5 rounded-full bg-white border border-black/[0.06] text-foreground/60 text-sm font-medium shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:text-foreground hover:border-accent/30 transition-all"
            >
              {integration}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
```

The previous side-panel-with-image and progress-bar layout is replaced with a 5-card row that cycles the "active" step every 3 seconds. Integration badges remain at the bottom.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/HowItWorksSection.tsx
git commit -m "feat(design): convert HowItWorksSection to 5-step cycling stepper"
```

---

### Task 11: Restyle `FeaturesSection` with vanilla-tilt cards + waveform highlight

**Files:** `src/sections/FeaturesSection.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { useEffect, useRef } from 'react';
import {
  Mic, BookOpen, Phone, ArrowRightLeft, BarChart3, MessageSquare, Users, Shield, Zap,
} from 'lucide-react';
import VanillaTilt from 'vanilla-tilt';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const ICONS = [Mic, BookOpen, Phone, ArrowRightLeft, BarChart3, MessageSquare, Users, Shield, Zap];
const HIGHLIGHT_INDEXES = new Set([0, 4, 8]); // Natural Voice, Live Analytics, No-Code Setup

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const itemsCopy = t<{ title: string; desc: string }[]>('features.items');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    // Initialize vanilla-tilt on cells
    const tiltTargets = sectionRef.current?.querySelectorAll<HTMLElement>('[data-tilt]');
    if (tiltTargets) {
      VanillaTilt.init(Array.from(tiltTargets), {
        max: 4,
        speed: 500,
        perspective: 1500,
        easing: 'cubic-bezier(.03,.98,.52,.99)',
      });
    }

    return () => {
      observer.disconnect();
      tiltTargets?.forEach((el) => {
        // @ts-expect-error vanilla-tilt attaches vanillaTilt to the element
        if (el.vanillaTilt) el.vanillaTilt.destroy();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5">
            <ChipEyebrow>{(t('features.eyebrow') as string) || 'FEATURES'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('features.titlePrefix') as string}{' '}
            <AccentItalic>{t('features.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[520px] mx-auto">
            {t('features.subtitle') as string}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {itemsCopy.map((item, i) => {
            const Icon = ICONS[i];
            const isHighlight = HIGHLIGHT_INDEXES.has(i);
            const isWaveform = i === 4; // Live Analytics card gets waveform decor
            return (
              <div
                key={i}
                data-tilt
                data-tilt-max={isHighlight ? 3 : 4}
                className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 relative bg-white border border-black/[0.06] rounded-[22px] p-7 shadow-card hover:shadow-card-hover overflow-hidden"
                style={{ transitionDelay: `${(i + 1) * 60}ms`, transformStyle: 'preserve-3d' }}
              >
                <div className="inline-block text-[10.5px] tracking-[0.2em] font-bold text-accent mb-3 uppercase">
                  {/* feature category label — derived from title for now */}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all ${
                  isHighlight
                    ? 'bg-gradient-to-br from-accent to-accent-soft text-white shadow-[0_10px_24px_-10px_rgba(229,119,86,0.5)]'
                    : 'bg-gradient-to-br from-teal to-teal-light text-white shadow-[0_10px_24px_-10px_rgba(14,79,92,0.5)]'
                }`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <h3 className="font-heading font-bold text-[20px] text-foreground mb-1.5 tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-[1.5]">
                  {item.desc}
                </p>

                {isWaveform && (
                  <div className="mt-4 h-16 flex items-end gap-1 justify-between">
                    {Array.from({ length: 18 }, (_, k) => (
                      <div
                        key={k}
                        className="flex-1 rounded-[3px] animate-wave-pulse"
                        style={{
                          background: 'linear-gradient(180deg, #e57756 0%, #f5a585 100%)',
                          animationDelay: `${(k < 9 ? k : 17 - k) * 0.08}s`,
                          boxShadow: '0 0 12px rgba(229,119,86,0.3)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dashboard preview card */}
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-500 mt-12">
          <div className="bg-white border border-black/[0.06] rounded-[22px] p-8 shadow-card relative overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <p className="text-accent text-sm font-medium uppercase tracking-[0.16em]">{t('features.dashboard.eyebrow') as string}</p>
                <p className="text-foreground font-heading font-bold text-2xl mt-2">{t('features.dashboard.title') as string}</p>
                <p className="text-muted-foreground text-sm mt-1">{t('features.dashboard.subtitle') as string}</p>
              </div>
              <div className="flex items-center gap-6">
                {(t<{ value: string; label: string }[]>('features.dashboard.stats')).map((s, k) => (
                  <div key={k} className="text-center">
                    <p className="text-foreground font-heading font-bold text-2xl">{s.value}</p>
                    <p className="text-muted-foreground text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
```

Key changes:
- All cards are uniform white-on-cream with vanilla-tilt
- Highlight cards get coral gradient icon; non-highlight get teal
- Card index 4 ("Live Analytics") gets the bar-waveform animation
- Dashboard preview card moves from image-bg to plain white card with stats inline

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/FeaturesSection.tsx
git commit -m "feat(design): restyle FeaturesSection with white cards + vanilla-tilt + waveform"
```

---

### Task 12: Restyle `SocialMediaSection`

**Files:** `src/sections/SocialMediaSection.tsx`

- [ ] **Step 1: Edit the file**

Replace the `return (…)` JSX, keep all hooks + chat timers + `useT()`. Add imports for `ChipEyebrow` and `AccentItalic` at the top.

```tsx
return (
  <section ref={sectionRef} id="integrations" className="bg-bg-soft py-24 lg:py-28">
    <div className="max-w-[1100px] mx-auto px-6">
      <div className="text-center mb-12">
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5">
          <ChipEyebrow>{(t('social.eyebrow') as string) || 'INTEGRATIONS'}</ChipEyebrow>
        </div>
        <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
          {t('social.titlePrefix') as string}{' '}
          <AccentItalic>{t('social.titleHighlight') as string}</AccentItalic>
        </h2>
        <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[540px] mx-auto">
          {t('social.subtitle') as string}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Chat preview - left on lg, second on mobile */}
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 order-2 lg:order-1">
          <div className="bg-white rounded-[22px] border border-black/[0.06] max-w-md mx-auto overflow-hidden shadow-card">
            {/* Phone frame */}
            <div className="bg-background p-3 flex items-center gap-2 border-b border-black/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">{t('social.phoneFrame') as string}</span>
              </div>
            </div>

            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b border-black/[0.06]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center text-white font-bold">IG</div>
              <div>
                <p className="font-medium text-foreground text-sm">{t('social.handle') as string}</p>
                <p className="text-xs text-muted-foreground">{t('social.handleSub') as string}</p>
              </div>
              <div className="ms-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-700">{t('social.activeBadge') as string}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-3 min-h-[280px]">
              {chatStep >= 1 && (
                <div className="flex justify-end">
                  <div className="bg-accent/15 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm text-foreground/85">{t('social.messages.customer1') as string}</p>
                  </div>
                </div>
              )}
              {chatStep >= 2 && (
                <div className="flex justify-start">
                  <div className="bg-background rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] border border-black/[0.06]">
                    <p className="text-sm text-foreground/75">{t('social.messages.agent1') as string}</p>
                  </div>
                </div>
              )}
              {chatStep >= 3 && (
                <div className="flex justify-end">
                  <div className="bg-accent/15 rounded-2xl rounded-tr-sm px-4 py-2">
                    <p className="text-sm text-foreground/85">{t('social.messages.customer2') as string}</p>
                  </div>
                </div>
              )}
              {chatStep >= 4 && (
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/30">
                  <p className="text-xs text-accent font-medium">{t('social.messages.incomingFrom') as string}</p>
                  <p className="text-xs text-muted-foreground">{t('social.messages.incomingSub') as string}</p>
                </div>
              )}
              {chatStep >= 5 && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                  <p className="text-xs text-green-700">{t('social.messages.confirmed') as string}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Integrations grid */}
        <div className="order-1 lg:order-2">
          <h3 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 font-heading font-bold text-2xl text-foreground mb-3">
            {t('social.integrationsHeader') as string}
          </h3>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 text-muted-foreground mb-8">
            {t('social.integrationsSubtitle') as string}
          </p>

          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Salesforce', logo: 'SF' }, { name: 'WhatsApp', logo: 'WA' },
              { name: 'Instagram', logo: 'IG' }, { name: 'Omega POS', logo: 'OM' },
              { name: 'Squirrel', logo: 'SQ' }, { name: 'Messenger', logo: 'MS' },
              { name: 'Zoho CRM', logo: 'ZH' }, { name: 'Shopify', logo: 'SH' },
            ].map((item) => (
              <div key={item.name} className="bg-white border border-black/[0.06] rounded-[18px] p-4 text-center shadow-card hover:-translate-y-0.5 hover:border-accent/30 transition-all">
                <div className="w-10 h-10 mx-auto rounded-xl bg-background border border-black/[0.06] flex items-center justify-center mb-2">
                  <span className="font-heading font-bold text-foreground/60 text-xs">{item.logo}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </div>

          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 mt-6 p-4 rounded-xl bg-white border border-black/[0.06] shadow-card">
            <p className="text-muted-foreground text-sm">
              {t('social.openApiBefore') as string}{' '}
              <span className="text-accent font-semibold">{t('social.openApiHighlight') as string}</span>{' '}
              {t('social.openApiAfter') as string}{' '}
              <button
                onClick={() => document.querySelector('#get-started')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-accent hover:text-foreground transition-colors underline underline-offset-2"
              >
                {t('social.talkToUs') as string}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
```

Also drop the inline `style={{ animation: 'slideInFromRight 0.4s ease-out' }}` props on each message div — those animations were on classnames that no longer exist in `index.css`. Plain conditional render works fine.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/SocialMediaSection.tsx
git commit -m "feat(design): restyle SocialMediaSection chat preview and integrations grid"
```

---

### Task 13: Restyle `IndustriesSection`

**Files:** `src/sections/IndustriesSection.tsx`

Keep all 8 industry tabs and the active-panel detail. Restyle each tab as a flat pill button and the panel as a white card with hover-coral icon.

- [ ] **Step 1: Replace the `return (…)` JSX**

Keep all hooks, `t()` calls, `industryCopy`, `industries` array, and `active = industries[activeTab]` derivation. Add the imports for `ChipEyebrow` and `AccentItalic`. Replace the return with:

```tsx
return (
  <section ref={sectionRef} id="industries" className="py-24 lg:py-28">
    <div className="max-w-[1100px] mx-auto px-6">
      <div className="text-center mb-14">
        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5">
          <ChipEyebrow>{(t('industries.eyebrow') as string) || 'INDUSTRIES'}</ChipEyebrow>
        </div>
        <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
          {t('industries.titlePrefix') as string}{' '}
          <AccentItalic>{t('industries.titleHighlight') as string}</AccentItalic>
        </h2>
        <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[540px] mx-auto">
          {t('industries.subtitle') as string}
        </p>
      </div>

      {/* Tab pills */}
      <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 mb-10 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full justify-start lg:justify-center gap-2 px-1">
          {industries.map((industry, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
                activeTab === index
                  ? 'bg-accent text-white border-accent shadow-coral'
                  : 'bg-white text-foreground/60 border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:text-foreground hover:border-accent/30'
              }`}
            >
              {industry.shortTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Active industry card */}
      <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 bg-white border border-black/[0.06] rounded-[22px] overflow-hidden shadow-card">
        <div className="grid lg:grid-cols-[1fr_1.2fr]">
          <div className="p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-teal to-teal-light flex items-center justify-center text-white shadow-[0_10px_24px_-10px_rgba(14,79,92,0.4)]">
                <active.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <span className="text-accent text-xs font-bold tracking-[0.15em] uppercase">{active.role}</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-foreground mb-3 tracking-[-0.015em]">
              {active.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{active.description}</p>

            <ul className="space-y-3 mb-6">
              {active.flow.map((step, idx) => (
                <li key={step} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">{idx + 1}</span>
                  </div>
                  <span className="text-sm text-foreground/70">{step}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {active.capabilities.map((cap) => (
                <span key={cap} className="px-3 py-1 rounded-full bg-background border border-black/[0.06] text-foreground/60 text-[11px] font-medium">
                  {cap}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-background border-l border-black/[0.06] p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <p className="text-xs text-accent font-medium">{t('industries.speakingLabel') as string}</p>
            </div>
            <p className="text-foreground/70 text-base leading-relaxed italic">
              {active.quote}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
```

The image element and the role/capabilities badge in the corner are dropped. The 8 industries' content fields (title/desc/role/flow/quote/capabilities) all render.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/IndustriesSection.tsx
git commit -m "feat(design): restyle IndustriesSection with pill tabs and white detail card"
```

---

### Task 14: Restyle `GettingStartedSection` as a glowing white form card

**Files:** `src/sections/GettingStartedSection.tsx`

- [ ] **Step 1: Replace the `return (…)` JSX**

Keep all hooks, `t()` calls, `formData`, `handleSubmit`, `expectations`, `trustStats`, `industryOptions`. Add imports for `ChipEyebrow` and `AccentItalic`. Replace the return:

```tsx
return (
  <section ref={sectionRef} id="get-started" className="py-24 lg:py-28">
    <div className="max-w-[900px] mx-auto px-6">
      <div className="text-center mb-6">
        <ChipEyebrow>{(t('getStarted.eyebrow') as string) || 'GET STARTED'}</ChipEyebrow>
      </div>

      <div className="relative bg-white border border-black/[0.06] rounded-[28px] p-12 lg:p-16 overflow-hidden shadow-card">
        {/* Radial glows */}
        <div className="absolute -top-[30%] -right-[10%] w-[55%] h-[130%] pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(229,119,86,0.10) 0%, transparent 60%)' }} />
        <div className="absolute -bottom-[40%] -left-[10%] w-[55%] h-[130%] pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(14,79,92,0.07) 0%, transparent 60%)' }} />

        <div className="relative z-[1]">
          <h2 className="text-center font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(32px, 4.5vw, 48px)' }}>
            {t('getStarted.titlePrefix') as string}{' '}
            <AccentItalic>{t('getStarted.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="text-center text-muted-foreground text-[17px] mb-9 max-w-[520px] mx-auto">
            {t('getStarted.paragraph') as string}
          </p>

          <form onSubmit={handleSubmit} className="max-w-[520px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.fullName') as string}</label>
                <input
                  type="text" required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t('getStarted.form.fullNamePlaceholder') as string}
                  className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.email') as string}</label>
                <input
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('getStarted.form.emailPlaceholder') as string}
                  className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.phone') as string}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('getStarted.form.phonePlaceholder') as string}
                  className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.company') as string}</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder={t('getStarted.form.companyPlaceholder') as string}
                  className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.industry') as string}</label>
                <select
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none appearance-none cursor-pointer focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all"
                >
                  <option value="">{t('getStarted.form.industrySelect') as string}</option>
                  {Object.entries(industryOptions).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-muted-foreground">{t('getStarted.form.useCase') as string}</label>
                <textarea
                  rows={3}
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  placeholder={t('getStarted.form.useCasePlaceholder') as string}
                  className="bg-background border border-black/[0.06] text-foreground px-3.5 py-3 rounded-[11px] text-[14.5px] outline-none focus:border-accent focus:bg-white focus:shadow-[0_0_0_3px_rgba(229,119,86,0.15)] transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mb-5">
              <input
                type="checkbox" id="consent"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-black/20 text-accent focus:ring-accent/40"
              />
              <label htmlFor="consent" className="text-xs text-muted-foreground">{t('getStarted.form.consent') as string}</label>
            </div>

            <button type="submit" className="w-full btn-coral inline-flex items-center justify-center gap-2 text-base">
              {t('getStarted.form.submit') as string}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <p className="text-center text-muted-foreground text-[13px] mt-5">
              {(t('getStarted.formMeta') as string) || 'No credit card · 14-day trial · Reply within 24h'}
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
);
```

The "What to Expect" expectations block, the trust-stats hero strip image, and the second-column form layout are dropped. The form is now a single centered card with radial glows.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/GettingStartedSection.tsx
git commit -m "feat(design): restyle GettingStartedSection as glowing white form card"
```

---

### Task 15: Restyle `FooterSection` to dark navy

**Files:** `src/sections/FooterSection.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { useEffect, useRef } from 'react';
import { Twitter, Linkedin, Youtube, Github } from 'lucide-react';
import { useT } from '@/context/LocaleContext';

const FooterSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const categories = t<{ Product: string; Company: string; Legal: string }>('footer.categories');
  const links = t<{ Product: string[]; Company: string[]; Legal: string[] }>('footer.links');
  const footerEntries: [keyof typeof categories, string[]][] = [
    ['Product', links.Product],
    ['Company', links.Company],
    ['Legal', links.Legal],
  ];

  return (
    <footer ref={sectionRef} className="bg-navy text-white/70 pt-20 pb-9 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-white/[0.08]">
          <div>
            <div className="text-[26px] font-extrabold text-white tracking-[-0.04em] mb-3.5">
              Talkys<span className="text-accent">.</span>
            </div>
            <p className="text-white/55 text-sm leading-[1.55] mb-6 max-w-[320px]">
              {t('footer.description') as string}
            </p>
            <div className="flex gap-2 max-w-[320px]">
              <input
                type="email"
                placeholder={(t('footer.newsletterPlaceholder') as string) || 'Your email'}
                className="bg-white/5 border border-white/[0.12] text-white px-3.5 py-2.5 rounded-[9px] text-sm flex-1 min-w-0 outline-none focus:border-accent placeholder-white/35"
              />
              <button className="bg-accent text-white border-0 px-4 py-2.5 rounded-[9px] text-sm font-semibold cursor-pointer hover:opacity-90">
                {(t('footer.newsletterCta') as string) || 'Subscribe'}
              </button>
            </div>
          </div>

          {footerEntries.map(([key, items]) => (
            <div key={key}>
              <h5 className="text-white text-xs font-bold tracking-[0.16em] uppercase mb-4">{categories[key]}</h5>
              <ul className="list-none space-y-2.5">
                {items.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/55 text-sm hover:text-accent transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-[13px]">{t('footer.copyright') as string}</p>
          <div className="flex gap-2">
            {[Twitter, Linkedin, Youtube, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 bg-white/[0.04] border border-white/[0.1] rounded-[10px] flex items-center justify-center text-white/65 hover:bg-accent hover:text-white hover:border-accent transition-all"
                aria-label="Social"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
```

The regions line is dropped (already redundant with copyright). Social icons swap from text initials to real Lucide icons (Twitter, Linkedin, Youtube, Github).

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/FooterSection.tsx
git commit -m "feat(design): restyle FooterSection as dark navy with newsletter + social"
```

---

## Phase C — New sections + i18n

### Task 16: Build `TestimonialsSection`

**Files:** `src/sections/TestimonialsSection.tsx` (replace placeholder from Task 1)

- [ ] **Step 1: Replace the file with the real implementation**

```tsx
import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const items = t<{ quote: string; name: string; role: string; initials: string }[]>('testimonials.items');

  return (
    <section ref={sectionRef} id="testimonials" className="bg-bg-soft py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5">
            <ChipEyebrow>{t('testimonials.eyebrow') as string}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('testimonials.titlePrefix') as string}{' '}
            <AccentItalic>{t('testimonials.titleHighlight') as string}</AccentItalic>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-[18px]">
          {items.map((item, i) => (
            <div
              key={i}
              className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 bg-white border border-black/[0.06] rounded-[22px] p-8 shadow-card flex flex-col"
              style={{ transitionDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="flex gap-1 text-accent mb-4">
                {Array.from({ length: 5 }, (_, k) => <Star key={k} className="w-4 h-4 fill-accent" />)}
              </div>
              <blockquote className="text-[15.5px] text-foreground leading-[1.55] mb-6 tracking-[-0.005em] flex-1">
                "{item.quote}"
              </blockquote>
              <div className="flex items-center gap-3 pt-5 border-t border-black/[0.06]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-accent flex items-center justify-center text-white font-bold text-sm">
                  {item.initials}
                </div>
                <div>
                  <strong className="block text-sm font-bold text-foreground">{item.name}</strong>
                  <small className="block text-muted-foreground text-[12.5px] mt-0.5">{item.role}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean. (The `testimonials.*` keys resolve to the keystring at runtime until Task 18 adds them — that's fine.)

- [ ] **Step 3: Commit**

```bash
git add src/sections/TestimonialsSection.tsx
git commit -m "feat(design): add TestimonialsSection with 3 customer cards"
```

---

### Task 17: Build `LogoMarqueeSection`

**Files:** `src/sections/LogoMarqueeSection.tsx` (replace placeholder)

- [ ] **Step 1: Replace the file**

```tsx
const LOGOS = [
  'Bright Smile', 'NextClinic', 'OakLaw', 'Nexter',
  'UrbanCare', 'FixIt Now', 'SkyHotels', 'RootDental',
];

const LogoMarqueeSection = () => {
  // duplicate logos for seamless loop
  const doubled = [...LOGOS, ...LOGOS];
  return (
    <section className="bg-bg-soft pb-24 lg:pb-28 -mt-12 lg:-mt-16">
      <div className="max-w-[1100px] mx-auto">
        <div
          className="overflow-hidden relative"
          style={{
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
            maskImage:        'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
          }}
        >
          <div className="flex gap-[70px] animate-scroll-logos items-center" style={{ width: 'max-content' }}>
            {doubled.map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="font-bold text-[22px] tracking-[-0.025em] text-muted-foreground/60 whitespace-nowrap"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoMarqueeSection;
```

Note: the section uses `-mt-12 lg:-mt-16` to nestle directly under TestimonialsSection (same `bg-bg-soft`), creating a continuous block.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json` — clean.

- [ ] **Step 3: Commit**

```bash
git add src/sections/LogoMarqueeSection.tsx
git commit -m "feat(design): add LogoMarqueeSection with infinite-scroll customer logos"
```

---

### Task 18: Add new translation keys to en.ts and ar.ts

**Files:**
- Modify: `src/i18n/translations/en.ts`
- Modify: `src/i18n/translations/ar.ts`

Add the following NEW keys. Existing keys must stay unchanged.

- [ ] **Step 1: Update `EN_TRANSLATIONS` in `src/i18n/translations/en.ts`**

Add these properties inside the appropriate top-level keys (the file uses `as const`, so the literal object must have the new properties present):

```ts
// inside nav:
// (no changes needed)

// inside hero (after `ctaSecondary`):
scribble: 'Try it free, no card',
trustLabel: 'TRUSTED BY',
trustCount: '1,200+',
trustSuffix: 'BUSINESSES',
trustLogos: ['Bright Smile', 'NextClinic', 'OakLaw', 'Nexter'],

// inside problem (after `subtitle`):
eyebrow: 'THE PROBLEM',

// inside solution (after `isSaying`):
eyebrow: 'THE SOLUTION',
ariaName: 'Aria',
ariaTagline: 'AI Agent · On call',

// inside howItWorks (after `subtitle`):
eyebrow: 'HOW IT WORKS',

// inside features (after `subtitle`):
eyebrow: 'FEATURES',

// inside social (after `subtitle`):
eyebrow: 'INTEGRATIONS',

// inside industries (after `subtitle`):
eyebrow: 'INDUSTRIES',

// inside getStarted (after `paragraph`):
eyebrow: 'GET STARTED',
formMeta: 'No credit card · 14-day trial · We\'ll be in touch within 24h',

// inside footer (after `description`):
newsletterPlaceholder: 'Your email',
newsletterCta: 'Subscribe',

// new top-level key `testimonials`:
testimonials: {
  eyebrow: 'CUSTOMERS',
  titlePrefix: '1,200+ businesses pick Talkys',
  titleHighlight: 'every day',
  items: [
    {
      quote: 'Talkys booked 11 appointments overnight. Felt like hiring a receptionist that never sleeps.',
      name: 'Sarah Chen',
      role: 'Operations · Bright Smile Dental',
      initials: 'SC',
    },
    {
      quote: 'We capture 3× more after-hours leads. The ROI was clear in the first week.',
      name: 'Marcus Rivera',
      role: 'Founder · OakLaw Firm',
      initials: 'MR',
    },
    {
      quote: 'Setup took 8 minutes. By morning, we\'d booked our first showing — without anyone lifting a finger.',
      name: 'Jenna Diaz',
      role: 'Agent · NextClinic Realty',
      initials: 'JD',
    },
  ],
},
```

After updating, the structure of the EN dictionary's new keys must match exactly what AR_TRANSLATIONS provides next.

- [ ] **Step 2: Update `AR_TRANSLATIONS` in `src/i18n/translations/ar.ts`**

Mirror the same shape with Arabic translations:

```ts
// inside nav:
// (no changes)

// inside hero:
scribble: 'جرّبه مجاناً، بدون بطاقة',
trustLabel: 'يثق به',
trustCount: '١٢٠٠+',
trustSuffix: 'شركة',
trustLogos: ['Bright Smile', 'NextClinic', 'OakLaw', 'Nexter'],

// inside problem:
eyebrow: 'المشكلة',

// inside solution:
eyebrow: 'الحل',
ariaName: 'آريا',
ariaTagline: 'وكيل ذكاء اصطناعي · على الخط',

// inside howItWorks:
eyebrow: 'كيف يعمل',

// inside features:
eyebrow: 'الميزات',

// inside social:
eyebrow: 'التكاملات',

// inside industries:
eyebrow: 'القطاعات',

// inside getStarted:
eyebrow: 'ابدأ الآن',
formMeta: 'بدون بطاقة ائتمان · تجربة ١٤ يوماً · سنرد خلال ٢٤ ساعة',

// inside footer:
newsletterPlaceholder: 'بريدك الإلكتروني',
newsletterCta: 'اشترك',

// new top-level key `testimonials`:
testimonials: {
  eyebrow: 'العملاء',
  titlePrefix: 'أكثر من ١٢٠٠ شركة تختار Talkys',
  titleHighlight: 'كل يوم',
  items: [
    {
      quote: 'حجز Talkys ١١ موعداً خلال الليل. شعرنا وكأننا وظّفنا موظفة استقبال لا تنام أبداً.',
      name: 'سارة شين',
      role: 'العمليات · Bright Smile Dental',
      initials: 'SC',
    },
    {
      quote: 'نلتقط ٣ أضعاف العملاء المحتملين بعد ساعات العمل. عائد الاستثمار واضح من الأسبوع الأول.',
      name: 'ماركوس ريفيرا',
      role: 'المؤسس · OakLaw Firm',
      initials: 'MR',
    },
    {
      quote: 'استغرق الإعداد ٨ دقائق. وصباحاً، كنا قد حجزنا أول معاينة — بدون أي تدخل بشري.',
      name: 'جينا دياز',
      role: 'وكيلة · NextClinic Realty',
      initials: 'JD',
    },
  ],
},
```

- [ ] **Step 3: Verify type parity**

Run: `npx tsc --noEmit -p tsconfig.app.json`

Expected: clean. The `Widen<typeof EN_TRANSLATIONS>` type derived in en.ts is now the structural contract that ar.ts satisfies. If ar.ts is missing any of the new keys, TS will report a missing-property error. Fix accordingly.

- [ ] **Step 4: Run unit tests**

Run: `npm test`

Expected: all 63 tests still pass (no test changes; we added data only).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/translations/en.ts src/i18n/translations/ar.ts
git commit -m "feat(i18n): add new keys for hero trust strip, eyebrows, and testimonials"
```

---

## Phase D — Polish

### Task 19: Sweep remaining `dark:` Tailwind variants

**Files:** any section file that still has `dark:` class strings.

Since dark mode is gone, `dark:bg-*` and friends are dead code. They don't break the build, but they bloat the generated CSS.

- [ ] **Step 1: Find remaining occurrences**

Run from the working dir:

```bash
rg -c "dark:" src/
```

Expected output: a list of files with counts. Phase B should have rewritten most of these, but `LanguageSwitcher.tsx` still has `dark:bg-white/[0.06]` etc.

- [ ] **Step 2: Edit each remaining file**

For every file with `dark:` hits, open it and delete each `dark:<…>` token from the surrounding className strings. Keep the non-dark counterpart. For `LanguageSwitcher.tsx`, the existing className is:

```
w-10 h-10 rounded-full
bg-black/[0.05] dark:bg-white/[0.06]
border border-black/[0.06] dark:border-white/[0.06]
flex items-center justify-center
hover:bg-black/[0.08] dark:hover:bg-white/[0.1]
transition-colors
text-xs font-semibold text-foreground/70
```

Becomes:

```
w-10 h-10 rounded-full
bg-black/[0.05]
border border-black/[0.06]
flex items-center justify-center
hover:bg-black/[0.08]
transition-colors
text-xs font-semibold text-foreground/70
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit -p tsconfig.app.json && npm run lint`

Expected: clean (lint errors that are pre-existing are fine; no NEW errors).

- [ ] **Step 4: Commit**

```bash
git add -u src/
git commit -m "chore(design): remove dead dark:* Tailwind variants now that dark mode is gone"
```

---

### Task 20: Final QA — build, test, browser sanity

**Files:** none modified.

- [ ] **Step 1: Run tests**

Run: `npm test`
Expected: 63/63 passing.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: pre-existing errors only (App.tsx fast-refresh, LocaleContext fast-refresh). No new errors.

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: `tsc -b` compiles, Vite emits the bundle. Compare bundle sizes to pre-redesign — the new bundle should be SMALLER (no three.js imports from BackgroundCanvas/FloatingObjects).

- [ ] **Step 4: Manual browser pass**

Run: `npm run dev`. Open http://localhost:5173 and walk every section in both EN and AR:

1. Nav: dot logo, dark CTA, language switcher works.
2. Hero: 4 floating tiles, concentric arcs, italic-coral "Talkys" in headline, dual button + scribble + trust strip, Console below.
3. Console: white card, coral active tab, play button coral.
4. Problem: 4 cards with italic-coral stat, no images.
5. Solution: Aria orb with breathing core + 3 ripples + live-blink label, check-bullet list.
6. HowItWorks: 5 step cards cycling active state every 3s.
7. Features: white tilt cards, waveform on the Live Analytics card.
8. Social: white phone preview card with chat messages, integrations grid.
9. Industries: pill tabs, white detail card.
10. Testimonials (NEW): 3 cards with stars + quote + avatar.
11. Marquee (NEW): logos scrolling left infinitely.
12. GetStarted: white form card with coral + teal radial glows.
13. Footer: dark navy, newsletter input + Lucide social icons.

Toggle to AR and verify RTL flips arrows, layout reverses where expected, fonts render Noto Sans Arabic.

- [ ] **Step 5: Report**

Comment in the PR or post-mortem: any final findings, regressions, follow-up suggestions (e.g., remove three.js deps; refresh translation copy; replace Unsplash images currently still referenced in industry data).

No commit if everything passes.

---

## Self-Review notes

**Spec coverage:**
- Cream/coral palette ✓ Task 2
- Drop dark mode ✓ Task 1, 2, 19
- Remove 3D background + floating objects ✓ Task 1
- Restyle all 10 sections ✓ Tasks 5–15
- Add Testimonials ✓ Task 16
- Add Logo Marquee ✓ Task 17
- Aria orb in Solution ✓ Tasks 4 + 9
- Floating tiles + arcs in Hero ✓ Tasks 4 + 6
- i18n new keys ✓ Task 18
- Keep all existing content ✓ section restyles preserve all t() calls
- Caveat font ✓ Task 2

**Placeholder scan:** No "TBD", "implement later", or shape-less code blocks. Every step has complete code.

**Type consistency:**
- `ChipEyebrow` accepts a single child — used identically in every section.
- `AccentItalic` is a single-child wrapper.
- `useT()` returns the same shape everywhere.
- Translation keys follow the same dot-path convention as the i18n plan that landed earlier.
- The `Widen<typeof EN_TRANSLATIONS>` type from the earlier plan still gates ar.ts.

**Known compromises:**
- The site will look broken mid-implementation (between Task 2 and Task 15) because the design tokens are swapped before the section markup is updated. This is acceptable — each task individually builds clean (`tsc --noEmit`), and the final render is verified in Task 20.
- The 9 features stay as a 3x3 grid rather than a true bento; the waveform decoration goes on the "Live Analytics" card only. If the user wants a strict bento (1 tall + 3 small + 1 wide), revisit Task 11 after the rest lands.
- Three.js packages remain in `package.json` even though their source is deleted. Removing them is a follow-up commit (low-risk but out of scope here).
