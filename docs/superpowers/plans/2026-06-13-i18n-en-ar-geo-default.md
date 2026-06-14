# Talkys i18n (EN/AR with Geo-detected Default) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add English + Arabic translations to the entire Talkys marketing site, with the initial language auto-selected from the visitor's IP geolocation, persisted across visits, and overridable via an EN/AR switcher in the navigation. Apply RTL layout when Arabic is active.

**Architecture:**
A lightweight `LocaleContext` (mirroring the existing `ThemeContext`) holds `{ locale, setLocale, t, dir }`. Translation dictionaries live in `src/i18n/translations/{en,ar}.ts` as deeply nested objects; `t('path.to.key')` does dot-path lookup with a typed key union. On mount, the provider resolves the locale in this order: localStorage > IP geolocation (`api.country.is`) > `navigator.language` > `'en'`. Locale toggles `<html lang>` and `<html dir>`. Components consume strings via `useT()`; the Console keeps using its existing `label.{en,ar}` shape but is rewired to read the active locale.

**Tech Stack:**
- React 19 + TypeScript + Vite (existing)
- Tailwind CSS 3.4 with `rtl:` variants and logical-property utilities (`ms-*`, `me-*`, `text-start`, `text-end`)
- Vitest + happy-dom (already configured; will add happy-dom dep for jsdom-style tests of the provider)
- No new runtime dependency — custom i18n context only

---

## File Structure

**Created:**
- `src/i18n/types.ts` — `Locale` union, `Direction` union, `TranslationKey` type derived from the EN dictionary so misspellings fail to compile.
- `src/i18n/translations/en.ts` — Full English dictionary (every visible string in the app).
- `src/i18n/translations/ar.ts` — Full Arabic dictionary with the same shape (TS enforces parity via `Translations` interface).
- `src/i18n/translate.ts` — Pure `translate(dict, key)` helper that walks the dot-path and returns the string (or the key itself if missing, with a `console.warn` in dev).
- `src/i18n/translate.test.ts` — Unit tests for `translate()` (dot-path lookup, fallback, nested objects, missing keys).
- `src/i18n/geo.ts` — `detectLocaleFromGeo()` async helper that hits `https://api.country.is`, maps to `'ar' | 'en'` using the Arabic-country allowlist, with timeout + AbortController, and a navigator-language fallback. Also exports the country set as a constant.
- `src/i18n/geo.test.ts` — Unit tests with `fetch` mocked (Arabic country, non-Arabic, network error → navigator fallback, timeout).
- `src/context/LocaleContext.tsx` — Provider, `useLocale()` hook, `useT()` hook.
- `src/components/LanguageSwitcher.tsx` — EN/AR toggle button used by `Navigation`.

**Modified:**
- `src/main.tsx` — Wrap `<App/>` in `<LocaleProvider>` so the provider is above `<ThemeProvider>`.
- `src/App.tsx` — No string changes; just confirms render order.
- `index.html` — Default `<html lang="en">` is fine (provider updates at runtime).
- `src/sections/Navigation.tsx` — Strings → `t()`, add `<LanguageSwitcher>`, "Book a Demo" → translated.
- `src/sections/HeroSection.tsx` — All strings → `t()`, including badge, h1, paragraph, both CTAs.
- `src/sections/ProblemSection.tsx` — Section title (split into prefix + highlight) + paragraph + 4 problem cards (title/description/stat label) → `t()`.
- `src/sections/SolutionSection.tsx` — Heading, paragraph, 4 features list, 3 agents (name/role/message), AI Team header → `t()`. Agents are localized via a translation array keyed by index.
- `src/sections/HowItWorksSection.tsx` — Heading (split), paragraph, 5 steps (title/description/detail), POS integration badges → `t()`.
- `src/sections/FeaturesSection.tsx` — Heading (split), paragraph, 9 feature cards, dashboard preview block → `t()`.
- `src/sections/SocialMediaSection.tsx` — Heading (split), paragraph, animated chat messages, integration list, open-API note → `t()`.
- `src/sections/IndustriesSection.tsx` — Heading, paragraph, 8 industries (title/shortTitle/description/role/3 flow steps/quote/4 capabilities) → `t()`. Reuses the same index across both locales.
- `src/sections/GettingStartedSection.tsx` — Heading, paragraph, all 4 expectations, all form labels/placeholders/select options, consent text, submit button → `t()`. The 3 stats on the trust image → `t()`.
- `src/sections/FooterSection.tsx` — Logo description, 3 link sections (Product/Company/Legal) and their items, copyright, social labels → `t()`.
- `src/components/Console/ConsoleTabs.tsx` — `ind.label.en` → `ind.label[locale]` (uses `useLocale()`).
- `src/components/Console/ActiveCall.tsx` — Caption + audio source pick `[locale]`, with English fallback when the Arabic asset 404s. "Sample Call" / "LIVE" → `t()`. Caller label → `t()`.
- `src/components/Console/MetricStrip.tsx` — "Today's calls" / "handled" / "missed" → `t()`. Also uses `toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')` for the numbers.
- `src/components/Console/index.tsx` — Header label "Talkys Console" → `t()`; "Live" badge → `t()`.
- `src/index.css` — Add base RTL helpers: ensure `<html[dir="rtl"]>` body uses an Arabic-friendly font stack (fallback to system Arabic fonts); flip the `card-gradient-border` direction if any are directional.
- `tailwind.config.js` — Add `'Noto Sans Arabic'` and `'IBM Plex Sans Arabic'` to the sans family fallback chain so Arabic glyphs render with consistent weight.

**Not touched (deliberately):**
- `src/data/industries.ts` — already has bilingual `label: { en, ar }`. Keep as-is.
- `src/utils/captions.ts`, `src/utils/typewriter.ts` — locale-agnostic parsing logic.
- `src/components/FloatingObjects.tsx`, `src/components/BackgroundCanvas.tsx` — no text.

**Asset note:** `public/audio/*-ar.mp3` and `public/captions/*-ar.vtt` do not exist on disk. Task 17 wires the ActiveCall fallback so Arabic users hear the English demo with the English captions until those assets are produced. That fallback is silent (no console error).

---

### Task 1: i18n types and translation skeleton

**Files:**
- Create: `src/i18n/types.ts`
- Create: `src/i18n/translations/en.ts`
- Create: `src/i18n/translations/ar.ts`

- [ ] **Step 1: Create `src/i18n/types.ts`**

```ts
export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export const LOCALES: Locale[] = ['en', 'ar'];

export const DIRECTION: Record<Locale, Direction> = {
  en: 'ltr',
  ar: 'rtl',
};

// The shape that both en.ts and ar.ts must satisfy.
// Use `typeof EN_TRANSLATIONS` from en.ts as the canonical shape — ar.ts
// imports the type and is required to match.
```

- [ ] **Step 2: Create `src/i18n/translations/en.ts`** with the full English dictionary

