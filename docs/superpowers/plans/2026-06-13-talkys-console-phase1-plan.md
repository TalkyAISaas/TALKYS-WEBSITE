# Talkys Console — Phase 1 of Wow Hero Redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static stats/waveform area of the hero with a Talkys Console — a real-looking product UI that switches between 4 industries (Restaurant, Dealership, Hotel, Retail) and plays an English demo call with a typewriter-synced transcript per industry. Phase 1 ships WITHOUT the audio-reactive 3D layer (Phase 2) and WITHOUT bilingual/geo-detect (Phase 3).

**Architecture:** A new `<Console>` component composed of `<ConsoleTabs>`, `<ActiveCall>`, and `<MetricStrip>`. Industry data lives in `src/data/industries.ts`. Caption parsing and typewriter-progress logic live as pure utilities in `src/utils/` so they're unit-testable under the project's existing vitest setup. React components are verified manually via the dev server because the project does not use a DOM-rendering test library.

**Tech Stack:** React 19 + TypeScript, Vite, Tailwind, Radix UI Tabs (`@radix-ui/react-tabs` — already installed), vitest. No new dependencies.

**Spec reference:** `docs/superpowers/specs/2026-06-13-wow-hero-redesign-design.md`

---

## File Structure

| Path | Type | Responsibility |
|---|---|---|
| `src/data/industries.ts` | new | The 4 industry configs + `getIndustryById()` lookup |
| `src/data/industries.test.ts` | new | Verify lookup function and config shape |
| `src/utils/captions.ts` | new | `parseVtt()` — pure VTT parser |
| `src/utils/captions.test.ts` | new | Parser unit tests |
| `src/utils/typewriter.ts` | new | `getVisibleCues()` — pure progress calc |
| `src/utils/typewriter.test.ts` | new | Typewriter logic unit tests |
| `src/components/Console/MetricStrip.tsx` | new | Presentational metrics row |
| `src/components/Console/ConsoleTabs.tsx` | new | Radix tablist for the 4 industries |
| `src/components/Console/ActiveCall.tsx` | new | Audio player + caller info + typewriter transcript |
| `src/components/Console/index.tsx` | new | Wrapper; owns active-industry state |
| `src/sections/HeroSection.tsx` | modify | Replace waveform+stats blocks with `<Console>` |
| `public/audio/{restaurant,dealership,hotel,retail}-en.mp3` | new | Placeholder MP3s for dev |
| `public/captions/{restaurant,dealership,hotel,retail}-en.vtt` | new | Caption tracks for typewriter |

---

## Task 1: Industry data + lookup utility

**Files:**
- Create: `src/data/industries.ts`
- Test: `src/data/industries.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/data/industries.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { INDUSTRIES, getIndustryById } from './industries';

describe('INDUSTRIES', () => {
  it('contains exactly 4 entries', () => {
    expect(INDUSTRIES).toHaveLength(4);
  });

  it('has unique ids', () => {
    const ids = INDUSTRIES.map(i => i.id);
    expect(new Set(ids).size).toBe(4);
  });

  it('every entry has English audio + captions paths', () => {
    INDUSTRIES.forEach(i => {
      expect(i.demoCall.audio.en).toMatch(/^\/audio\/.+\.mp3$/);
      expect(i.demoCall.captions.en).toMatch(/^\/captions\/.+\.vtt$/);
    });
  });
});

describe('getIndustryById', () => {
  it('returns the matching config', () => {
    const r = getIndustryById('restaurant');
    expect(r?.id).toBe('restaurant');
  });

  it('returns undefined for unknown id', () => {
    expect(getIndustryById('unknown')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npm test src/data/industries.test.ts`
Expected: FAIL — `industries.ts` does not exist.

- [ ] **Step 3: Create `src/data/industries.ts`**

