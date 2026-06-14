# A Day with Talkys — Section Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 9-tile "What You Get" features grid with a 6-tab "A Day with Talkys" industry timeline, defaulting to Dealership.

**Architecture:** Single-section swap. `src/sections/FeaturesSection.tsx` is rewritten end-to-end. Translation files (`src/i18n/translations/en.ts` and `src/i18n/translations/ar.ts`) get the `features.items` array (plus the unused `features.dashboard` block) replaced with a structured `features.industries` array — each industry has a label, optional emoji, and 4 timeline moments (time + text + outcome). The component renders an eyebrow + headline + subtitle (top), a pill tab row (middle), and a vertical timeline (bottom), with one industry pill acting as a CTA that scrolls to `#get-started`.

**Tech Stack:** React 19 + TypeScript, Vite, Tailwind CSS, existing `LocaleContext` for translations and direction (LTR/RTL). No new dependencies.

**Spec:** [`docs/superpowers/specs/2026-06-14-day-with-talkys-section-design.md`](../specs/2026-06-14-day-with-talkys-section-design.md)

**Note on testing:** No existing section component in `src/sections/` has unit tests, and Vitest is installed but unused for this kind of content/markup work. Verification at each step is via `npm run lint`, `npm run build` (TypeScript check), and visual inspection in `npm run dev`. Adding unit tests for a presentational section would not match the codebase's conventions.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/i18n/translations/en.ts` | Modify | Replace `features.items` + `features.dashboard` with `features.industries`, `features.yourIndustry`, `features.yourIndustryAria`. Also update `features.subtitle` and `features.eyebrow`. |
| `src/i18n/translations/ar.ts` | Modify | Same shape change with Arabic copy. |
| `src/sections/FeaturesSection.tsx` | Rewrite | New component: header + pill tab row + vertical timeline. Drops VanillaTilt, all 9 Lucide icons, waveform animation. Keeps ChipEyebrow, AccentItalic, IntersectionObserver scroll-in. |

---

## Task 1: Update English translations

**Files:**
- Modify: `src/i18n/translations/en.ts:128-155` (the entire `features:` block)

- [ ] **Step 1: Open the file**

Read `src/i18n/translations/en.ts` lines 128-155 to confirm the current `features` block matches the spec's "Removed" list.

- [ ] **Step 2: Replace the `features:` block**

Use the Edit tool. The `old_string` is the entire current `features:` block. The `new_string` is the new structure below.

`old_string` — these exact lines (128 through 155):

```ts
  features: {
    titlePrefix: 'Less time on the phone.',
    titleHighlight: 'More time with customers.',
    subtitle:
      'Talkys handles every call, message, and order — so your team can focus on what matters.',
    eyebrow: 'WHAT YOU GET',
    items: [
      { title: 'Speaks like a real person', desc: 'Local Arabic, fluent English, switches naturally between them.' },
      { title: 'Knows your business', desc: 'Your menu, prices, hours, policies — memorized.' },
      { title: 'No one waits on hold', desc: 'Every caller gets answered. No busy lines, no missed customers.' },
      { title: 'Hands off when it matters', desc: 'The hard calls reach the right person, with full context.' },
      { title: 'See every conversation', desc: 'Read or replay any call — your team always knows the story.' },
      { title: 'Meets customers where they are', desc: 'Phone, WhatsApp, Instagram — one place for everything.' },
      { title: 'A team that fits your brand', desc: 'Pick names, voices, and personalities that match yours.' },
      { title: 'Your customers stay yours', desc: 'Private, never shared. Their trust is safe.' },
      { title: 'Up and running in a day', desc: 'No tech team. No setup headaches. Just answer your first call.' },
    ],
    dashboard: {
      eyebrow: 'Real-Time Intelligence Dashboard',
      title: 'Monitor Every Conversation',
      subtitle: 'Call metrics, transcripts, lead scoring — all in one portal',
      stats: [
        { value: '98%', label: 'Accuracy' },
        { value: '2.4s', label: 'Avg Response' },
        { value: '24/7', label: 'Uptime' },
      ],
    },
  },
```