```ts
export const EN_TRANSLATIONS = {
  nav: {
    links: {
      howItWorks: 'How it Works',
      features: 'Features',
      industries: 'Industries',
      integrations: 'Integrations',
      getStarted: 'Get Started',
    },
    bookDemo: 'Book a Demo',
    toggleTheme: 'Toggle theme',
    languageSwitch: 'Switch language',
  },
  hero: {
    badge: 'Now Live in Lebanon',
    title: 'Meet Talkys.',
    subtitle:
      'Talkys gives you a team of AI voice agents that take orders, answer calls, handle deliveries, and manage customer conversations — 24/7, in Arabic and English.',
    ctaPrimary: 'Book a Free Demo',
    ctaSecondary: 'See How It Works',
  },
  problem: {
    titlePrefix: "Lebanon's Businesses Are Losing",
    titleHighlight: 'Revenue',
    titleSuffix: 'to Missed Calls',
    subtitle:
      'Every unanswered call is a lost order. Every busy line is a customer calling your competitor.',
    items: [
      {
        title: 'Missed Calls = Missed Revenue',
        description:
          'Your delivery line rings during peak hours. Staff are busy. Customers hang up and call someone else.',
        statLabel: 'of calls missed during peak hours',
      },
      {
        title: 'Staff Overwhelmed',
        description:
          'Friday night, 8pm — three calls at once, WhatsApp orders, social media DMs stacking up.',
        statLabel: 'more orders than staff can handle',
      },
      {
        title: 'Orders Lost in Translation',
        description:
          'Order taken by phone, written on paper, manually entered into POS. Errors happen.',
        statLabel: 'average order error rate',
      },
      {
        title: 'Hiring Costs Rising',
        description:
          'A receptionist costs $800-1,500/month. They get sick, they leave, they make mistakes.',
        statLabel: '/month per receptionist',
      },
    ],
  },
  solution: {
    titleLine1: 'One Platform.',
    titleLine2: 'A Full Voice Team.',
    paragraph:
      'Talkys lets you build a team of AI voice agents that each have their own name, personality, knowledge base, and role. They answer calls, take orders, book tables, send confirmations, and sync everything to your existing systems — automatically.',
    features: [
      'Unlimited parallel calls — no busy signal, ever',
      'Orders sync directly to Omega & Squirrel POS',
      'Speaks natural Lebanese Arabic + English',
      'Every call logged, transcribed, and searchable',
    ],
    teamCaption: 'Powering businesses across Lebanon',
    teamSubcaption: 'From Beirut to Tripoli',
    meetTeam: 'Meet Your AI Team',
    speaking: 'Speaking',
    standby: 'Standby',
    isSaying: 'is saying:',
    agents: [
      {
        name: 'Layla',
        role: 'Receptionist',
        message:
          '"Ahlan! Welcome to your restaurant. How can I help you today?"',
      },
      {
        name: 'Karim',
        role: 'Delivery',
        message:
          '"Your order is confirmed! Delivery to Hamra in 35 minutes."',
      },
      {
        name: 'Sara',
        role: 'Support',
        message:
          '"I\'ve checked your account — your last order is out for delivery."',
      },
    ],
  },
  howItWorks: {
    titlePrefix: 'How It',
    titleHighlight: 'Works',
    subtitle: 'From the first call to the confirmed order — fully automated.',
    stepLabel: 'STEP',
    steps: [
      {
        title: 'Customer Calls or Messages',
        description:
          'Your AI agent picks up instantly — no hold music, no waiting. Works via phone, WhatsApp, Instagram, or Messenger.',
        detail: 'Instant pickup in < 3 seconds',
      },
      {
        title: 'AI Takes the Order',
        description:
          'Natural conversation in Arabic or English. The agent knows your full menu, pricing, and availability.',
        detail: 'Bilingual AR/EN conversations',
      },
      {
        title: 'Synced to Your POS',
        description:
          'Order appears on your kitchen screen instantly — zero manual entry. Direct integration with Omega & Squirrel.',
        detail: 'Real-time POS integration',
      },
      {
        title: 'Confirmation Sent',
        description:
          'Customer receives order summary + delivery ETA automatically via WhatsApp or SMS.',
        detail: 'WhatsApp auto-confirmation',
      },
      {
        title: 'Dashboard Updated',
        description:
          'Full transcript, order value, and status visible in your admin portal with real-time analytics.',
        detail: 'Live analytics & transcripts',
      },
    ],
    integrations: ['Omega POS', 'Squirrel POS', 'WhatsApp Business', 'Instagram', 'Messenger'],
  },
  features: {
    titlePrefix: 'Everything Your Voice Team',
    titleHighlight: 'Needs',
    subtitle:
      'Built for Lebanese businesses, Talkys combines enterprise-grade AI with simplicity.',
    items: [
      { title: 'Natural Voice', desc: 'Arabic & English with natural code-switching between dialects' },
      { title: 'Custom Knowledge', desc: 'Train each agent on your business — menu, FAQ, policies' },
      { title: 'Unlimited Calls', desc: 'Handle hundreds of calls simultaneously, zero busy signals' },
      { title: 'Smart Transfer', desc: 'AI detects when to escalate to a human and transfers seamlessly' },
      { title: 'Live Analytics', desc: 'Real-time dashboard with call metrics, transcripts, and KPIs' },
      { title: 'Omnichannel', desc: 'WhatsApp, Instagram, Messenger, SMS — all in one inbox' },
      { title: 'Multiple Agents', desc: 'Create unique AI personas with different voices and personalities' },
      { title: 'Secure & Compliant', desc: 'End-to-end encryption with GDPR-ready data handling' },
      { title: 'No-Code Setup', desc: 'Go live in days, not months. No developer or IT team required' },
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
  social: {
    titlePrefix: 'Turn Social Media Messages Into',
    titleHighlight: 'Confirmed Orders',
    subtitle:
      'Talkys connects to every platform your customers use and converts conversations into revenue.',
    phoneFrame: 'Instagram DM',
    handle: '@YourRestaurant',
    handleSub: 'Instagram Business',
    activeBadge: 'Active',
    messages: {
      customer1: 'Baddo order 1 shawarma w 2 fries please, Hamra area',
      agent1:
        'Ahlan! Receiving your order now. Talkys will call you in a few seconds to confirm your address.',
      customer2: 'Ok thanks!',
      incomingFrom: 'Incoming call from +961 XX XXX XXX',
      incomingSub: 'Talkys — Order Confirmation',
      confirmed:
        'Order confirmed! 1 Shawarma + 2 Fries — Delivery to Hamra in 35 min.',
    },
    integrationsHeader: 'Connects to Your Entire Stack',
    integrationsSubtitle:
      'Talkys integrates with the tools you already use. POS systems, CRMs, messaging platforms — everything syncs automatically.',
    openApiBefore: "Don't see your stack? Talkys",
    openApiHighlight: 'open API',
    openApiAfter: 'connects to any platform.',
    talkToUs: 'Talk to us',
  },
  industries: {
    titlePrefix: 'Built for Every',
    titleHighlight: 'Lebanese Business',
    subtitle:
      'Whether you run a restaurant, clinic, logistics company, or retail store — Talkys adapts to your industry.',
    speakingLabel: 'Talkys speaking to customer',
    items: [
      {
        shortTitle: 'Food',
        title: 'Restaurants & Food Delivery',
        description:
          'Take orders in Arabic and English, sync to POS, confirm via WhatsApp.',
        role: 'Ordering + Receptionist',
        flow: ['Customer calls or DMs', 'Talkys takes order and address', 'POS sync + ETA confirmation'],
        quote: '"Ahlan! I see you usually order 2 shawarmas. Same address in Hamra?"',
        capabilities: ['Menu knowledge', 'POS integration', 'Delivery tracking', 'Upselling'],
      },
      {
        shortTitle: 'Healthcare',
        title: 'Clinics & Healthcare',
        description: 'Book appointments, handle inquiries, send reminders 24/7.',
        role: 'Secretary + Appointment Agent',
        flow: ['Patient calls', 'Talkys books appointment slot', 'Reminder sent with clinic details'],
        quote: '"Dr. Hanna has availability Thursday at 3pm. Shall I book that for you?"',
        capabilities: ['Scheduling', 'Patient records', 'Reminders', 'Insurance queries'],
      },
      {
        shortTitle: 'Retail',
        title: 'Retail & E-commerce',
        description: 'Handle order inquiries, process returns, answer product questions.',
        role: 'Customer Service + Lead Agent',
        flow: ['Client asks about product', 'Talkys qualifies intent and details', 'Lead/opportunity pushed to CRM'],
        quote: '"The leather bag you liked is back in stock. Want me to reserve one?"',
        capabilities: ['Product catalog', 'CRM sync', 'Returns handling', 'Recommendations'],
      },
      {
        shortTitle: 'Real Estate',
        title: 'Real Estate',
        description: 'Qualify leads, schedule viewings, answer property questions.',
        role: 'Lead Management',
        flow: ['Inbound inquiry received', 'Talkys qualifies budget and area', 'Viewing booked with agent'],
        quote: '"Welcome back, Ahmad. You were looking at 3-bedroom villas in Beit Mery..."',
        capabilities: ['Lead scoring', 'Property matching', 'Viewing scheduler', 'Follow-ups'],
      },
      {
        shortTitle: 'Salons',
        title: 'Salons & Beauty',
        description: 'Book appointments, send reminders, handle cancellations.',
        role: 'Receptionist',
        flow: ['Customer requests service', 'Talkys finds open slot', 'Booking confirmation + reminders'],
        quote: '"We have an opening with Sarah at 2pm for a blowout. Should I confirm?"',
        capabilities: ['Booking system', 'Staff schedules', 'Cancellations', 'Product upsells'],
      },
      {
        shortTitle: 'Transport',
        title: 'Transportation',
        description:
          'Handle booking inquiries, track shipments, manage fleet communications.',
        role: 'Call Answering + Dispatch',
        flow: ['Client calls for shipment status', 'Talkys fetches live update', 'Status and ETA shared instantly'],
        quote: '"Your shipment #4821 is currently in customs. Expected release: tomorrow 10am."',
        capabilities: ['Fleet tracking', 'ETA updates', 'Dispatch coordination', 'Status queries'],
      },
      {
        shortTitle: 'Logistics',
        title: 'Logistics & Warehousing',
        description:
          'Manage delivery schedules, coordinate pickups, update customers.',
        role: 'Operations Assistant',
        flow: ['Pickup request received', 'Talkys confirms window and details', 'Task pushed to operations queue'],
        quote: '"Your pickup is scheduled for tomorrow between 9-11am. Driver Ahmad will call before arriving."',
        capabilities: ['Pickup scheduling', 'Inventory queries', 'Route optimization', 'Customer updates'],
      },
      {
        shortTitle: 'Import/Export',
        title: 'Import & Export',
        description:
          'Handle customs inquiries, track shipments, coordinate with partners.',
        role: 'Client Calls + Service Desk',
        flow: ['Partner calls for customs status', 'Talkys answers from knowledge base', 'Case logged for follow-up'],
        quote: '"Container MSKU-7291 cleared customs yesterday. Delivery to warehouse is scheduled Friday."',
        capabilities: ['Customs tracking', 'Document status', 'Partner coordination', 'Case management'],
      },
    ],
  },
  getStarted: {
    titlePrefix: 'Book Your',
    titleHighlight: 'Free Demo',
    paragraph:
      'See exactly how Talkys works for your business. Our team will walk you through a live demo customized to your industry and workflow.',
    whatToExpect: 'What to Expect',
    expectations: [
      'Live Talkys conversation demo',
      'Full workflow walkthrough',
      'Admin portal demo',
      'Custom integration & pricing',
    ],
    stats: [
      { value: '24/7', label: 'Always On' },
      { value: 'AR+EN', label: 'Bilingual' },
      { value: '<3s', label: 'Response' },
    ],
    form: {
      fullName: 'Full Name *',
      fullNamePlaceholder: 'John Doe',
      email: 'Work Email *',
      emailPlaceholder: 'john@company.com',
      company: 'Company Name',
      companyPlaceholder: 'Your Company',
      industry: 'Industry',
      industrySelect: 'Select industry',
      industryOptions: {
        food: 'Restaurants & Food',
        healthcare: 'Healthcare',
        retail: 'Retail & E-commerce',
        realestate: 'Real Estate',
        salon: 'Salons & Beauty',
        transport: 'Transportation',
        logistics: 'Logistics',
        other: 'Other',
      },
      phone: 'Phone Number',
      phonePlaceholder: '+961 XX XXX XXX',
      useCase: 'Tell us about your use case',
      useCasePlaceholder: 'What would you like Talkys to handle?',
      consent:
        'I agree to receive communications from Talkys. You can unsubscribe at any time.',
      submit: 'Book My Demo',
      successMessage: 'Demo booking coming soon!',
    },
  },
  footer: {
    description:
      "The AI voice agent that never sleeps. Lebanon's first AI voice workforce platform. One portal, unlimited agents, every channel connected.",
    regions: 'Lebanon · MENA · Global',
    categories: {
      Product: 'Product',
      Company: 'Company',
      Legal: 'Legal',
    },
    links: {
      Product: ['Features', 'Integrations', 'Industries', 'Analytics', 'Admin Portal', 'Pricing'],
      Company: ['About Us', 'FAQ', 'Contact'],
      Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    },
    copyright: '© 2025 Talkys AI · All rights reserved',
  },
  console: {
    label: 'Talkys Console',
    live: 'Live',
    sampleCall: 'Sample Call',
    liveTag: '● LIVE',
    playAria: 'Play sample call',
    pauseAria: 'Pause sample call',
    transcriptPrompt: 'Press play to hear a real Talkys agent take this call.',
    metrics: {
      todaysCalls: "Today's calls",
      handled: 'handled',
      missed: 'missed',
    },
  },
} as const;

export type Translations = typeof EN_TRANSLATIONS;
```