```typescript
export type IndustryId = 'restaurant' | 'dealership' | 'hotel' | 'retail';

export interface IndustryConfig {
  id: IndustryId;
  label: { en: string; ar: string };
  icon: string;
  palette: { primary: string; ambient: string; accent: string };
  demoCall: {
    audio: { en: string; ar: string };
    captions: { en: string; ar: string };
    duration: number;
    caller: string;
  };
  metrics: { handled: number; missed: number; rating: number };
}

export const INDUSTRIES: IndustryConfig[] = [
  {
    id: 'restaurant',
    label: { en: 'Restaurant', ar: 'مطعم' },
    icon: '🍔',
    palette: { primary: '#E07A5F', ambient: '#FAE0D9', accent: '#C25B40' },
    demoCall: {
      audio: { en: '/audio/restaurant-en.mp3', ar: '/audio/restaurant-ar.mp3' },
      captions: { en: '/captions/restaurant-en.vtt', ar: '/captions/restaurant-ar.vtt' },
      duration: 28,
      caller: '+961 ●● ●● ●●',
    },
    metrics: { handled: 47, missed: 0, rating: 4.8 },
  },
  {
    id: 'dealership',
    label: { en: 'Dealership', ar: 'معرض سيارات' },
    icon: '🚗',
    palette: { primary: '#4A6FA5', ambient: '#DDE5F0', accent: '#2E4D7C' },
    demoCall: {
      audio: { en: '/audio/dealership-en.mp3', ar: '/audio/dealership-ar.mp3' },
      captions: { en: '/captions/dealership-en.vtt', ar: '/captions/dealership-ar.vtt' },
      duration: 32,
      caller: '+961 ●● ●● ●●',
    },
    metrics: { handled: 18, missed: 0, rating: 4.9 },
  },
  {
    id: 'hotel',
    label: { en: 'Hotel', ar: 'فندق' },
    icon: '🏨',
    palette: { primary: '#0F4C5C', ambient: '#D6E5EA', accent: '#1A8FA8' },
    demoCall: {
      audio: { en: '/audio/hotel-en.mp3', ar: '/audio/hotel-ar.mp3' },
      captions: { en: '/captions/hotel-en.vtt', ar: '/captions/hotel-ar.vtt' },
      duration: 26,
      caller: '+961 ●● ●● ●●',
    },
    metrics: { handled: 31, missed: 0, rating: 4.7 },
  },
  {
    id: 'retail',
    label: { en: 'Retail', ar: 'متجر' },
    icon: '🛒',
    palette: { primary: '#1A8FA8', ambient: '#D9EEF3', accent: '#0F6478' },
    demoCall: {
      audio: { en: '/audio/retail-en.mp3', ar: '/audio/retail-ar.mp3' },
      captions: { en: '/captions/retail-en.vtt', ar: '/captions/retail-ar.vtt' },
      duration: 24,
      caller: '+961 ●● ●● ●●',
    },
    metrics: { handled: 52, missed: 1, rating: 4.6 },
  },
];

export function getIndustryById(id: string): IndustryConfig | undefined {
  return INDUSTRIES.find(i => i.id === id);
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `npm test src/data/industries.test.ts`
Expected: PASS — 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/data/industries.ts src/data/industries.test.ts
git commit -m "feat(console): add industry config data + lookup"
```

---

## Task 2: VTT caption parser

**Files:**
- Create: `src/utils/captions.ts`
- Test: `src/utils/captions.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/utils/captions.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { parseVtt } from './captions';

const SAMPLE = `WEBVTT

00:00.000 --> 00:03.000
Customer: I'd like to order a pizza

00:03.500 --> 00:06.000
Agent: Sure, what kind would you like?

00:06.500 --> 00:08.000
Customer: Pepperoni please
`;

describe('parseVtt', () => {
  it('parses 3 cues from sample', () => {
    const cues = parseVtt(SAMPLE);
    expect(cues).toHaveLength(3);
  });

  it('extracts start and end times in seconds', () => {
    const cues = parseVtt(SAMPLE);
    expect(cues[0].startTime).toBe(0);
    expect(cues[0].endTime).toBe(3);
    expect(cues[1].startTime).toBe(3.5);
  });

  it('extracts speaker prefix when present', () => {
    const cues = parseVtt(SAMPLE);
    expect(cues[0].speaker).toBe('Customer');
    expect(cues[0].text).toBe("I'd like to order a pizza");
    expect(cues[1].speaker).toBe('Agent');
  });

  it('returns empty array for empty input', () => {
    expect(parseVtt('')).toEqual([]);
  });

  it('handles input without WEBVTT header', () => {
    const out = parseVtt('00:00.000 --> 00:01.000\nhello');
    expect(out).toHaveLength(1);
    expect(out[0].text).toBe('hello');
  });

  it('ignores cues with malformed timing', () => {
    const out = parseVtt('WEBVTT\n\nbogus --> line\nhello\n');
    expect(out).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npm test src/utils/captions.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/utils/captions.ts`**

