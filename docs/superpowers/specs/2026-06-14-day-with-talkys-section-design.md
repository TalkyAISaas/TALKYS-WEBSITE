# A Day With Talkys — Section Redesign

**Status:** Spec — pending implementation
**Date:** 2026-06-14
**Replaces:** Current 9-tile "What You Get" features grid in `src/sections/FeaturesSection.tsx`

## Why

The current Features section is a 9-tile grid: icon + title + benefit. The owner feels it reads too feature-spec, not story. We're replacing it with a narrative section — a single day at the visitor's business, hour by hour, with Talkys quietly handling the load. The visitor picks their own industry from a tab row and sees a timeline written in their world.

## Scope

This is a one-section swap. No changes to other sections, no new dependencies, no routing changes. Section keeps the `#features` anchor so the nav link still works.

## Final design

### Header (unchanged copy structure)

- **Eyebrow:** `A DAY WITH TALKYS` (was `WHAT YOU GET`)
- **Headline:** `Less time on the phone.` / *`More time with customers.`* (unchanged)
- **Subtitle:** `A real day at your business — pick yours.` (replaces old subtitle)

### Tab row

Pill tabs, centered. Single row on desktop, wraps on mobile. Six tabs in order:

1. **Dealership** *(default active)*
2. **Hotel**
3. **Restaurant**
4. **Pastry**
5. **Retail**
6. **+ Your industry** *(visually distinct: dashed border, ghost style)*

Selected pill uses the existing accent gradient (`from-accent to-accent-soft`) with white text. Inactive pills are white with a subtle border. The "Your industry" pill has a dashed border and an italic teal label to signal it's a different kind of action.

### Timeline body

Below the tab row, a single vertical timeline rendered in a max-width column. Each industry shows exactly four moments. Each moment is:

- **Time label** (e.g., `9:00 AM`) — small, uppercase, accent color
- **Sentence** — plain narrative, with the outcome bolded in teal

The timeline rail is a 2px gradient line (accent → teal) running top-to-bottom. Each moment has a circular dot on the rail.

In RTL (Arabic), the rail flips to the right side, dots flip with it, and text alignment becomes right-to-left.

### Tab behavior

- Clicking an industry tab swaps the timeline content. No URL change, no page reload. A short fade transition (~180ms) covers the swap.
- Clicking `+ Your industry` smooth-scrolls to `#get-started` — same target as the nav's "Book a Demo" button and the hero CTA. The pill briefly highlights as it's activated, then returns to ghost state when the user scrolls away.

### Removed

- The 9-tile grid layout
- All 9 Lucide icons (`Mic`, `BookOpen`, `Phone`, `ArrowRightLeft`, `BarChart3`, `MessageSquare`, `Users`, `Shield`, `Zap`)
- `VanillaTilt` 3D tilt effect and its dependency import inside this section (still used elsewhere)
- The waveform pulse animation (the `animate-wave-pulse` block inside item 4)
- `features.items` translation array (replaced by `features.timeline.industries`)

### Kept

- `ChipEyebrow` and `AccentItalic` components
- `IntersectionObserver` scroll-in animations (`animate-on-scroll`)
- Section ID `#features`
- Section position in the page (after `HowItWorksSection`, before `LogoMarqueeSection`)
- Existing headline + section padding

## Copy — final

### 🚗 Dealership *(default)*
- **9:00 AM** — A buyer asks about pricing on your latest SUV. **Quoted, qualified, scheduled.**
- **1:00 PM** — Someone wants a test drive this weekend. **Booked into your sales calendar.**
- **4:00 PM** — A financing question comes up. **Routed to your sales lead, ready to close.**
- **10:00 PM** — A service inquiry after hours. **Answered. Appointment confirmed for Monday.**

### 🏨 Hotel
- **2:00 AM** — A guest in another timezone wants three nights. **Availability checked, dates negotiated, confirmation sent.**
- **8:00 AM** — Concierge requests start coming in. **Restaurant booked, taxi arranged, no front desk wait.**
- **6:00 PM** — A wedding inquiry rolls in. **Qualified and handed to your events team.**
- **11:30 PM** — Late check-in. **Room code sent, guest settled — you didn't get the call.**