- [ ] **Step 3: Create `src/i18n/translations/ar.ts`** mirroring the same shape

```ts
import type { Translations } from './en';

export const AR_TRANSLATIONS: Translations = {
  nav: {
    links: {
      howItWorks: 'كيف يعمل',
      features: 'الميزات',
      industries: 'القطاعات',
      integrations: 'التكاملات',
      getStarted: 'ابدأ الآن',
    },
    bookDemo: 'احجز عرضاً تجريبياً',
    toggleTheme: 'تبديل المظهر',
    languageSwitch: 'تبديل اللغة',
  },
  hero: {
    badge: 'متوفر الآن في لبنان',
    title: 'تعرّف على Talkys.',
    subtitle:
      'يمنحك Talkys فريقاً من وكلاء الصوت الذكاء الاصطناعي يستقبلون الطلبات، يردّون على المكالمات، يديرون التوصيل والمحادثات مع عملائك — على مدار الساعة، بالعربية والإنجليزية.',
    ctaPrimary: 'احجز عرضاً مجانياً',
    ctaSecondary: 'شاهد كيف يعمل',
  },
  problem: {
    titlePrefix: 'أعمال لبنان تفقد',
    titleHighlight: 'الإيرادات',
    titleSuffix: 'بسبب المكالمات الفائتة',
    subtitle:
      'كل مكالمة دون رد هي طلب مفقود. وكل خط مشغول هو زبون يتصل بمنافسك.',
    items: [
      {
        title: 'مكالمات فائتة = إيرادات مفقودة',
        description:
          'خط التوصيل يرنّ في أوقات الذروة. الموظفون مشغولون. الزبائن يقفلون ويتصلون بمكان آخر.',
        statLabel: 'نسبة المكالمات الفائتة في أوقات الذروة',
      },
      {
        title: 'الموظفون تحت ضغط',
        description:
          'ليلة الجمعة، الساعة ٨ — ثلاث مكالمات دفعة واحدة، طلبات واتساب، رسائل سوشيال ميديا تتراكم.',
        statLabel: 'أكثر مما يستطيع فريقك التعامل معه',
      },
      {
        title: 'طلبات تضيع في الترجمة',
        description:
          'طلب على الهاتف، يُكتب على ورقة، يُدخل يدوياً إلى نقطة البيع. والأخطاء تحصل.',
        statLabel: 'متوسط نسبة الأخطاء في الطلبات',
      },
      {
        title: 'تكاليف التوظيف ترتفع',
        description:
          'موظف الاستقبال يكلّف ٨٠٠–١٥٠٠ دولار شهرياً. يمرض، يستقيل، ويرتكب الأخطاء.',
        statLabel: '/شهرياً لكل موظف استقبال',
      },
    ],
  },
  solution: {
    titleLine1: 'منصة واحدة.',
    titleLine2: 'فريق صوتي كامل.',
    paragraph:
      'يتيح لك Talkys بناء فريق من وكلاء الصوت الذكاء الاصطناعي، لكل منهم اسمه وشخصيته وقاعدة معرفته ودوره. يردّون على المكالمات، يستقبلون الطلبات، يحجزون الطاولات، يرسلون التأكيدات، ويزامنون كل شيء مع أنظمتك الحالية — تلقائياً.',
    features: [
      'مكالمات متوازية غير محدودة — لا إشارة انشغال أبداً',
      'الطلبات تُزامن مباشرة مع Omega و Squirrel POS',
      'يتحدث العربية اللبنانية الطبيعية والإنجليزية',
      'كل مكالمة مسجّلة، مفرغة نصياً، وقابلة للبحث',
    ],
    teamCaption: 'يدعم الأعمال في كل لبنان',
    teamSubcaption: 'من بيروت إلى طرابلس',
    meetTeam: 'تعرّف على فريقك الذكي',
    speaking: 'يتحدث',
    standby: 'في الانتظار',
    isSaying: 'يقول:',
    agents: [
      {
        name: 'ليلى',
        role: 'موظفة استقبال',
        message: '"أهلاً! أهلاً بك في مطعمك. كيف أقدر أساعدك اليوم؟"',
      },
      {
        name: 'كريم',
        role: 'التوصيل',
        message: '"طلبك مؤكد! التوصيل إلى الحمرا خلال ٣٥ دقيقة."',
      },
      {
        name: 'سارة',
        role: 'الدعم',
        message: '"تفقّدت حسابك — آخر طلب لك في طريقه إليك."',
      },
    ],
  },
  howItWorks: {
    titlePrefix: 'كيف',
    titleHighlight: 'يعمل',
    subtitle: 'من أول مكالمة وحتى تأكيد الطلب — أتمتة كاملة.',
    stepLabel: 'خطوة',
    steps: [
      {
        title: 'الزبون يتصل أو يرسل رسالة',
        description:
          'وكيلك الذكي يجيب فوراً — بدون انتظار. يعمل عبر الهاتف، واتساب، إنستغرام، أو ماسنجر.',
        detail: 'إجابة فورية خلال أقل من ٣ ثوانٍ',
      },
      {
        title: 'الذكاء الاصطناعي يستقبل الطلب',
        description:
          'محادثة طبيعية بالعربية أو الإنجليزية. الوكيل يعرف قائمتك الكاملة والأسعار والتوافر.',
        detail: 'محادثات ثنائية اللغة AR/EN',
      },
      {
        title: 'مزامنة مع نقطة البيع لديك',
        description:
          'الطلب يظهر فوراً على شاشة المطبخ — بدون إدخال يدوي. تكامل مباشر مع Omega و Squirrel.',
        detail: 'تكامل لحظي مع POS',
      },
      {
        title: 'إرسال التأكيد',
        description:
          'الزبون يستلم ملخص الطلب والوقت المتوقع للتوصيل تلقائياً عبر واتساب أو SMS.',
        detail: 'تأكيد تلقائي عبر واتساب',
      },
      {
        title: 'تحديث لوحة التحكم',
        description:
          'النص الكامل للمكالمة، قيمة الطلب، والحالة في بوابة الإدارة مع تحليلات فورية.',
        detail: 'تحليلات ونصوص حيّة',
      },
    ],
    integrations: ['Omega POS', 'Squirrel POS', 'WhatsApp Business', 'Instagram', 'Messenger'],
  },
  features: {
    titlePrefix: 'كل ما يحتاجه',
    titleHighlight: 'فريقك الصوتي',
    subtitle:
      'مصمّم للأعمال اللبنانية، Talkys يجمع الذكاء الاصطناعي بمستوى المؤسسات مع البساطة.',
    items: [
      { title: 'صوت طبيعي', desc: 'عربية وإنجليزية مع تبديل طبيعي بين اللهجات' },
      { title: 'معرفة مخصصة', desc: 'درّب كل وكيل على عملك — القائمة، الأسئلة الشائعة، السياسات' },
      { title: 'مكالمات غير محدودة', desc: 'تعامل مع مئات المكالمات في وقت واحد، بدون إشارة انشغال' },
      { title: 'تحويل ذكي', desc: 'الذكاء الاصطناعي يكتشف متى ينبغي تحويل المكالمة إلى موظف بشري' },
      { title: 'تحليلات حيّة', desc: 'لوحة تحكم لحظية مع مقاييس المكالمات والنصوص والمؤشرات' },
      { title: 'كل القنوات', desc: 'واتساب، إنستغرام، ماسنجر، SMS — كلها في صندوق وارد واحد' },
      { title: 'وكلاء متعددون', desc: 'أنشئ شخصيات ذكاء اصطناعي بأصوات وطباع مختلفة' },
      { title: 'آمن ومتوافق', desc: 'تشفير من طرف إلى طرف وتعامل مع البيانات وفق GDPR' },
      { title: 'بدون برمجة', desc: 'ابدأ خلال أيام لا أشهر. لا حاجة لمطوّر أو فريق IT' },
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
  social: {
    titlePrefix: 'حوّل رسائل السوشيال ميديا إلى',
    titleHighlight: 'طلبات مؤكدة',
    subtitle:
      'يتصل Talkys بكل المنصات التي يستخدمها زبائنك ويحوّل المحادثات إلى إيرادات.',
    phoneFrame: 'رسالة إنستغرام',
    handle: '@YourRestaurant',
    handleSub: 'حساب أعمال إنستغرام',
    activeBadge: 'نشط',
    messages: {
      customer1: 'بدّو أوردر شاورما وحدة و٢ بطاطا، منطقة الحمرا',
      agent1:
        'أهلاً! عم نستلم طلبك. Talkys رح يتصل فيك بعد ثوانٍ ليأكد العنوان.',
      customer2: 'تمام، شكراً!',
      incomingFrom: 'مكالمة واردة من +961 XX XXX XXX',
      incomingSub: 'Talkys — تأكيد الطلب',
      confirmed:
        'تم تأكيد الطلب! ١ شاورما + ٢ بطاطا — توصيل إلى الحمرا خلال ٣٥ دقيقة.',
    },
    integrationsHeader: 'يتصل بكامل منظومتك',
    integrationsSubtitle:
      'يتكامل Talkys مع الأدوات التي تستخدمها أصلاً. أنظمة POS، CRM، منصات المراسلة — كلها تُزامن تلقائياً.',
    openApiBefore: 'لا ترى منظومتك؟ Talkys',
    openApiHighlight: 'API مفتوحة',
    openApiAfter: 'تتصل بأي منصة.',
    talkToUs: 'تحدث إلينا',
  },
  industries: {
    titlePrefix: 'مصمّم لكل',
    titleHighlight: 'عمل لبناني',
    subtitle:
      'سواء كنت تدير مطعماً أو عيادة أو شركة لوجستية أو متجراً — Talkys يتكيّف مع قطاعك.',
    speakingLabel: 'Talkys يتحدث إلى الزبون',
    items: [
      {
        shortTitle: 'مطاعم',
        title: 'المطاعم والتوصيل',
        description:
          'استقبل الطلبات بالعربية والإنجليزية، زامن مع POS، أكد عبر واتساب.',
        role: 'استقبال طلبات + موظفة استقبال',
        flow: ['الزبون يتصل أو يرسل', 'Talkys يأخذ الطلب والعنوان', 'مزامنة POS + تأكيد وقت التوصيل'],
        quote: '"أهلاً! عادةً تطلب شاورمتين. نفس العنوان في الحمرا؟"',
        capabilities: ['معرفة بالقائمة', 'تكامل POS', 'تتبع التوصيل', 'بيع إضافي'],
      },
      {
        shortTitle: 'الرعاية',
        title: 'العيادات والرعاية الصحية',
        description: 'حجز المواعيد، الإجابة على الاستفسارات، إرسال التذكيرات على مدار الساعة.',
        role: 'سكرتيرة + وكيل مواعيد',
        flow: ['المريض يتصل', 'Talkys يحجز موعداً', 'إرسال تذكير مع تفاصيل العيادة'],
        quote: '"د. حنا متوفر يوم الخميس الساعة ٣ بعد الظهر. أحجز لك؟"',
        capabilities: ['جدولة', 'سجلات المرضى', 'تذكيرات', 'استفسارات التأمين'],
      },
      {
        shortTitle: 'التجزئة',
        title: 'التجزئة والتجارة الإلكترونية',
        description: 'استفسارات الطلبات، إدارة المرتجعات، الإجابة عن المنتجات.',
        role: 'خدمة عملاء + وكيل عملاء محتملين',
        flow: ['الزبون يسأل عن منتج', 'Talkys يؤهّل النية والتفاصيل', 'فرصة العمل تُرحّل إلى CRM'],
        quote: '"حقيبة الجلد التي أعجبتك متوفرة من جديد. أحجز لك واحدة؟"',
        capabilities: ['كاتالوغ المنتجات', 'مزامنة CRM', 'إدارة المرتجعات', 'التوصيات'],
      },
      {
        shortTitle: 'العقارات',
        title: 'العقارات',
        description: 'تأهيل العملاء، تنسيق المعاينات، الإجابة على أسئلة العقار.',
        role: 'إدارة العملاء المحتملين',
        flow: ['استلام استفسار', 'Talkys يؤهّل الميزانية والمنطقة', 'تحديد موعد المعاينة'],
        quote: '"مرحباً مجدداً أحمد. كنت تبحث عن فيلا ٣ غرف في بيت مري..."',
        capabilities: ['تقييم العملاء', 'مطابقة العقارات', 'جدولة المعاينات', 'المتابعة'],
      },
      {
        shortTitle: 'الصالونات',
        title: 'الصالونات والتجميل',
        description: 'حجز المواعيد، إرسال التذكيرات، التعامل مع الإلغاءات.',
        role: 'موظفة استقبال',
        flow: ['الزبونة تطلب خدمة', 'Talkys يبحث عن موعد متاح', 'تأكيد الحجز والتذكيرات'],
        quote: '"عندنا موعد مع سارة الساعة ٢ لتسريحة. أأكد؟"',
        capabilities: ['نظام الحجز', 'جداول الموظفين', 'الإلغاءات', 'منتجات إضافية'],
      },
      {
        shortTitle: 'النقل',
        title: 'النقل',
        description:
          'استفسارات الحجز، تتبع الشحنات، إدارة اتصالات الأسطول.',
        role: 'استقبال مكالمات + توزيع',
        flow: ['زبون يتصل لمعرفة حالة الشحنة', 'Talkys يجلب التحديث', 'مشاركة الحالة والوقت المتوقع'],
        quote: '"شحنتك رقم 4821 في الجمارك حالياً. الإفراج المتوقع: غداً الساعة ١٠ صباحاً."',
        capabilities: ['تتبع الأسطول', 'تحديث الأوقات', 'تنسيق التوزيع', 'استفسارات الحالة'],
      },
      {
        shortTitle: 'لوجستيات',
        title: 'اللوجستيات والمستودعات',
        description:
          'إدارة جداول التوصيل، تنسيق الاستلام، تحديث الزبائن.',
        role: 'مساعد عمليات',
        flow: ['استلام طلب pickup', 'Talkys يؤكد الموعد والتفاصيل', 'دفع المهمة لطابور العمليات'],
        quote: '"الـ pickup مجدول غداً بين ٩ و١١ صباحاً. السائق أحمد رح يتصل قبل الوصول."',
        capabilities: ['جدولة الاستلام', 'استفسارات المخزون', 'تحسين المسار', 'تحديثات الزبائن'],
      },
      {
        shortTitle: 'استيراد/تصدير',
        title: 'الاستيراد والتصدير',
        description:
          'استفسارات الجمارك، تتبع الشحنات، التنسيق مع الشركاء.',
        role: 'مكالمات الزبائن + مكتب الخدمة',
        flow: ['شريك يتصل لحالة الجمارك', 'Talkys يجيب من قاعدة المعرفة', 'تسجيل الحالة للمتابعة'],
        quote: '"الحاوية MSKU-7291 خرجت من الجمارك أمس. التوصيل للمستودع مجدول الجمعة."',
        capabilities: ['تتبع الجمارك', 'حالة الوثائق', 'تنسيق الشركاء', 'إدارة الحالات'],
      },
    ],
  },
  getStarted: {
    titlePrefix: 'احجز',
    titleHighlight: 'عرضك التجريبي المجاني',
    paragraph:
      'شاهد بالضبط كيف يعمل Talkys لعملك. فريقنا سيرافقك في عرض حيّ مخصّص لقطاعك وسير عملك.',
    whatToExpect: 'ماذا تتوقع',
    expectations: [
      'عرض حي لمحادثة Talkys',
      'جولة كاملة في سير العمل',
      'عرض بوابة الإدارة',
      'تكامل وأسعار مخصصة',
    ],
    stats: [
      { value: '٢٤/٧', label: 'دائماً متاح' },
      { value: 'AR+EN', label: 'ثنائي اللغة' },
      { value: '<٣ث', label: 'الاستجابة' },
    ],
    form: {
      fullName: 'الاسم الكامل *',
      fullNamePlaceholder: 'علي فقيه',
      email: 'البريد الإلكتروني للعمل *',
      emailPlaceholder: 'name@company.com',
      company: 'اسم الشركة',
      companyPlaceholder: 'شركتك',
      industry: 'القطاع',
      industrySelect: 'اختر القطاع',
      industryOptions: {
        food: 'مطاعم وتوصيل',
        healthcare: 'رعاية صحية',
        retail: 'تجزئة وتجارة إلكترونية',
        realestate: 'عقارات',
        salon: 'صالونات وتجميل',
        transport: 'نقل',
        logistics: 'لوجستيات',
        other: 'أخرى',
      },
      phone: 'رقم الهاتف',
      phonePlaceholder: '+961 XX XXX XXX',
      useCase: 'حدّثنا عن استخدامك',
      useCasePlaceholder: 'ماذا تريد من Talkys أن يتولى؟',
      consent:
        'أوافق على تلقي مراسلات من Talkys. يمكنك إلغاء الاشتراك في أي وقت.',
      submit: 'احجز عرضي',
      successMessage: 'حجز العرض قريباً!',
    },
  },
  footer: {
    description:
      'وكيل الصوت الذكاء الاصطناعي الذي لا ينام. أول منصة قوى عاملة صوتية ذكية في لبنان. بوابة واحدة، وكلاء غير محدودين، وكل القنوات متصلة.',
    regions: 'لبنان · الشرق الأوسط · عالمياً',
    categories: {
      Product: 'المنتج',
      Company: 'الشركة',
      Legal: 'قانوني',
    },
    links: {
      Product: ['الميزات', 'التكاملات', 'القطاعات', 'التحليلات', 'بوابة الإدارة', 'الأسعار'],
      Company: ['من نحن', 'الأسئلة الشائعة', 'تواصل معنا'],
      Legal: ['سياسة الخصوصية', 'شروط الخدمة', 'سياسة الكوكيز'],
    },
    copyright: '© 2025 Talkys AI · جميع الحقوق محفوظة',
  },
  console: {
    label: 'وحدة تحكم Talkys',
    live: 'مباشر',
    sampleCall: 'مكالمة نموذجية',
    liveTag: '● مباشر',
    playAria: 'تشغيل مكالمة نموذجية',
    pauseAria: 'إيقاف مكالمة نموذجية',
    transcriptPrompt: 'اضغط تشغيل لسماع وكيل Talkys يتلقى هذه المكالمة.',
    metrics: {
      todaysCalls: 'مكالمات اليوم',
      handled: 'تمت معالجتها',
      missed: 'فائتة',
    },
  },
};
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/types.ts src/i18n/translations/en.ts src/i18n/translations/ar.ts
git commit -m "feat(i18n): add EN/AR translation dictionaries"
```