`new_string`:

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
          { time: '9:00 AM',  text: 'A buyer asks about pricing on your latest SUV.',  outcome: 'Quoted, qualified, scheduled.' },
          { time: '1:00 PM',  text: 'Someone wants a test drive this weekend.',         outcome: 'Booked into your sales calendar.' },
          { time: '4:00 PM',  text: 'A financing question comes up.',                   outcome: 'Routed to your sales lead, ready to close.' },
          { time: '10:00 PM', text: 'A service inquiry after hours.',                   outcome: 'Answered. Appointment confirmed for Monday.' },
        ],
      },
      {
        key: 'hotel',
        label: 'Hotel',
        emoji: '🏨',
        moments: [
          { time: '2:00 AM',  text: 'A guest in another timezone wants three nights.', outcome: 'Availability checked, dates negotiated, confirmation sent.' },
          { time: '8:00 AM',  text: 'Concierge requests start coming in.',              outcome: 'Restaurant booked, taxi arranged, no front desk wait.' },
          { time: '6:00 PM',  text: 'A wedding inquiry rolls in.',                      outcome: 'Qualified and handed to your events team.' },
          { time: '11:30 PM', text: 'Late check-in.',                                    outcome: "Room code sent, guest settled — you didn't get the call." },
        ],
      },
      {
        key: 'restaurant',
        label: 'Restaurant',
        emoji: '🍽️',
        moments: [
          { time: '7:00 AM',  text: 'Doors open.',                                       outcome: 'Talkys starts taking orders at that exact second. No delays, no sick days.' },
          { time: '12:30 PM', text: 'Friday lunch hits, three calls ring at once.',      outcome: 'All three get fed. No busy signal, ever.' },
          { time: '7:45 PM',  text: 'A customer calls upset about a late delivery.',    outcome: 'Handed to you with the full transcript.' },
          { time: '11:00 PM', text: "You're home with your family.",                     outcome: "Fourteen more orders booked for tomorrow's lunch rush." },
        ],
      },
      {
        key: 'pastry',
        label: 'Pastry',
        emoji: '🥐',
        moments: [
          { time: '5:30 AM',  text: "You're still kneading. A catering order rolls in for 9am pickup.", outcome: 'Confirmed and on the slip.' },
          { time: '7:00 AM',  text: 'Doors open.',                                       outcome: 'Three pickups already lined up. Customer walks in, walks out with a box.' },
          { time: '12:00 PM', text: 'Cake-order DMs flood in over lunch.',               outcome: 'Each one logged — size, date, contact.' },
          { time: '8:00 PM',  text: "You're closed. A wedding cake inquiry lands.",      outcome: 'Notes saved, callback scheduled for tomorrow.' },
        ],
      },
      {
        key: 'retail',
        label: 'Retail',
        emoji: '🛍️',
        moments: [
          { time: '10:30 AM', text: 'An Instagram DM: "Is this still in stock?"',        outcome: 'Stock checked, checkout link sent, order placed.' },
          { time: '2:00 PM',  text: 'Three "where\'s my order?" messages in five minutes.', outcome: 'Tracking pulled, ETAs given. Zero replies needed from you.' },
          { time: '7:00 PM',  text: 'A return request comes through WhatsApp.',         outcome: 'Your policy applied, return label sent, customer happy.' },
          { time: '1:00 AM',  text: 'A buyer in the Gulf checks sizes.',                outcome: 'Size guide in Arabic, checkout link sent. She bought it.' },
        ],
      },
    ],
  },
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build succeeds. If errors mention `features.items` or `features.dashboard` being referenced elsewhere, see Step 4. Otherwise proceed.

- [ ] **Step 4: Verify no leftover references to the removed keys**

Run: `grep -rn "features\\.items\\|features\\.dashboard" src/`
Expected: No output. If anything matches, it's a stale reference — pause and report it before continuing.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/translations/en.ts
git commit -m "i18n(en): replace features.items grid with industries timeline copy

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Update Arabic translations

**Files:**
- Modify: `src/i18n/translations/ar.ts:127-154` (the entire `features:` block)