```typescript
export interface CaptionCue {
  startTime: number;
  endTime: number;
  speaker?: string;
  text: string;
}

function parseTimestamp(t: string): number | null {
  const m = t.match(/^(\d+):(\d+)\.(\d+)$/);
  if (!m) return null;
  const [, mm, ss, ms] = m;
  return +mm * 60 + +ss + +ms / 1000;
}

export function parseVtt(input: string): CaptionCue[] {
  if (!input.trim()) return [];
  const lines = input.split(/\r?\n/);
  const cues: CaptionCue[] = [];
  let i = 0;
  if (lines[i]?.trim().startsWith('WEBVTT')) i++;

  while (i < lines.length) {
    const raw = lines[i]?.trim() ?? '';
    if (!raw) { i++; continue; }

    let timingLine = raw;
    if (!raw.includes('-->')) {
      i++;
      if (i >= lines.length) break;
      timingLine = lines[i]?.trim() ?? '';
      if (!timingLine.includes('-->')) { i++; continue; }
    }

    const [startStr, endStr] = timingLine.split('-->').map(s => s.trim());
    const startTime = parseTimestamp(startStr);
    const endTime = parseTimestamp(endStr);
    i++;
    if (startTime == null || endTime == null) {
      while (i < lines.length && lines[i].trim()) i++;
      continue;
    }

    const textLines: string[] = [];
    while (i < lines.length && lines[i].trim()) {
      textLines.push(lines[i]);
      i++;
    }
    let text = textLines.join(' ').trim();
    let speaker: string | undefined;
    const m = text.match(/^([^:]+):\s*(.+)$/);
    if (m) { speaker = m[1].trim(); text = m[2].trim(); }
    cues.push({ startTime, endTime, speaker, text });
  }
  return cues;
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `npm test src/utils/captions.test.ts`
Expected: PASS — 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/utils/captions.ts src/utils/captions.test.ts
git commit -m "feat(console): add VTT caption parser"
```

---

## Task 3: Typewriter progress logic

**Files:**
- Create: `src/utils/typewriter.ts`
- Test: `src/utils/typewriter.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/utils/typewriter.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getVisibleCues } from './typewriter';
import type { CaptionCue } from './captions';

const CUES: CaptionCue[] = [
  { startTime: 0, endTime: 2, speaker: 'A', text: 'Hello there' },     // 11 chars
  { startTime: 2.5, endTime: 4, speaker: 'B', text: 'Hi'  },           //  2 chars
  { startTime: 5, endTime: 7, speaker: 'A', text: 'How are you?' },    // 12 chars
];

describe('getVisibleCues', () => {
  it('returns empty before any cue starts', () => {
    expect(getVisibleCues(CUES, -1)).toEqual([]);
  });

  it('partially reveals the active cue at chars-per-second rate', () => {
    // At t=0.5s with cps=28: floor(0.5 * 28) = 14 chars → but text is only 11, so full
    const out = getVisibleCues(CUES, 0.5, 28);
    expect(out).toHaveLength(1);
    expect(out[0].visibleText).toBe('Hello there');
  });

  it('reveals slowly when cps is low', () => {
    // At t=0.1s with cps=10: floor(0.1 * 10) = 1 char
    const out = getVisibleCues(CUES, 0.1, 10);
    expect(out[0].visibleText).toBe('H');
  });

  it('shows all started cues, last one partial', () => {
    const out = getVisibleCues(CUES, 5.2, 10);
    expect(out).toHaveLength(3);
    expect(out[0].visibleText).toBe('Hello there');
    expect(out[1].visibleText).toBe('Hi');
    expect(out[2].visibleText).toBe('Ho'); // 0.2 * 10 = 2 chars
  });

  it('stops at the first not-yet-started cue', () => {
    const out = getVisibleCues(CUES, 3, 100);
    expect(out).toHaveLength(2); // cue 3 hasn't started yet (5s)
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npm test src/utils/typewriter.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/utils/typewriter.ts`**