---

### Task 2: `translate()` helper

**Files:**
- Create: `src/i18n/translate.ts`
- Create: `src/i18n/translate.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/translate.test.ts
import { describe, it, expect, vi } from 'vitest';
import { translate } from './translate';

const DICT = {
  nav: { bookDemo: 'Book a Demo', links: { features: 'Features' } },
  hero: { title: 'Meet Talkys.' },
  arr: ['a', 'b'],
} as const;

describe('translate', () => {
  it('returns top-level string', () => {
    expect(translate(DICT, 'hero.title')).toBe('Meet Talkys.');
  });

  it('returns nested string', () => {
    expect(translate(DICT, 'nav.links.features')).toBe('Features');
  });

  it('returns the key itself for a missing path', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(translate(DICT, 'does.not.exist')).toBe('does.not.exist');
    warn.mockRestore();
  });

  it('returns array when path points to an array', () => {
    expect(translate(DICT, 'arr')).toEqual(['a', 'b']);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- src/i18n/translate.test.ts`
Expected: FAIL — `Cannot find module './translate'`.

- [ ] **Step 3: Write the implementation**

```ts
// src/i18n/translate.ts
export function translate(dict: unknown, key: string): unknown {
  const parts = key.split('.');
  let node: unknown = dict;
  for (const p of parts) {
    if (node && typeof node === 'object' && p in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[p];
    } else {
      if (import.meta.env?.DEV) {
        console.warn(`[i18n] missing translation: ${key}`);
      }
      return key;
    }
  }
  return node;
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- src/i18n/translate.test.ts`
Expected: PASS (4/4).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/translate.ts src/i18n/translate.test.ts
git commit -m "feat(i18n): add translate() dot-path lookup helper"
```

---

### Task 3: Geo-detection helper

**Files:**
- Create: `src/i18n/geo.ts`
- Create: `src/i18n/geo.test.ts`

Background:
- Endpoint: `https://api.country.is/` → `{ ip, country }` where country is an ISO 3166-1 alpha-2 code.
- Arabic-speaking allowlist (countries where Arabic is an official or co-official language): LB, SA, AE, EG, JO, KW, QA, BH, OM, IQ, SY, YE, PS, MA, DZ, TN, LY, SD, MR, DJ, SO, KM.
- Timeout: 2 seconds (don't block first paint).

- [ ] **Step 1: Write the failing test**

```ts
// src/i18n/geo.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectLocaleFromGeo, ARABIC_COUNTRIES } from './geo';

const realFetch = global.fetch;

describe('detectLocaleFromGeo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    global.fetch = realFetch;
    vi.useRealTimers();
  });

  it('returns "ar" for an Arabic-speaking country', async () => {
    global.fetch = vi.fn(async () => new Response(JSON.stringify({ country: 'LB' }), { status: 200 })) as never;
    const result = await detectLocaleFromGeo({ navigatorLanguage: 'en-US' });
    expect(result).toBe('ar');
  });

  it('returns "en" for a non-Arabic country', async () => {
    global.fetch = vi.fn(async () => new Response(JSON.stringify({ country: 'FR' }), { status: 200 })) as never;
    const result = await detectLocaleFromGeo({ navigatorLanguage: 'fr-FR' });
    expect(result).toBe('en');
  });

  it('falls back to navigator language on fetch error', async () => {
    global.fetch = vi.fn(async () => { throw new Error('network'); }) as never;
    expect(await detectLocaleFromGeo({ navigatorLanguage: 'ar-LB' })).toBe('ar');
    expect(await detectLocaleFromGeo({ navigatorLanguage: 'en-GB' })).toBe('en');
  });

  it('includes Lebanon in the Arabic country set', () => {
    expect(ARABIC_COUNTRIES.has('LB')).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- src/i18n/geo.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/i18n/geo.ts`**

```ts
import type { Locale } from './types';

export const ARABIC_COUNTRIES = new Set<string>([
  'LB', 'SA', 'AE', 'EG', 'JO', 'KW', 'QA', 'BH', 'OM',
  'IQ', 'SY', 'YE', 'PS', 'MA', 'DZ', 'TN', 'LY', 'SD',
  'MR', 'DJ', 'SO', 'KM',
]);

const GEO_ENDPOINT = 'https://api.country.is';
const TIMEOUT_MS = 2000;

interface DetectOptions {
  navigatorLanguage?: string;
  signal?: AbortSignal;
}

function localeFromNavigator(lang: string | undefined): Locale {
  if (lang && lang.toLowerCase().startsWith('ar')) return 'ar';
  return 'en';
}

export async function detectLocaleFromGeo(opts: DetectOptions = {}): Promise<Locale> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(GEO_ENDPOINT, { signal: controller.signal });
    if (!res.ok) throw new Error(`geo ${res.status}`);
    const data = (await res.json()) as { country?: string };
    const country = (data.country ?? '').toUpperCase();
    if (ARABIC_COUNTRIES.has(country)) return 'ar';
    return 'en';
  } catch {
    return localeFromNavigator(opts.navigatorLanguage);
  } finally {
    clearTimeout(timer);
  }
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- src/i18n/geo.test.ts`
Expected: PASS (4/4).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/geo.ts src/i18n/geo.test.ts
git commit -m "feat(i18n): add geo-IP locale detection with navigator fallback"
```

---

### Task 4: `LocaleContext` provider and hooks

**Files:**
- Create: `src/context/LocaleContext.tsx`

The provider:
- Reads `localStorage.getItem('locale')` synchronously and uses it as initial state if it's `'en' | 'ar'`. Otherwise initial state is `'en'` (will be overwritten async).
- On mount, if no saved locale, calls `detectLocaleFromGeo({ navigatorLanguage: navigator.language })` and updates state.
- On every `locale` change: writes to `localStorage`, sets `document.documentElement.lang` and `document.documentElement.dir`.

- [ ] **Step 1: Write the provider**

```tsx
// src/context/LocaleContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DIRECTION,
  type Direction,
  type Locale,
  LOCALES,
} from '@/i18n/types';
import { EN_TRANSLATIONS } from '@/i18n/translations/en';
import { AR_TRANSLATIONS } from '@/i18n/translations/ar';
import { translate } from '@/i18n/translate';
import { detectLocaleFromGeo } from '@/i18n/geo';