**AR copy rules** (from the spec):
- Times stay numeric but localized: `9:00 صباحًا`, `2:00 ليلًا`, `12:30 ظهرًا`, `7:45 مساءً`, `11:00 ليلًا`, `11:30 ليلًا`, `8:00 صباحًا`, `6:00 مساءً`, `10:30 صباحًا`, `2:00 ظهرًا`, `7:00 مساءً`, `1:00 ليلًا`, `5:30 صباحًا`, `12:00 ظهرًا`, `8:00 مساءً`.
- Industry labels in AR: `معرض السيارات`, `فندق`, `مطعم`, `حلويات`, `متجر إلكتروني`. Your-industry label: `اختر مجالك`.
- Outcome phrases should be punchy: prefer verb-first short clauses (تم الحجز، تم تأكيد الموعد، تم إرسال الرابط).

- [ ] **Step 1: Replace the `features:` block**

Use the Edit tool.

`old_string` (exact lines 127-154):

```ts
  features: {
    titlePrefix: 'وقت أقل على الهاتف.',
    titleHighlight: 'وقت أكثر مع زبائنك.',
    subtitle:
      'يتولى Talkys كل مكالمة ورسالة وطلب — حتى يركّز فريقك على ما يهم.',
    eyebrow: 'ماذا تكسب',
    items: [
      { title: 'يتحدث كأنه إنسان', desc: 'عربية محلية، إنجليزية بطلاقة، وانتقال طبيعي بينهما.' },
      { title: 'يعرف عملك', desc: 'قائمتك، أسعارك، ساعات عملك، سياساتك — محفوظة كاملةً.' },
      { title: 'لا أحد ينتظر على الخط', desc: 'كل اتصال يُجاب عليه. لا خطوط مشغولة، ولا زبائن ضائعون.' },
      { title: 'يحوّل المكالمة عند اللزوم', desc: 'المكالمات الصعبة تصل للشخص المناسب، مع كل التفاصيل.' },
      { title: 'اطّلع على كل محادثة', desc: 'اقرأ أو استمع لأي مكالمة — فريقك يعرف القصة دائماً.' },
      { title: 'حيث يوجد زبائنك', desc: 'الهاتف، واتساب، إنستغرام — كله في مكان واحد.' },
      { title: 'فريق يشبه علامتك', desc: 'اختر أسماء وأصوات وشخصيات تناسب هويتك.' },
      { title: 'زبائنك يبقون زبائنك', desc: 'بياناتهم خاصة، لا تُشارك أبداً. ثقتهم بأمان.' },
      { title: 'جاهز خلال يوم', desc: 'لا فريق تقني. لا متاعب إعداد. فقط استقبل أول مكالمة.' },
    ],
    dashboard: {
      eyebrow: 'لوحة تحكم استخباراتية لحظية',
      title: 'راقب كل محادثة',
      subtitle: 'مقاييس المكالمات، النصوص، تقييم العملاء — كله في بوابة واحدة',
      stats: [
        { value: '٩٨٪', label: 'الدقة' },
        { value: '٢٫٤ث', label: 'متوسط الاستجابة' },
        { value: '٢٤/٧', label: 'الجاهزية' },
      ],
    },
  },
```

`new_string`:

```ts
  features: {
    titlePrefix: 'وقت أقل على الهاتف.',
    titleHighlight: 'وقت أكثر مع زبائنك.',
    subtitle: 'يوم حقيقي في عملك — اختر مجالك.',
    eyebrow: 'يوم مع Talkys',
    yourIndustry: 'اختر مجالك',
    yourIndustryAria: 'لم تجد مجالك؟ احجز عرضاً تجريبياً',
    industries: [
      {
        key: 'dealership',
        label: 'معرض السيارات',
        emoji: '🚗',
        moments: [
          { time: '9:00 صباحًا',  text: 'زبون يسأل عن سعر آخر طراز SUV لديك.',         outcome: 'تم التسعير، تأهيل العميل، وحجز الموعد.' },
          { time: '1:00 ظهرًا',   text: 'أحدهم يريد تجربة قيادة في عطلة الأسبوع.',     outcome: 'تم الحجز في تقويم المبيعات.' },
          { time: '4:00 عصرًا',   text: 'سؤال عن التمويل يصل.',                          outcome: 'تم تحويله لمسؤول المبيعات، جاهز للإغلاق.' },
          { time: '10:00 ليلًا',  text: 'استفسار صيانة بعد الدوام.',                     outcome: 'تم الرد، وتأكيد موعد يوم الإثنين.' },
        ],
      },
      {
        key: 'hotel',
        label: 'فندق',
        emoji: '🏨',
        moments: [
          { time: '2:00 ليلًا',   text: 'ضيف من منطقة زمنية أخرى يريد حجز ثلاث ليالٍ.', outcome: 'تم التحقق من التوفر، التفاوض على التواريخ، وإرسال التأكيد.' },
          { time: '8:00 صباحًا',  text: 'طلبات الكونسيرج تبدأ بالوصول.',                 outcome: 'تم حجز المطعم، ترتيب السيارة، بدون انتظار عند الاستقبال.' },
          { time: '6:00 مساءً',   text: 'استفسار عن حفل زفاف يصل.',                       outcome: 'تم التأهيل وتسليمه لفريق المناسبات.' },
          { time: '11:30 ليلًا',  text: 'تسجيل وصول متأخر.',                              outcome: 'تم إرسال كود الغرفة، الضيف ارتاح — ولم يصلك أي اتصال.' },
        ],
      },
      {
        key: 'restaurant',
        label: 'مطعم',
        emoji: '🍽️',
        moments: [
          { time: '7:00 صباحًا',  text: 'تفتح الأبواب.',                                  outcome: 'يبدأ Talkys استقبال الطلبات في تلك اللحظة بالضبط. لا تأخير ولا أيام مرض.' },
          { time: '12:30 ظهرًا',  text: 'غداء الجمعة، ثلاث مكالمات في نفس اللحظة.',     outcome: 'الثلاثة حصلوا على طلباتهم. لا خط مشغول أبداً.' },
          { time: '7:45 مساءً',   text: 'زبون يتصل غاضباً من تأخر طلبية.',                outcome: 'تم تحويله إليك مع كامل النص.' },
          { time: '11:00 ليلًا',  text: 'أنت في البيت مع عائلتك.',                         outcome: 'أربعة عشر طلباً إضافياً تم حجزها لغداء الغد.' },
        ],
      },
      {
        key: 'pastry',
        label: 'حلويات',
        emoji: '🥐',
        moments: [
          { time: '5:30 صباحًا',  text: 'ما زلت تعجن. طلب كاترينج يصل لاستلام الساعة 9.', outcome: 'تم التأكيد وكتابته على الإيصال.' },
          { time: '7:00 صباحًا',  text: 'تفتح الأبواب.',                                  outcome: 'ثلاث طلبيات جاهزة للاستلام. الزبون يدخل ويخرج بصندوقه.' },
          { time: '12:00 ظهرًا',  text: 'رسائل طلب الكيك تتدفق وقت الغداء.',              outcome: 'كل طلب مسجّل — الحجم والتاريخ والتواصل.' },
          { time: '8:00 مساءً',   text: 'أغلقت المحل. استفسار عن كيكة عرس يصل.',          outcome: 'تم حفظ الملاحظات، وجدولة معاودة الاتصال غداً.' },
        ],
      },
      {
        key: 'retail',
        label: 'متجر إلكتروني',
        emoji: '🛍️',
        moments: [
          { time: '10:30 صباحًا', text: 'رسالة إنستغرام: "هل ما زال متوفراً؟"',           outcome: 'تم التحقق من المخزون، إرسال رابط الشراء، وتأكيد الطلب.' },
          { time: '2:00 ظهرًا',   text: 'ثلاث رسائل "وين طلبيتي؟" خلال خمس دقائق.',      outcome: 'تم سحب التتبع، إعطاء أوقات الوصول. صفر ردود مطلوبة منك.' },
          { time: '7:00 مساءً',   text: 'طلب إرجاع يصل عبر واتساب.',                       outcome: 'تم تطبيق سياستك، إرسال ملصق الإرجاع، الزبون سعيد.' },
          { time: '1:00 ليلًا',   text: 'مشترٍ من الخليج يستفسر عن المقاسات.',            outcome: 'تم شرح دليل المقاسات بالعربية، إرسال رابط الدفع. اشترت.' },
        ],
      },
    ],
  },
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/translations/ar.ts
git commit -m "i18n(ar): replace features.items grid with industries timeline copy

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Rewrite FeaturesSection.tsx

**Files:**
- Rewrite: `src/sections/FeaturesSection.tsx`

- [ ] **Step 1: Read the current file to confirm what's being removed**

Read `src/sections/FeaturesSection.tsx` (all 119 lines). Confirm it imports `Mic, BookOpen, Phone, ArrowRightLeft, BarChart3, MessageSquare, Users, Shield, Zap` from `lucide-react` and `VanillaTilt` from `vanilla-tilt`. These all go away.

- [ ] **Step 2: Replace the entire file**

Use the Write tool to overwrite `src/sections/FeaturesSection.tsx` with the content below.

```tsx
import { useEffect, useRef, useState } from 'react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