```typescript
import type { CaptionCue } from './captions';

export interface VisibleCue {
  cue: CaptionCue;
  visibleText: string;
}

export function getVisibleCues(
  cues: CaptionCue[],
  currentTime: number,
  charsPerSecond = 28
): VisibleCue[] {
  const out: VisibleCue[] = [];
  for (const cue of cues) {
    if (currentTime < cue.startTime) break;
    const elapsed = currentTime - cue.startTime;
    const revealed = Math.min(cue.text.length, Math.floor(elapsed * charsPerSecond));
    out.push({ cue, visibleText: cue.text.slice(0, revealed) });
  }
  return out;
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `npm test src/utils/typewriter.test.ts`
Expected: PASS — 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/utils/typewriter.ts src/utils/typewriter.test.ts
git commit -m "feat(console): add typewriter progress logic"
```

---

## Task 4: Placeholder audio + caption assets

These are required for dev/manual testing. Real recordings come later (out of scope for this plan — tracked as Open Question #2 in the spec).

**Files:**
- Create: `public/audio/{restaurant,dealership,hotel,retail}-en.mp3`
- Create: `public/captions/{restaurant,dealership,hotel,retail}-en.vtt`

- [ ] **Step 1: Create the directories**

Run:
```bash
mkdir -p public/audio public/captions
```

- [ ] **Step 2: Generate 4 placeholder silent MP3s**

Each placeholder is a silent MP3 sized to match its industry's `duration` field in `src/data/industries.ts`. Use `ffmpeg` (install via `brew install ffmpeg` if needed):

```bash
ffmpeg -f lavfi -i anullsrc=r=22050:cl=mono -t 28 -b:a 32k public/audio/restaurant-en.mp3
ffmpeg -f lavfi -i anullsrc=r=22050:cl=mono -t 32 -b:a 32k public/audio/dealership-en.mp3
ffmpeg -f lavfi -i anullsrc=r=22050:cl=mono -t 26 -b:a 32k public/audio/hotel-en.mp3
ffmpeg -f lavfi -i anullsrc=r=22050:cl=mono -t 24 -b:a 32k public/audio/retail-en.mp3
```

Expected: 4 silent MP3 files exist in `public/audio/`. Run `ls -la public/audio/` to verify, each should be ~40–80KB.

- [ ] **Step 3: Write the 4 caption VTT files**

Create `public/captions/restaurant-en.vtt`:

```
WEBVTT

00:01.000 --> 00:04.000
Customer: Hi, I'd like to order a pizza for delivery

00:04.500 --> 00:07.500
Agent: Of course! What size and toppings?

00:08.000 --> 00:12.000
Customer: Large, pepperoni and mushrooms, please

00:12.500 --> 00:16.000
Agent: Got it. Address and a phone number to confirm?

00:16.500 --> 00:22.000
Customer: 12 Hamra Street, and the number you have is correct

00:22.500 --> 00:27.000
Agent: Confirmed. Your order arrives in 35 minutes. Thank you.
```

Create `public/captions/dealership-en.vtt`:

```
WEBVTT

00:01.000 --> 00:04.500
Customer: Hi, I'm interested in scheduling a test drive

00:05.000 --> 00:08.500
Agent: Great. Which model are you looking at?

00:09.000 --> 00:13.000
Customer: The new Hyundai Tucson, automatic

00:13.500 --> 00:17.500
Agent: Available Saturday 11 AM or Sunday 2 PM. Which works?

00:18.000 --> 00:22.000
Customer: Saturday 11 AM works

00:22.500 --> 00:27.000
Agent: Booked. You'll get a confirmation SMS in two minutes.

00:27.500 --> 00:31.000
Customer: Perfect, thank you
```

Create `public/captions/hotel-en.vtt`:

```
WEBVTT

00:01.000 --> 00:04.000
Customer: Hi, do you have rooms available next weekend?

00:04.500 --> 00:08.000
Agent: Yes — sea-view deluxe or city-view standard?

00:08.500 --> 00:12.000
Customer: Sea-view please, two nights, two adults

00:12.500 --> 00:17.000
Agent: That's $340 total including breakfast. Shall I hold it?

00:17.500 --> 00:21.000
Customer: Yes, book it

00:21.500 --> 00:25.500
Agent: Confirmed. Check-in is from 2 PM Friday.
```

Create `public/captions/retail-en.vtt`:

```
WEBVTT

00:01.000 --> 00:03.500
Customer: Are you open on Sunday?

00:04.000 --> 00:07.000
Agent: Yes — 11 AM to 8 PM on Sundays.

00:07.500 --> 00:11.500
Customer: Do you carry size 42 in the navy jacket from your window?

00:12.000 --> 00:16.000
Agent: Let me check… yes, we have one in stock. Would you like us to hold it?

00:16.500 --> 00:19.000
Customer: Yes, until 1 PM tomorrow if possible

00:19.500 --> 00:23.000
Agent: Done. Bring this booking code: TLK-742-NV.
```

- [ ] **Step 4: Verify files**

Run: `ls -la public/audio/ public/captions/`
Expected: 4 MP3s + 4 VTTs visible.

- [ ] **Step 5: Commit**

```bash
git add public/audio public/captions
git commit -m "chore(console): add placeholder audio + English captions"
```

---

## Task 5: MetricStrip component

**Files:**
- Create: `src/components/Console/MetricStrip.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/Console/MetricStrip.tsx`:

```tsx
import { Star } from 'lucide-react';

interface MetricStripProps {
  handled: number;
  missed: number;
  rating: number;
}

export function MetricStrip({ handled, missed, rating }: MetricStripProps) {
  return (
    <div className="rounded-lg border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-foreground/50 mb-2">
        Today's calls
      </p>
      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-bold text-foreground">{handled}</span>
          <span className="text-foreground/60 text-xs">handled</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-bold text-foreground">{missed}</span>
          <span className="text-foreground/60 text-xs">missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
          <span className="font-heading font-bold text-foreground">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Console/MetricStrip.tsx
git commit -m "feat(console): add MetricStrip component"
```

---

## Task 6: ConsoleTabs component

**Files:**
- Create: `src/components/Console/ConsoleTabs.tsx`

- [ ] **Step 1: Implement using Radix Tabs**

Create `src/components/Console/ConsoleTabs.tsx`:

```tsx
import * as Tabs from '@radix-ui/react-tabs';
import { INDUSTRIES, type IndustryId } from '@/data/industries';

interface ConsoleTabsProps {
  active: IndustryId;
  onChange: (id: IndustryId) => void;
}

export function ConsoleTabs({ active, onChange }: ConsoleTabsProps) {
  return (
    <Tabs.Root value={active} onValueChange={(v) => onChange(v as IndustryId)}>
      <Tabs.List
        aria-label="Industry"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
      >
        {INDUSTRIES.map((ind) => (
          <Tabs.Trigger
            key={ind.id}
            value={ind.id}
            className={`
              flex items-center justify-center gap-2 px-3 py-2 rounded-lg
              border border-foreground/10 bg-foreground/[0.03]
              text-sm font-medium text-foreground/70
              hover:bg-foreground/[0.06] hover:text-foreground
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A8FA8]
              transition-colors duration-200
              data-[state=active]:bg-[#0F4C5C] data-[state=active]:text-white
              data-[state=active]:border-[#0F4C5C]
            `}
          >
            <span className="text-base" aria-hidden="true">{ind.icon}</span>
            <span>{ind.label.en}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Console/ConsoleTabs.tsx
git commit -m "feat(console): add ConsoleTabs (Radix tablist)"
```

---

## Task 7: ActiveCall component (transcript + audio)

**Files:**
- Create: `src/components/Console/ActiveCall.tsx`

This is the largest component. It owns the `<audio>` element, fetches the VTT file for the active industry, runs the typewriter render loop via `requestAnimationFrame`, and exposes Play/Pause.

- [ ] **Step 1: Implement the component**

Create `src/components/Console/ActiveCall.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Phone } from 'lucide-react';
import type { IndustryConfig } from '@/data/industries';
import { parseVtt, type CaptionCue } from '@/utils/captions';
import { getVisibleCues } from '@/utils/typewriter';

interface ActiveCallProps {
  industry: IndustryConfig;
}

export function ActiveCall({ industry }: ActiveCallProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const [cues, setCues] = useState<CaptionCue[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset state when industry changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
    setIsPlaying(false);
    setCues([]);
  }, [industry.id]);

  // Fetch and parse VTT for current industry
  useEffect(() => {
    let cancelled = false;
    fetch(industry.demoCall.captions.en)
      .then((r) => r.text())
      .then((txt) => {
        if (!cancelled) setCues(parseVtt(txt));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [industry.id, industry.demoCall.captions.en]);

  // Drive typewriter via rAF while playing
  useEffect(() => {
    if (!isPlaying) return;
    const tick = () => {
      const t = audioRef.current?.currentTime ?? 0;
      setCurrentTime(t);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const visible = getVisibleCues(cues, currentTime);
  const progress = industry.demoCall.duration > 0
    ? Math.min(100, (currentTime / industry.demoCall.duration) * 100)
    : 0;

  return (
    <div className="space-y-3">
      {/* Caller line */}
      <div className="flex items-center gap-2 text-xs text-foreground/60">
        <Phone className="w-3.5 h-3.5" />
        <span className="font-medium text-foreground/80">
          {isPlaying ? '● LIVE' : 'Sample Call'}
        </span>
        <span>·</span>
        <span>{industry.demoCall.caller}</span>
      </div>

      {/* Transcript */}
      <div
        className="min-h-[120px] max-h-[160px] overflow-y-auto rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3 space-y-2"
        aria-live="polite"
      >
        {visible.length === 0 ? (
          <p className="text-sm text-foreground/40 italic">
            Press play to hear a real Talkys agent take this call.
          </p>
        ) : (
          visible.map(({ cue, visibleText }, idx) => (
            <p key={`${cue.startTime}-${idx}`} className="text-sm text-foreground/85">
              {cue.speaker && (
                <span className="font-semibold text-[#1A8FA8]">{cue.speaker}: </span>
              )}
              {visibleText}
              {idx === visible.length - 1 && visibleText.length < cue.text.length && (
                <span className="inline-block w-1.5 h-3.5 ml-0.5 align-text-bottom bg-foreground/70 animate-pulse" />
              )}
            </p>
          ))
        )}
      </div>

      {/* Audio controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#0F4C5C] hover:bg-[#1A8FA8] text-white flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A8FA8] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={isPlaying ? 'Pause sample call' : 'Play sample call'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="flex-1">
          <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8] transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-foreground/50 font-mono tabular-nums">
          {formatTime(currentTime)} / {formatTime(industry.demoCall.duration)}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={industry.demoCall.audio.en}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, '0')}`;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Console/ActiveCall.tsx
git commit -m "feat(console): add ActiveCall (audio + typewriter transcript)"
```

---

## Task 8: Console wrapper

**Files:**
- Create: `src/components/Console/index.tsx`

- [ ] **Step 1: Implement the wrapper**

Create `src/components/Console/index.tsx`:

```tsx
import { useState } from 'react';
import { INDUSTRIES, type IndustryId } from '@/data/industries';
import { ConsoleTabs } from './ConsoleTabs';
import { ActiveCall } from './ActiveCall';
import { MetricStrip } from './MetricStrip';

export function Console() {
  const [activeId, setActiveId] = useState<IndustryId>('restaurant');
  const active = INDUSTRIES.find((i) => i.id === activeId)!;

  return (
    <div
      className="
        w-full max-w-[720px] mx-auto
        rounded-2xl border border-foreground/10
        bg-background/80 backdrop-blur-xl
        shadow-[0_20px_60px_-15px_rgba(15,76,92,0.25)]
        overflow-hidden
      "
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/10 bg-foreground/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
          </div>
          <span className="ml-2 text-xs font-medium text-foreground/60">
            Talkys Console
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-foreground/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
          </span>
          <span>Live</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <ConsoleTabs active={activeId} onChange={setActiveId} />
        <ActiveCall industry={active} />
        <MetricStrip {...active.metrics} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Console/index.tsx
git commit -m "feat(console): add Console wrapper composing tabs + call + metrics"
```

---

## Task 9: Integrate Console into HeroSection

**Files:**
- Modify: `src/sections/HeroSection.tsx`

The Console replaces the existing waveform-bars block and stats-bar block. The badge, headline, paragraph, and CTA buttons stay.

- [ ] **Step 1: Replace waveform + stats with the Console**

Open `src/sections/HeroSection.tsx`.

Remove the unused stat imports and array:
- Remove `Clock`, `Globe`, `Phone`, `Zap` from the lucide-react import line (keep `ArrowRight`, `Play`)
- Remove the `stats` const array entirely (currently lines 25–30)
- Remove `useState` from the React import (it is no longer needed)
- Remove the `const [countersVisible, setCountersVisible] = useState(false);` line
- Remove the `setCountersVisible(true);` call from the IntersectionObserver callback

Replace the entire `{/* Waveform */}` block AND the `{/* Stats Bar */}` block (currently lines 92–116) with:

```tsx
{/* Console */}
<div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-[400ms] mt-14">
  <Console />
</div>
```

Add the Console import at the top of the file, near the other section/component imports:

```tsx
import { Console } from '@/components/Console';
```

Also remove the now-unused `countersVisible` state and the `setCountersVisible(true)` call in the IntersectionObserver callback if nothing else references it.

The final imports block at the top of `HeroSection.tsx` should look like:

```tsx
import { useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Console } from '@/components/Console';
```

The final IntersectionObserver effect should look like:

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
  elements?.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}, []);
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc -b && npm run lint`
Expected: no errors, no warnings.

- [ ] **Step 3: Run the dev server**

Run: `npm run dev`

In a browser, visit the URL Vite prints (usually `http://localhost:5173/`).

Verify the following manually:
- Hero loads with badge, headline, paragraph, two CTAs, and the new Console below
- Console shows 4 tabs (Restaurant active by default), the "Press play to hear a real Talkys agent..." placeholder, audio controls, and the metric strip
- Clicking another tab swaps the placeholder text and the metrics, and resets the audio (silent placeholder won't produce sound but the timer should advance)
- Pressing Play makes the timer advance and the typewriter reveals the captions
- The transcript scrolls if it overflows the max-height
- Keyboard: focus a tab, press Left/Right arrow — focus moves between tabs (Radix behavior)

Stop the dev server with Ctrl+C.

- [ ] **Step 4: Build production bundle**

Run: `npm run build`
Expected: build succeeds, no TS errors.

- [ ] **Step 5: Commit**

```bash
git add src/sections/HeroSection.tsx
git commit -m "feat(hero): replace stats/waveform with Talkys Console"
```

---

## Task 10: Final verification + checkpoint

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all suites pass (including pre-existing ribbonUtils + morphUtils tests plus 16 new tests across captions/typewriter/industries).

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors, no warnings.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: clean build.

- [ ] **Step 4: Manual mobile smoke-check**

Start dev server: `npm run dev`. In the browser dev tools, switch to a mobile viewport (e.g. iPhone 14, 390×844). Verify:
- Console adjusts to 2×2 tab grid on narrow widths (Tailwind `grid-cols-2 sm:grid-cols-4`)
- Console is the full width of the hero card area, no horizontal scroll
- Tap targets ≥ 40px (audio button is 40px; tabs ≥ 40px tall)
- Transcript area still scrolls cleanly

Stop dev server with Ctrl+C.

- [ ] **Step 5: Push (optional, ask owner before pushing)**

Confirm with the spec owner whether to push to `main` or open a feature branch PR. Do not push to remote without explicit approval.

---

## Phase 1 acceptance criteria

Phase 1 is done when, on the live site:

1. The hero displays the new Console below the CTA buttons (the old waveform-bars + stats-bar are gone).
2. All 4 industry tabs work: clicking each swaps the transcript placeholder, the caller, the audio source, and the metric strip.
3. Clicking Play on any tab plays its (placeholder) audio and reveals the captions via typewriter; clicking Pause halts both.
4. Audio never autoplays.
5. The hero is keyboard-navigable: tabs respond to arrow keys, Play/Pause is focusable.
6. `npm test`, `npm run lint`, and `npm run build` all pass.

Out of scope for Phase 1 (covered by later phases):
- 3D ribbon reacting to audio (Phase 2)
- Arabic audio + RTL + geo-detect (Phase 3)
- Industry-color theming of the background ambient (Phase 3)
- Real (non-silent) recorded demo calls — the engineer should hand off these placeholder files to whoever records the production audio