const DICTS = { en: EN_TRANSLATIONS, ar: AR_TRANSLATIONS } as const;
const STORAGE_KEY = 'locale';

function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return LOCALES.includes(saved as Locale) ? (saved as Locale) : null;
}

interface LocaleContextValue {
  locale: Locale;
  dir: Direction;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  t: <T = string>(key: string) => T;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale() ?? 'en');
  const [userPicked] = useState<boolean>(() => readStoredLocale() !== null);

  // Apply <html lang> and <html dir> on every change.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = DIRECTION[locale];
  }, [locale]);

  // First-visit geo detection only when the user hasn't picked.
  useEffect(() => {
    if (userPicked) return;
    let cancelled = false;
    detectLocaleFromGeo({ navigatorLanguage: navigator.language })
      .then((detected) => {
        if (!cancelled) setLocaleState(detected);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userPicked]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore quota/private-mode failures
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  }, [locale, setLocale]);

  const t = useCallback(
    <T = string,>(key: string): T => translate(DICTS[locale], key) as T,
    [locale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir: DIRECTION[locale], setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}

export function useT() {
  return useLocale().t;
}
```

- [ ] **Step 2: Wire the provider in `src/main.tsx`**

Replace the existing file content with:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LocaleProvider } from './context/LocaleContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
);
```

- [ ] **Step 3: Sanity-check the build compiles**

Run: `npm run build`
Expected: Build succeeds. Vite emits the dist bundle.

- [ ] **Step 4: Commit**

```bash
git add src/context/LocaleContext.tsx src/main.tsx
git commit -m "feat(i18n): add LocaleProvider with persisted locale and geo bootstrap"
```

---

### Task 5: `LanguageSwitcher` component

**Files:**
- Create: `src/components/LanguageSwitcher.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/LanguageSwitcher.tsx
import { useLocale, useT } from '@/context/LocaleContext';

export function LanguageSwitcher() {
  const { locale, toggleLocale } = useLocale();
  const t = useT();
  const isAr = locale === 'ar';

  return (
    <button
      onClick={toggleLocale}
      aria-label={t('nav.languageSwitch')}
      className="
        w-10 h-10 rounded-full
        bg-black/[0.05] dark:bg-white/[0.06]
        border border-black/[0.06] dark:border-white/[0.06]
        flex items-center justify-center
        hover:bg-black/[0.08] dark:hover:bg-white/[0.1]
        transition-colors
        text-xs font-semibold text-foreground/70
      "
    >
      <span aria-hidden="true">{isAr ? 'EN' : 'AR'}</span>
    </button>
  );
}
```

The label shows the *other* language, i.e. the language the user can switch to.

- [ ] **Step 2: Commit**

```bash
git add src/components/LanguageSwitcher.tsx
git commit -m "feat(i18n): add EN/AR language switcher button"
```

---

### Task 6: Translate `Navigation`

**Files:**
- Modify: `src/sections/Navigation.tsx`

- [ ] **Step 1: Edit the file**

Replace the navLinks block, the brand text, and the buttons so they read from `t()`. Add the language switcher. Replace `import { useTheme }` line block at the top:

```tsx
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useT } from '@/context/LocaleContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
```

Inside the component, replace the navLinks array:

```tsx
const t = useT();

const navLinks = [
  { label: t('nav.links.howItWorks') as string, href: '#how-it-works' },
  { label: t('nav.links.features') as string, href: '#features' },
  { label: t('nav.links.industries') as string, href: '#industries' },
  { label: t('nav.links.integrations') as string, href: '#integrations' },
  { label: t('nav.links.getStarted') as string, href: '#get-started' },
];
```

Replace `aria-label="Toggle theme"` with:

```tsx
aria-label={t('nav.toggleTheme') as string}
```

Replace `Book a Demo` (both occurrences — desktop and mobile menu) with:

```tsx
{t('nav.bookDemo') as string}
```

Insert `<LanguageSwitcher />` into the desktop CTAs container immediately before the Theme toggle button, and into the mobile CTAs container immediately before the theme toggle button.

The brand text "Talkys" stays as-is (proper noun).

- [ ] **Step 2: Run the dev server and verify in browser**

Run: `npm run dev`
Open the site. Confirm:
- Default language matches your IP geo. If you're in LB, the nav reads Arabic; otherwise English.
- Clicking EN/AR switches both directions.
- `<html lang>` and `<html dir>` update in DevTools.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Navigation.tsx
git commit -m "feat(i18n): translate Navigation and add language switcher"
```

---

### Task 7: Translate `HeroSection`

**Files:**
- Modify: `src/sections/HeroSection.tsx`

- [ ] **Step 1: Edit the file**

Add the hook import:

```tsx
import { useT } from '@/context/LocaleContext';
```

Inside the component (above the `useEffect`):

```tsx
const t = useT();
```

Replace these literal strings with their `t()` calls:

| Was | Becomes |
| --- | --- |
| `Now Live in Lebanon` | `{t('hero.badge') as string}` |
| `Meet Talkys.` | `{t('hero.title') as string}` |
| `Talkys gives you a team of AI voice agents that take orders…` | `{t('hero.subtitle') as string}` |
| `Book a Free Demo` | `{t('hero.ctaPrimary') as string}` |
| `See How It Works` | `{t('hero.ctaSecondary') as string}` |

Replace the inline `<ArrowRight className="w-4 h-4 ..." />` next to the primary CTA with one that mirrors in RTL:

```tsx
<ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 rtl:rotate-180" />
```

- [ ] **Step 2: Visually verify**

`npm run dev`. Confirm the hero swaps fully between EN and AR, the badge updates, and the primary-CTA arrow flips direction under Arabic.

- [ ] **Step 3: Commit**

```bash
git add src/sections/HeroSection.tsx
git commit -m "feat(i18n): translate HeroSection with RTL-aware CTA arrow"
```

---

### Task 8: Translate `ProblemSection`

**Files:**
- Modify: `src/sections/ProblemSection.tsx`

- [ ] **Step 1: Edit the file**

Add the import:

```tsx
import { useT } from '@/context/LocaleContext';
```

Inside the component:

```tsx
const t = useT();

interface ProblemCopy {
  title: string;
  description: string;
  statLabel: string;
}
const problemCopy = t<ProblemCopy[]>('problem.items');
```

Replace the local `problems` array so the copy fields come from `problemCopy[i]`:

```tsx
const problems = [
  { icon: PhoneOff,    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=600&q=80', stat: { value: 62, suffix: '%' } },
  { icon: Users,       image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80', stat: { value: 3, suffix: 'x' } },
  { icon: RefreshCw,   image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80', stat: { value: 23, suffix: '%' } },
  { icon: TrendingUp,  image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80', stat: { value: 1500, suffix: '$' } },
].map((p, i) => ({ ...p, ...problemCopy[i] }));
```

Replace the `<h2>` content with the split title:

```tsx
<h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
  {t('problem.titlePrefix') as string}{' '}
  <span className="text-[#E07A5F]">{t('problem.titleHighlight') as string}</span>{' '}
  {t('problem.titleSuffix') as string}
</h2>
```

Replace the `<p>` subtitle with `{t('problem.subtitle') as string}`.

Inside the card map, `problem.title` and `problem.description` remain — but now they originate from translations. The stat-label `<p>` text becomes `{problem.statLabel}` (already the case once you applied the map merge above).

- [ ] **Step 2: Visually verify**

`npm run dev`. Switch between EN and AR. Verify the 4 cards translate and the animated counters still work.

- [ ] **Step 3: Commit**

```bash
git add src/sections/ProblemSection.tsx
git commit -m "feat(i18n): translate ProblemSection title and 4 problem cards"
```

---

### Task 9: Translate `SolutionSection`

**Files:**
- Modify: `src/sections/SolutionSection.tsx`

- [ ] **Step 1: Edit the file**

Add the import + hook:

```tsx
import { useT } from '@/context/LocaleContext';
// inside component:
const t = useT();

const featuresCopy = t<string[]>('solution.features');
const agentsCopy = t<{ name: string; role: string; message: string }[]>('solution.agents');
```

Rebuild the local `features` and `agents` arrays from the copy:

```tsx
const features = [
  { icon: PhoneCall,      text: featuresCopy[0] },
  { icon: ShoppingCart,   text: featuresCopy[1] },
  { icon: MessageSquare,  text: featuresCopy[2] },
  { icon: Database,       text: featuresCopy[3] },
];

const agents = [
  { color: 'from-purple-500 to-purple-600', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', ...agentsCopy[0] },
  { color: 'from-[#0F4C5C] to-[#1A8FA8]',   avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', ...agentsCopy[1] },
  { color: 'from-blue-500 to-blue-600',     avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', ...agentsCopy[2] },
];
```

Replace the literal `<h2>` with:

```tsx
<h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
  {t('solution.titleLine1') as string}
  <br />
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8]">
    {t('solution.titleLine2') as string}
  </span>
</h2>
```

Replace the literal paragraph with `{t('solution.paragraph') as string}`.

Replace `"Powering businesses across Lebanon"` with `{t('solution.teamCaption') as string}`.

Replace `"From Beirut to Tripoli"` with `{t('solution.teamSubcaption') as string}`.

Replace `"Meet Your AI Team"` with `{t('solution.meetTeam') as string}`.

Replace the two literal strings `"Speaking"` and `"Standby"` with `{t('solution.speaking') as string}` and `{t('solution.standby') as string}`.

Replace the literal "is saying:" line with `{`${agents[activeAgent].name} ${t('solution.isSaying')}`}`.

- [ ] **Step 2: Visually verify**

`npm run dev`. Switch languages, cycle through agents, confirm everything translates.

- [ ] **Step 3: Commit**

```bash
git add src/sections/SolutionSection.tsx
git commit -m "feat(i18n): translate SolutionSection features and agent cards"
```

---

### Task 10: Translate `HowItWorksSection`

**Files:**
- Modify: `src/sections/HowItWorksSection.tsx`

- [ ] **Step 1: Edit the file**

Add the hook:

```tsx
import { useT } from '@/context/LocaleContext';
// inside:
const t = useT();
const stepsCopy = t<{ title: string; description: string; detail: string }[]>('howItWorks.steps');
const integrationsCopy = t<string[]>('howItWorks.integrations');
```

Replace the local `steps` array so the copy fields come from `stepsCopy[i]`:

```tsx
const steps = [
  { icon: Phone,        number: '01', image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=600&q=80', ...stepsCopy[0] },
  { icon: MessageCircle,number: '02', image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80', ...stepsCopy[1] },
  { icon: ShoppingCart, number: '03', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80', ...stepsCopy[2] },
  { icon: Send,         number: '04', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=600&q=80', ...stepsCopy[3] },
  { icon: BarChart3,    number: '05', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', ...stepsCopy[4] },
];
```

Replace the `<h2>`:

```tsx
<h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
  {t('howItWorks.titlePrefix') as string} <span className="text-[#1A8FA8]">{t('howItWorks.titleHighlight') as string}</span>
</h2>
```

Replace the subtitle with `{t('howItWorks.subtitle') as string}`.

Replace the literal `STEP {steps[activeStep].number}` with:

```tsx
<span className="text-[#1A8FA8] font-heading font-bold text-sm">{t('howItWorks.stepLabel') as string} {steps[activeStep].number}</span>
```

Replace the integrations map source:

```tsx
{integrationsCopy.map((integration, index) => (
  <div key={index} className="...">{integration}</div>
))}
```

- [ ] **Step 2: Visually verify**

`npm run dev`. Click between steps, switch languages, confirm everything updates and the auto-cycle keeps working.

- [ ] **Step 3: Commit**

```bash
git add src/sections/HowItWorksSection.tsx
git commit -m "feat(i18n): translate HowItWorksSection steps and integrations"
```

---

### Task 11: Translate `FeaturesSection`

**Files:**
- Modify: `src/sections/FeaturesSection.tsx`

- [ ] **Step 1: Edit the file**

Add the hook:

```tsx
import { useT } from '@/context/LocaleContext';
// inside:
const t = useT();
const itemsCopy = t<{ title: string; desc: string }[]>('features.items');
const dashboardStats = t<{ value: string; label: string }[]>('features.dashboard.stats');
```

Rebuild `features` array. Keep the icon and the highlight flag locally:

```tsx
const features = [
  { icon: Mic,            highlight: true,  ...itemsCopy[0] },
  { icon: BookOpen,       highlight: false, ...itemsCopy[1] },
  { icon: Phone,          highlight: false, ...itemsCopy[2] },
  { icon: ArrowRightLeft, highlight: false, ...itemsCopy[3] },
  { icon: BarChart3,      highlight: true,  ...itemsCopy[4] },
  { icon: MessageSquare,  highlight: false, ...itemsCopy[5] },
  { icon: Users,          highlight: false, ...itemsCopy[6] },
  { icon: Shield,         highlight: false, ...itemsCopy[7] },
  { icon: Zap,            highlight: true,  ...itemsCopy[8] },
];
```

Replace the `<h2>` and subtitle, and the dashboard caption block.

`<h2>`:

```tsx
<h2 className="...">
  {t('features.titlePrefix') as string} <span className="text-[#1A8FA8]">{t('features.titleHighlight') as string}</span>
</h2>
```

Subtitle: `{t('features.subtitle') as string}`.

Dashboard block:

```tsx
<p className="text-[#1A8FA8] text-sm font-medium">{t('features.dashboard.eyebrow') as string}</p>
<p className="text-foreground font-heading font-bold text-2xl mt-1">{t('features.dashboard.title') as string}</p>
<p className="text-foreground/40 text-sm mt-1">{t('features.dashboard.subtitle') as string}</p>
```

Replace the inline three stat blocks with a map:

```tsx
<div className="hidden lg:flex items-center gap-6">
  {dashboardStats.map((s, i) => (
    <div key={i} className="text-center">
      <p className="text-foreground font-heading font-bold text-2xl">{s.value}</p>
      <p className="text-foreground/30 text-xs">{s.label}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Visually verify**

`npm run dev`. Confirm all 9 cards + dashboard stats translate.

- [ ] **Step 3: Commit**

```bash
git add src/sections/FeaturesSection.tsx
git commit -m "feat(i18n): translate FeaturesSection cards and dashboard preview"
```

---

### Task 12: Translate `SocialMediaSection`

**Files:**
- Modify: `src/sections/SocialMediaSection.tsx`

- [ ] **Step 1: Edit the file**

Add the hook:

```tsx
import { useT } from '@/context/LocaleContext';
// inside:
const t = useT();
```

Replace the `<h2>` with:

```tsx
<h2 className="...">
  {t('social.titlePrefix') as string}{' '}
  <span className="text-[#E07A5F]">{t('social.titleHighlight') as string}</span>
</h2>
```

Subtitle: `{t('social.subtitle') as string}`.

Phone frame label: `{t('social.phoneFrame') as string}`.

Account header strings: `{t('social.handle') as string}` and `{t('social.handleSub') as string}`.

Active badge: `{t('social.activeBadge') as string}`.

Replace each of the five chat-step messages with their `t('social.messages.…') as string` equivalents. Replace the integration-section header, subtitle, open-API note, and "Talk to us" button text.

The `integrations` array stays as-is (logo letters + product names — they're proper nouns; keep them).

- [ ] **Step 2: Visually verify**

`npm run dev`. Scroll into view and watch the chat animation play out under both languages.

- [ ] **Step 3: Commit**

```bash
git add src/sections/SocialMediaSection.tsx
git commit -m "feat(i18n): translate SocialMediaSection chat preview and integration block"
```

---

### Task 13: Translate `IndustriesSection`

**Files:**
- Modify: `src/sections/IndustriesSection.tsx`

- [ ] **Step 1: Edit the file**

Add hook:

```tsx
import { useT } from '@/context/LocaleContext';
// inside:
const t = useT();
interface IndustryCopy {
  shortTitle: string;
  title: string;
  description: string;
  role: string;
  flow: string[];
  quote: string;
  capabilities: string[];
}
const industryCopy = t<IndustryCopy[]>('industries.items');
```

Rebuild the local `industries` array merging icons/images with copy:

```tsx
const industries = [
  { icon: Utensils,    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', ...industryCopy[0] },
  { icon: Stethoscope, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80', ...industryCopy[1] },
  { icon: ShoppingBag, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', ...industryCopy[2] },
  { icon: Home,        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80', ...industryCopy[3] },
  { icon: Scissors,    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80', ...industryCopy[4] },
  { icon: Truck,       image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', ...industryCopy[5] },
  { icon: Package,     image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80', ...industryCopy[6] },
  { icon: Ship,        image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?auto=format&fit=crop&w=800&q=80', ...industryCopy[7] },
];
```

Replace `<h2>` and subtitle:

```tsx
<h2 className="...">
  {t('industries.titlePrefix') as string} <span className="text-[#1A8FA8]">{t('industries.titleHighlight') as string}</span>
</h2>
<p className="...">
  {t('industries.subtitle') as string}
</p>
```

Replace the speaking label: `<p className="text-xs text-[#1A8FA8] font-medium">{t('industries.speakingLabel') as string}</p>`.

The map renders `industry.shortTitle` for tabs and `active.title`, `active.description`, `active.role`, `active.flow`, `active.quote`, `active.capabilities` — all already pulled from translated copy.

- [ ] **Step 2: Visually verify**

`npm run dev`. Click each of the 8 industry tabs in both languages. Confirm the role badge, flow steps, capabilities, and quote all translate.

- [ ] **Step 3: Commit**

```bash
git add src/sections/IndustriesSection.tsx
git commit -m "feat(i18n): translate IndustriesSection with 8 fully bilingual tabs"
```

---

### Task 14: Translate `GettingStartedSection`

**Files:**
- Modify: `src/sections/GettingStartedSection.tsx`

- [ ] **Step 1: Edit the file**

Add the hook:

```tsx
import { useT } from '@/context/LocaleContext';
// inside:
const t = useT();
const expectations = t<string[]>('getStarted.expectations');
const expectationIcons = [Headphones, Settings, Monitor, Sparkles];
const trustStats = t<{ value: string; label: string }[]>('getStarted.stats');
const industryOptions = t<Record<string, string>>('getStarted.form.industryOptions');
```

Replace `handleSubmit`:

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  alert(t('getStarted.form.successMessage') as string);
};
```

Replace `<h2>`:

```tsx
<h2 className="...">
  {t('getStarted.titlePrefix') as string}{' '}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8]">
    {t('getStarted.titleHighlight') as string}
  </span>
</h2>
```

Paragraph: `{t('getStarted.paragraph') as string}`.

Replace the local `expectations` array literal entirely — instead, map the translated copy with the icons array:

```tsx
<div className="grid grid-cols-2 gap-3">
  {expectations.map((text, index) => {
    const Icon = expectationIcons[index];
    return (
      <div key={index} className="card-dark p-4 group" style={{ animationDelay: `${index * 100}ms` }}>
        <Icon className="w-5 h-5 text-[#1A8FA8] mb-2 group-hover:scale-110 transition-transform duration-300" />
        <p className="text-foreground/60 text-sm">{text}</p>
      </div>
    );
  })}
</div>
```

Replace the trust-stats hardcoded array with `trustStats.map(...)`.

Replace every form label/placeholder with its translation:
- `Full Name *` → `{t('getStarted.form.fullName') as string}`
- `John Doe` placeholder → `{t('getStarted.form.fullNamePlaceholder') as string}`
- `Work Email *` → `{t('getStarted.form.email') as string}`
- `john@company.com` → `{t('getStarted.form.emailPlaceholder') as string}`
- `Company Name` → `{t('getStarted.form.company') as string}`
- `Your Company` → `{t('getStarted.form.companyPlaceholder') as string}`
- `Industry` label → `{t('getStarted.form.industry') as string}`
- `Select industry` option → `{t('getStarted.form.industrySelect') as string}`
- The 8 industry options → render via `Object.entries(industryOptions).map(([value, label]) => <option key={value} value={value} className="bg-background">{label}</option>)`. Drop the literal options array.
- `Phone Number` → `{t('getStarted.form.phone') as string}`
- `+961 XX XXX XXX` placeholder → `{t('getStarted.form.phonePlaceholder') as string}`
- `Tell us about your use case` → `{t('getStarted.form.useCase') as string}`
- `What would you like Talkys to handle?` placeholder → `{t('getStarted.form.useCasePlaceholder') as string}`
- Consent text → `{t('getStarted.form.consent') as string}`
- Submit button text → `{t('getStarted.form.submit') as string}`

Add `rtl:rotate-180` to the submit button's `ArrowRight`.

Above the `whatToExpect` heading: replace `What to Expect` with `{t('getStarted.whatToExpect') as string}`.

- [ ] **Step 2: Visually verify**

`npm run dev`. Submit the form (cancel the alert). Make sure every form field has the right label in both languages and that the select's options translate.

- [ ] **Step 3: Commit**

```bash
git add src/sections/GettingStartedSection.tsx
git commit -m "feat(i18n): translate GettingStartedSection form and expectations"
```

---

### Task 15: Translate `FooterSection`

**Files:**
- Modify: `src/sections/FooterSection.tsx`

- [ ] **Step 1: Edit the file**

Add the hook + locale (for footer links categories):

```tsx
import { useT } from '@/context/LocaleContext';
// inside:
const t = useT();
const categories = t<{ Product: string; Company: string; Legal: string }>('footer.categories');
const links = t<{ Product: string[]; Company: string[]; Legal: string[] }>('footer.links');
```

Replace the local `footerLinks` literal with derived shape:

```tsx
const footerEntries: [keyof typeof categories, string[]][] = [
  ['Product', links.Product],
  ['Company', links.Company],
  ['Legal', links.Legal],
];
```

Replace the existing `Object.entries(footerLinks).map(...)` block:

```tsx
{footerEntries.map(([key, items]) => (
  <div key={key}>
    <h4 className="font-heading font-semibold text-foreground text-sm mb-4">{categories[key]}</h4>
    <ul className="space-y-2.5">
      {items.map((link) => (
        <li key={link}>
          <a href="#" className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
))}
```

Replace the description paragraph with `{t('footer.description') as string}` and the regions line with `{t('footer.regions') as string}`. Replace the copyright with `{t('footer.copyright') as string}`.

- [ ] **Step 2: Visually verify**

`npm run dev`. Scroll to footer. Switch languages, verify everything translates.

- [ ] **Step 3: Commit**

```bash
git add src/sections/FooterSection.tsx
git commit -m "feat(i18n): translate FooterSection links and copyright"
```

---

### Task 16: Translate the `Console` (tabs, active call, metrics)

**Files:**
- Modify: `src/components/Console/index.tsx`
- Modify: `src/components/Console/ConsoleTabs.tsx`
- Modify: `src/components/Console/MetricStrip.tsx`

(ActiveCall is the bigger change — handled separately in Task 17.)

- [ ] **Step 1: Edit `src/components/Console/index.tsx`**

```tsx
import { useT } from '@/context/LocaleContext';
// inside Console():
const t = useT();
```

Replace the literal `Talkys Console` label with `{t('console.label') as string}` and the literal `Live` text with `{t('console.live') as string}`.

- [ ] **Step 2: Edit `src/components/Console/ConsoleTabs.tsx`**

Use the active locale to pick the label from `INDUSTRIES`:

```tsx
import * as Tabs from '@radix-ui/react-tabs';
import { INDUSTRIES, type IndustryId } from '@/data/industries';
import { useLocale } from '@/context/LocaleContext';

interface ConsoleTabsProps {
  active: IndustryId;
  onChange: (id: IndustryId) => void;
}

export function ConsoleTabs({ active, onChange }: ConsoleTabsProps) {
  const { locale } = useLocale();
  return (
    <Tabs.Root value={active} onValueChange={(v) => onChange(v as IndustryId)}>
      <Tabs.List aria-label="Industry" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {INDUSTRIES.map((ind) => (
          <Tabs.Trigger
            key={ind.id}
            value={ind.id}
            className={`...same classes as before...`}
          >
            <span className="text-base" aria-hidden="true">{ind.icon}</span>
            <span>{ind.label[locale]}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
```

Keep the existing class string verbatim (don't drop the focus/active styles).

- [ ] **Step 3: Edit `src/components/Console/MetricStrip.tsx`**

```tsx
import { Star } from 'lucide-react';
import { useT, useLocale } from '@/context/LocaleContext';

interface MetricStripProps {
  handled: number;
  missed: number;
  rating: number;
}

export function MetricStrip({ handled, missed, rating }: MetricStripProps) {
  const t = useT();
  const { locale } = useLocale();
  const fmt = (n: number) => n.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');

  return (
    <div className="rounded-lg border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-foreground/50 mb-2">
        {t('console.metrics.todaysCalls') as string}
      </p>
      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-bold text-foreground">{fmt(handled)}</span>
          <span className="text-foreground/60 text-xs">{t('console.metrics.handled') as string}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading font-bold text-foreground">{fmt(missed)}</span>
          <span className="text-foreground/60 text-xs">{t('console.metrics.missed') as string}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
          <span className="font-heading font-bold text-foreground">{rating.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Visually verify**

`npm run dev`. Confirm:
- Console header reads "Talkys Console / Live" in EN and "وحدة تحكم Talkys / مباشر" in AR.
- The four tabs show their `label[locale]` (Arabic names for AR).
- Metric numbers render Arabic numerals when locale is AR.

- [ ] **Step 5: Commit**

```bash
git add src/components/Console/index.tsx src/components/Console/ConsoleTabs.tsx src/components/Console/MetricStrip.tsx
git commit -m "feat(i18n): translate Console header, tabs, and metric strip"
```

---

### Task 17: Translate `ActiveCall` with audio/caption locale fallback

**Files:**
- Modify: `src/components/Console/ActiveCall.tsx`

Why this is separate: the file picks audio + caption URLs by locale, and Arabic asset files don't yet exist on disk. We need an English fallback when an Arabic asset fails to load, so the user still hears a demo.

- [ ] **Step 1: Replace the file**

Replace the entire body of `ActiveCall.tsx` with:

```tsx
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Phone } from 'lucide-react';
import type { IndustryConfig } from '@/data/industries';
import { parseVtt, type CaptionCue } from '@/utils/captions';
import { getVisibleCues } from '@/utils/typewriter';
import { useT, useLocale } from '@/context/LocaleContext';

interface ActiveCallProps {
  industry: IndustryConfig;
}

export function ActiveCall({ industry }: ActiveCallProps) {
  const t = useT();
  const { locale } = useLocale();
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const [cues, setCues] = useState<CaptionCue[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Pick caption + audio for the active locale; fall back to English on fetch failure.
  const captionsPrimary = industry.demoCall.captions[locale];
  const captionsFallback = industry.demoCall.captions.en;
  const audioPrimary = industry.demoCall.audio[locale];
  const audioFallback = industry.demoCall.audio.en;
  const [audioSrc, setAudioSrc] = useState<string>(audioPrimary);

  // Reset audio source on locale/industry change.
  useEffect(() => {
    setAudioSrc(audioPrimary);
  }, [audioPrimary]);

  // Fetch VTT with fallback.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        let res = await fetch(captionsPrimary);
        if (!res.ok) throw new Error(`captions ${res.status}`);
        const txt = await res.text();
        if (!cancelled) setCues(parseVtt(txt));
      } catch {
        try {
          const res = await fetch(captionsFallback);
          if (!res.ok) return;
          const txt = await res.text();
          if (!cancelled) setCues(parseVtt(txt));
        } catch {
          // give up silently
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [captionsPrimary, captionsFallback]);

  useEffect(() => {
    if (!isPlaying) return;
    const tick = () => {
      const t2 = audioRef.current?.currentTime ?? 0;
      setCurrentTime(t2);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  };

  const visible = getVisibleCues(cues, currentTime);
  const progress = industry.demoCall.duration > 0
    ? Math.min(100, (currentTime / industry.demoCall.duration) * 100)
    : 0;

  const handleAudioError = () => {
    setIsPlaying(false);
    if (audioSrc !== audioFallback) setAudioSrc(audioFallback);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-foreground/60">
        <Phone className="w-3.5 h-3.5" />
        <span className="font-medium text-foreground/80">
          {isPlaying ? (t('console.liveTag') as string) : (t('console.sampleCall') as string)}
        </span>
        <span>·</span>
        <span>{industry.demoCall.caller}</span>
      </div>

      <div className="min-h-[120px] max-h-[160px] overflow-y-auto rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3 space-y-2">
        {visible.length === 0 ? (
          <p className="text-sm text-foreground/40 italic">
            {t('console.transcriptPrompt') as string}
          </p>
        ) : (
          <>
            <div aria-live="polite" className="space-y-2">
              {visible
                .filter(({ cue, visibleText }) => visibleText.length === cue.text.length)
                .map(({ cue, visibleText }, idx) => (
                  <p key={`${cue.startTime}-${idx}`} className="text-sm text-foreground/85">
                    {cue.speaker && (
                      <span className="font-semibold text-[#1A8FA8]">{cue.speaker}: </span>
                    )}
                    {visibleText}
                  </p>
                ))}
            </div>
            {visible.length > 0 && (() => {
              const last = visible[visible.length - 1];
              if (last.visibleText.length === last.cue.text.length) return null;
              return (
                <p aria-hidden="true" className="text-sm text-foreground/85">
                  {last.cue.speaker && (
                    <span className="font-semibold text-[#1A8FA8]">{last.cue.speaker}: </span>
                  )}
                  {last.visibleText}
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 align-text-bottom bg-foreground/70 animate-pulse" />
                </p>
              );
            })()}
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#0F4C5C] hover:bg-[#1A8FA8] text-white flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A8FA8] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={isPlaying ? (t('console.pauseAria') as string) : (t('console.playAria') as string)}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ms-0.5 rtl:rotate-180" />}
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
        src={audioSrc}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={handleAudioError}
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

- [ ] **Step 2: Visually verify**

`npm run dev`. While in Arabic:
- "Sample Call" label reads in Arabic.
- The play button still works. Because the Arabic audio file doesn't exist, the `<audio>` `onError` fires and the source falls back to the English mp3. Audio plays.
- Captions show the English text (because the Arabic VTT also 404s). This is acceptable until those assets land. Confirm no red console errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Console/ActiveCall.tsx
git commit -m "feat(i18n): translate ActiveCall with locale audio/caption fallback"
```

---

### Task 18: RTL polish — fonts, logical spacing, icon flips

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

- [ ] **Step 1: Extend the Tailwind sans family with Arabic-friendly fallbacks**

In `tailwind.config.js`, change:

```js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  heading: ['Outfit', 'system-ui', 'sans-serif'],
},
```

to:

```js
fontFamily: {
  sans: ['Inter', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
  heading: ['Outfit', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
},
```

- [ ] **Step 2: Add an Arabic webfont import + RTL helpers in `src/index.css`**

At the top of the file, after the existing `@import` line, add the Arabic Google Font:

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');
```

In the `@layer base` block (right after the `body` rule), add:

```css
html[dir='rtl'] body {
  font-family: 'Noto Sans Arabic', 'Inter', system-ui, sans-serif;
}

html[dir='rtl'] h1,
html[dir='rtl'] h2,
html[dir='rtl'] h3,
html[dir='rtl'] h4 {
  font-family: 'Noto Sans Arabic', 'Outfit', system-ui, sans-serif;
  letter-spacing: 0; /* Outfit's -0.02em letter-spacing harms Arabic */
}
```

- [ ] **Step 3: Audit the remaining directional utility classes**

The CTA `ArrowRight` icons in `HeroSection.tsx` and `GettingStartedSection.tsx` already received `rtl:rotate-180` in earlier tasks. The other directional spots are flex containers, which Tailwind handles bidirectionally with `dir`. No further changes required at this step.

- [ ] **Step 4: Visually verify RTL pass**

`npm run dev`. Switch to Arabic:
- Body text uses Noto Sans Arabic with comfortable spacing.
- Navigation entries appear right-to-left (logo on the right, links on the left of the container).
- ArrowRight icons in the hero and demo-booking buttons point left.
- The chat preview in `SocialMediaSection` still shows customer messages on one side and agent replies on the other (Tailwind's flex handles this — the customer bubble now appears on the left in RTL, which is correct).
- All sections render without overflow.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js src/index.css
git commit -m "feat(i18n): add Arabic font stack and RTL typography rules"
```

---

### Task 19: Final test, lint, build

**Files:** none modified.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: All passing (including the existing `captions`, `typewriter`, `morphUtils`, `ribbonUtils`, `industries` tests and the new `translate`, `geo` tests).

- [ ] **Step 2: Run the linter**

Run: `npm run lint`
Expected: 0 errors.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: TypeScript compiles, Vite emits the bundle. No errors about missing translation keys (TypeScript's `Translations = typeof EN_TRANSLATIONS` enforces parity between the two dictionaries).

- [ ] **Step 4: Manual smoke test in browser**

Run `npm run dev` and open the site. With DevTools open:
1. Clear localStorage. Refresh. Confirm:
   - The geo fetch fires (Network tab → `api.country.is`).
   - Within a moment the page switches to AR if your IP is Arabic-speaking, EN otherwise.
2. Click the language switcher. Confirm:
   - The page flips locale.
   - `localStorage.locale` is set.
   - On refresh, the saved locale persists and the geo fetch does **not** fire again.
3. Open the Console (in the hero). Play a sample call in Arabic. Confirm:
   - Audio plays (falls back to EN file silently).
   - Captions render.
4. Tab through the nav. The language switcher has `aria-label` and keyboard focus styles.

- [ ] **Step 5: Final commit (only if anything fell through)**

If steps 1–4 surfaced any small fix, commit it now. Otherwise, skip.

```bash
git add -A
git commit -m "chore(i18n): final polish from manual QA"
```

---

## Notes for the implementer

- **Don't drop `localStorage.theme`.** The theme provider also writes there. Don't share keys.
- **Type widening on `t()`.** The helper is typed `<T = string>` to keep call sites tight without forcing every consumer to declare the shape. When pulling an array or object, declare the type at the call site (see Tasks 8–14).
- **Don't translate proper nouns.** "Talkys", "Omega POS", "Squirrel POS", "WhatsApp", "Instagram", "Messenger", agent names (Layla / Karim / Sara → kept in their localized form in `ar.ts`), and product brand strings stay verbatim.
- **Arabic numerals.** Only used in `MetricStrip` via `toLocaleString`. The Arabic dictionary already uses Arabic-Indic digits for stats (e.g. `٢٤/٧`) so user-facing copy is consistent.
- **`navigator.language` is the navigator fallback only.** If you're testing geo in Beirut from a browser set to English, you should still see Arabic on first load (geo wins). Inspect Network → `api.country.is` to see the response.
- **Arabic audio assets are out of scope of this plan.** When recorded, drop them into `public/audio/*-ar.mp3` and `public/captions/*-ar.vtt` and the existing fallback path in `ActiveCall` will switch over automatically without any code change.