type Moment = { time: string; text: string; outcome: string };
type Industry = { key: string; label: string; emoji?: string; moments: Moment[] };

const DEFAULT_KEY = 'dealership';

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const industriesCopy = t<Industry[]>('features.industries');
  const industries: Industry[] = Array.isArray(industriesCopy) ? industriesCopy : [];

  const yourIndustryLabel = (t('features.yourIndustry') as string) || 'Your industry';
  const yourIndustryAria = (t('features.yourIndustryAria') as string) || 'Book a demo';

  const initialKey = industries.some((i) => i.key === DEFAULT_KEY)
    ? DEFAULT_KEY
    : industries[0]?.key ?? DEFAULT_KEY;
  const [activeKey, setActiveKey] = useState<string>(initialKey);

  const active =
    industries.find((i) => i.key === activeKey) ?? industries[0] ?? null;

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

  const scrollToDemo = () => {
    document.querySelector('#get-started')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id="features" className="py-24 lg:py-28">
      <div className="max-w-[920px] mx-auto px-6">
        <div className="text-center mb-10">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('features.eyebrow') as string) || 'A DAY WITH TALKYS'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('features.titlePrefix') as string}{' '}
            <AccentItalic>{t('features.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[520px] mx-auto">
            {t('features.subtitle') as string}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={(t('features.eyebrow') as string) || 'Industries'}
          className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-200 flex flex-wrap justify-center gap-2 mb-10"
        >
          {industries.map((industry) => {
            const isActive = industry.key === activeKey;
            return (
              <button
                key={industry.key}
                role="tab"
                aria-selected={isActive}
                aria-controls="day-timeline-panel"
                onClick={() => setActiveKey(industry.key)}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-accent to-accent-soft text-white border border-transparent shadow-[0_6px_14px_-4px_rgba(229,119,86,0.45)]'
                    : 'bg-white text-muted-foreground border border-black/10 hover:border-black/20'
                }`}
              >
                {industry.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={scrollToDemo}
            aria-label={yourIndustryAria}
            className="text-xs font-semibold italic px-4 py-2 rounded-full border border-dashed border-teal/40 text-teal hover:border-teal/70 hover:bg-teal/5 transition-all"
          >
            + {yourIndustryLabel}
          </button>
        </div>

        {active && (
          <div
            id="day-timeline-panel"
            role="tabpanel"
            aria-labelledby={active.key}
            key={active.key}
            className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-300 max-w-[560px] mx-auto"
          >
            <ol className="relative ps-8 list-none">
              <span
                aria-hidden
                className="absolute inset-y-1 start-[9px] w-[2px] rounded-full bg-gradient-to-b from-accent to-teal"
              />
              {active.moments.map((moment, idx) => (
                <li key={`${active.key}-${idx}`} className="relative py-2.5 ps-0">
                  <span
                    aria-hidden
                    className="absolute top-3.5 -start-8 w-4 h-4 rounded-full bg-white border-[3px] border-accent shadow-[0_0_0_4px_rgba(229,119,86,0.12)]"
                  />
                  <div className="text-[11px] font-bold tracking-[0.08em] text-accent uppercase">
                    {moment.time}
                  </div>
                  <p className="mt-1 text-sm text-foreground leading-[1.5]">
                    {moment.text}{' '}
                    <span className="font-bold text-teal">{moment.outcome}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;
```

- [ ] **Step 3: Verify the new file type-checks**

Run: `npm run build`
Expected: Build succeeds. If TypeScript errors appear:
- Missing `text-teal` / `border-teal/40` / `bg-teal/5` utility classes → check `tailwind.config.js` for the `teal` color token (it exists per the spec — it's the existing color). If not present, fix in `tailwind.config.js`.
- `accent-soft` missing → also defined in the existing config (used in the old component).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: No new errors introduced. If pre-existing errors are present unrelated to this file, ignore them — but any error in `FeaturesSection.tsx` must be resolved.

- [ ] **Step 5: Confirm no stale references**

Run: `grep -rn "VanillaTilt\\|vanilla-tilt" src/sections/FeaturesSection.tsx`
Expected: No output (we removed both the import and the usage).

Run: `grep -rn "lucide-react" src/sections/FeaturesSection.tsx`
Expected: No output.

- [ ] **Step 6: Commit**

```bash
git add src/sections/FeaturesSection.tsx
git commit -m "feat(features): swap 9-tile grid for 6-tab day-with-talkys timeline

Replace the icon+benefit grid with a pill-tab industry switcher
(Dealership default) and a vertical timeline of 4 moments per industry.
The '+ Your industry' pill scrolls to the existing #get-started demo
form. Drops VanillaTilt, all 9 Lucide icons, and the waveform pulse.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Final verification

**Files:** None modified — verification only.

- [ ] **Step 1: Build the project**

Run: `npm run build`
Expected: Both `tsc -b` and `vite build` succeed. No errors.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Expected: Vite starts, prints a local URL (typically `http://localhost:5173`).

- [ ] **Step 3: Visual check — English (LTR)**

Open the URL, scroll to the Features section. Confirm:
- Eyebrow reads `A DAY WITH TALKYS`
- Headline reads `Less time on the phone. More time with customers.` (with the italic accent on the second line)
- Subtitle reads `A real day at your business — pick yours.`
- Tab row shows 5 industry pills (Dealership active by default) + `+ Your industry` dashed pill
- Timeline below shows 4 moments for Dealership
- Clicking each industry pill swaps the timeline content
- Clicking `+ Your industry` smooth-scrolls to the demo form section

- [ ] **Step 4: Visual check — Arabic (RTL)**

Toggle the language to Arabic (the language switcher in the nav). Confirm:
- Section now reads RTL (eyebrow `يوم مع Talkys`, headline `وقت أقل على الهاتف.` etc.)
- Tab row pills show Arabic labels (`معرض السيارات`, `فندق`, `مطعم`, `حلويات`, `متجر إلكتروني`, `+ اختر مجالك`)
- Timeline rail is on the **right** side, dots are on the right (this is the key RTL behavior — verify via the `ps-*` and `-start-*` logical-property classes flipping)
- All 5 industry tabs swap content correctly in AR

- [ ] **Step 5: Mobile width check**

In the browser dev tools, set viewport to 360px width. Confirm:
- Tab row wraps to 2 rows without horizontal overflow
- Timeline still readable (single column)
- All text remains in bounds

- [ ] **Step 6: Console check**

Open the browser console. Confirm:
- No new React errors or warnings introduced by this section
- No 404s for translation keys
- No `Cannot read properties of undefined` errors when switching industries

- [ ] **Step 7: Stop dev server and report**

Stop `npm run dev` (Ctrl+C). Report:
- Build: PASS / FAIL
- EN visual: PASS / FAIL (list any issues)
- AR/RTL visual: PASS / FAIL (list any issues)
- Mobile: PASS / FAIL
- Console clean: YES / NO

If all PASS, the implementation is complete. If any FAIL, fix the issue and re-run the affected verification step before declaring done.

---

## Out of scope (do not implement)

- Custom illustrations or icons per industry
- Analytics events on tab switch
- WAI-ARIA tab keyboard navigation (←/→ arrow keys) — noted as optional polish in the spec
- A/B testing different defaults
- Tests in Vitest — codebase convention is no tests for presentational sections