### 🍽️ Restaurant
- **7:00 AM** — Doors open. **Talkys starts taking orders at that exact second. No delays, no sick days.**
- **12:30 PM** — Friday lunch hits, three calls ring at once. **All three get fed. No busy signal, ever.**
- **7:45 PM** — A customer calls upset about a late delivery. **Handed to you with the full transcript.**
- **11:00 PM** — You're home with your family. **Fourteen more orders booked for tomorrow's lunch rush.**

### 🥐 Pastry
- **5:30 AM** — You're still kneading. A catering order rolls in for 9am pickup. **Confirmed and on the slip.**
- **7:00 AM** — Doors open. **Three pickups already lined up. Customer walks in, walks out with a box.**
- **12:00 PM** — Cake-order DMs flood in over lunch. **Each one logged — size, date, contact.**
- **8:00 PM** — You're closed. A wedding cake inquiry lands. **Notes saved, callback scheduled for tomorrow.**

### 🛍️ Retail *(online / e-commerce focus)*
- **10:30 AM** — An Instagram DM: "Is this still in stock?" **Stock checked, checkout link sent, order placed.**
- **2:00 PM** — Three "where's my order?" messages in five minutes. **Tracking pulled, ETAs given. Zero replies needed from you.**
- **7:00 PM** — A return request comes through WhatsApp. **Your policy applied, return label sent, customer happy.**
- **1:00 AM** — A buyer in the Gulf checks sizes. **Size guide in Arabic, checkout link sent. She bought it.**

### + Your industry
- Tab acts as a CTA. Click → smooth-scroll to the existing demo form section.
- Hover label / aria-label: `Don't see yours? Book a demo`

## Translations

Two files updated: `src/i18n/translations/en.ts` and `src/i18n/translations/ar.ts`.

### EN structure (replace existing `features.items`)

```ts
features: {
  titlePrefix: 'Less time on the phone.',
  titleHighlight: 'More time with customers.',
  subtitle: 'A real day at your business — pick yours.',
  eyebrow: 'A DAY WITH TALKYS',
  yourIndustry: 'Your industry',
  yourIndustryAria: "Don't see yours? Book a demo",
  industries: [
    {
      key: 'dealership',
      label: 'Dealership',
      emoji: '🚗',
      moments: [
        { time: '9:00 AM',  text: 'A buyer asks about pricing on your latest SUV.', outcome: 'Quoted, qualified, scheduled.' },
        { time: '1:00 PM',  text: 'Someone wants a test drive this weekend.',       outcome: 'Booked into your sales calendar.' },
        { time: '4:00 PM',  text: 'A financing question comes up.',                  outcome: 'Routed to your sales lead, ready to close.' },
        { time: '10:00 PM', text: 'A service inquiry after hours.',                  outcome: 'Answered. Appointment confirmed for Monday.' },
      ],
    },
    // hotel, restaurant, pastry, retail — same shape
  ],
  // NOTE: existing `features.dashboard` block is unused — verified via grep — remove it in the same commit
}
```

### AR translations

Arabic copy needs a native-feeling rewrite, not a literal translation. Three rules for the AR copy:

1. **Times** stay numeric but localized format: `9:00 صباحًا`, `2:00 ليلًا`, `12:30 ظهرًا`, `7:45 مساءً`, `11:00 ليلًا`.
2. **Outcome bold phrases** should keep the punchy, short rhythm — single clause with crisp verbs (تم الحجز، تم الإرسال، تم تأكيد الموعد).
3. **Industry labels** in AR: معرض السيارات · فندق · مطعم · حلويات · متجر إلكتروني · + اختر مجالك

Full AR copy will be drafted during implementation, reviewed before commit. Industry order stays the same in both locales — Dealership default for both.

## Component architecture

One file changes: `src/sections/FeaturesSection.tsx` — rewritten end-to-end. No new components are extracted (file stays around the same size as before, ~120 lines).

Internal structure:

```tsx
const FeaturesSection = () => {
  const t = useT();
  const industries = t<Industry[]>('features.industries');
  const [activeKey, setActiveKey] = useState('dealership');
  const sectionRef = useRef<HTMLDivElement>(null);

  // existing IntersectionObserver scroll-in animations (kept)

  const active = industries.find((i) => i.key === activeKey) ?? industries[0];

  return (
    <section ref={sectionRef} id="features" className="py-24 lg:py-28">
      <div className="max-w-[920px] mx-auto px-6">
        <Header />                                {/* eyebrow + headline + subtitle */}
        <TabRow industries={industries}
                activeKey={activeKey}
                onSelect={setActiveKey} />
        <Timeline moments={active.moments} />
      </div>
    </section>
  );
};
```

`TabRow`, `Timeline`, and `Header` are inline components (function declarations inside the file or above the default export). They are not exported. If `FeaturesSection.tsx` ever grows past ~200 lines, extract them into a `features/` subfolder — for now, one file keeps the surface area small.

## Animation

- **Section scroll-in:** unchanged. `animate-on-scroll` triggers on the eyebrow, headline, subtitle, tab row, and timeline container as the section enters the viewport.
- **Tab switch:** the timeline block fades out (opacity 0, 90ms), the state swaps, the new timeline fades in (opacity 1, 180ms). Use a `key={activeKey}` on the timeline wrapper plus a CSS transition; no Framer Motion needed.
- **Moment dots:** static. No per-dot animation on tab switch — moments appear together once the timeline fades in.
- **No VanillaTilt.** Removed from this section.

## Accessibility

- The pill tab row is rendered as a `<div role="tablist">` with each pill as `<button role="tab" aria-selected={...} aria-controls="timeline-panel">`.
- The timeline container is `<div id="timeline-panel" role="tabpanel" aria-labelledby={activeKey}>`.
- The `+ Your industry` button is a regular `<a href="#contact">` or `<button>` — NOT a tab. It's announced to screen readers as `Don't see yours? Book a demo` and styled to look adjacent but distinct.
- Tab navigation supports arrow keys (←/→) to move between tabs and Enter/Space to activate, per WAI-ARIA tabs pattern. Optional polish — implement if time allows; not a blocker.

## Risks and edge cases

- **Tab row overflow on mobile:** 5 industry pills + 1 ghost pill = 6 pills. On a 360px screen they will wrap to 2 rows. Acceptable. Confirm during implementation.
- **RTL timeline:** The vertical rail must flip to the right side in `dir="rtl"`. Use logical properties (`inset-inline-start`) where possible, or conditional class via the existing locale context.
- **Emoji rendering on Windows / older Safari:** Industry tab emojis (🚗 🏨 🍽️ 🥐 🛍️) render inconsistently across platforms. **Decision: keep them in the spec copy as visual seasoning, but render them in the live component only if the design QA confirms they look clean across browsers. Default to text-only pills if emoji rendering is patchy.** This is a flip-the-switch decision during implementation.
- **`+ Your industry` scroll target:** Confirmed — `#get-started` (the same target the nav "Book a Demo" button and the hero "Book a Free Demo" CTA already use). No new ids needed.
- **Translation array shape change:** old `features.items` (flat array) is being replaced by `features.industries` (nested with moments). This is a breaking shape change. Old key gets deleted from both `en.ts` and `ar.ts` in the same commit as the component swap.

## Verification

- [ ] Eyeball: section renders, Dealership active by default, 4 moments visible.
- [ ] Click each of the 5 industry tabs — timeline content updates, no console errors.
- [ ] Click `+ Your industry` — page smooth-scrolls to demo form.
- [ ] Switch to Arabic — timeline rail flips to right side, all 5 industries show AR copy.
- [ ] Resize to 360px width — tab row wraps gracefully to 2 rows.
- [ ] Scroll into / out of section — fade-in animations fire once per page load.
- [ ] No leftover references to `features.items`, `VanillaTilt` import inside this file, or any of the 9 removed icons.
- [ ] No TypeScript errors. `npm run build` succeeds.

## Out of scope

- Custom illustrations or icons per industry (text + optional emoji only)
- Analytics events on tab switch (can be added later)
- A/B testing different default tabs
- Localization for languages beyond EN + AR
- Real customer quote / testimonial integration (TestimonialsSection already exists separately)
