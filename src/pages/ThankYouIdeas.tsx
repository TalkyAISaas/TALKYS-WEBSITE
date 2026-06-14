import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Phone,
  PhoneOff,
  MessageCircle,
  Calendar,
  Play,
  Sparkles,
  Clock,
  Headphones,
  Star,
  Rocket,
  Infinity as InfinityIcon,
  Mountain,
} from 'lucide-react';
import { AccentItalic } from '@/components/AccentItalic';
import { ChipEyebrow } from '@/components/ChipEyebrow';

type Variant = {
  id: string;
  label: string;
  blurb: string;
  Component: ComponentType;
};

const CardShell = ({ children }: { children: React.ReactNode }) => (
  <div className="relative bg-white border border-black/[0.06] rounded-[28px] p-12 lg:p-16 overflow-hidden shadow-card">
    <div
      className="absolute -top-[30%] -right-[10%] w-[55%] h-[130%] pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(229,119,86,0.10) 0%, transparent 60%)' }}
    />
    <div
      className="absolute -bottom-[40%] -left-[10%] w-[55%] h-[130%] pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(14,79,92,0.07) 0%, transparent 60%)' }}
    />
    <div className="relative z-[1]">{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant A — Aria character speech bubble
// ─────────────────────────────────────────────────────────────────────────────
const AriaVariant = () => (
  <CardShell>
    <div className="flex flex-col items-center text-center py-6 min-h-[420px] justify-center">
      <div className="relative mb-8">
        <span className="absolute inset-0 rounded-full bg-accent/25 animate-ping" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent to-[#d4633f] text-white flex items-center justify-center text-2xl font-extrabold shadow-lg">
          A
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
      </div>

      <div className="relative bg-foreground text-white rounded-[22px] rounded-bl-[6px] px-6 py-5 max-w-[460px] mb-6 shadow-md">
        <p className="text-[15px] leading-[1.55] text-white/95">
          "Mar7aba! I just pinged the Talkys team — they'll reach out within{' '}
          <span className="font-semibold text-white">24 hours</span> to set up your custom demo."
        </p>
        <span className="absolute left-3 -bottom-1 w-3 h-3 bg-foreground rotate-45" />
      </div>

      <p className="text-[13px] text-muted-foreground tracking-[0.12em] uppercase">
        Aria · AI Agent · Standing by
      </p>
    </div>
  </CardShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant B — What happens next (timeline)
// ─────────────────────────────────────────────────────────────────────────────
const TimelineVariant = () => (
  <CardShell>
    <div className="text-center mb-10">
      <div className="inline-flex w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 items-center justify-center mb-5">
        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
      </div>
      <h2
        className="font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-3"
        style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
      >
        You're in. <AccentItalic>Here's what's next.</AccentItalic>
      </h2>
      <p className="text-muted-foreground text-[16px]">
        We move fast. Expect to hear from us within 24 hours.
      </p>
    </div>

    <div className="max-w-[440px] mx-auto space-y-5">
      {[
        { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', title: 'Request received', sub: 'Just now', done: true },
        { icon: Clock,         color: 'text-accent bg-accent/10 border-accent/20',          title: 'Our team reviews your use case', sub: 'Within 2 hours' },
        { icon: Calendar,      color: 'text-foreground bg-foreground/5 border-foreground/10', title: 'Demo scheduled in your inbox', sub: 'Within 24 hours' },
      ].map((step, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className={`shrink-0 w-11 h-11 rounded-full border flex items-center justify-center ${step.color}`}>
            <step.icon className="w-5 h-5" />
          </div>
          <div className="pt-1.5">
            <p className={`text-[15px] font-semibold ${step.done ? 'text-foreground' : 'text-foreground/85'}`}>
              {step.title}
            </p>
            <p className="text-[13px] text-muted-foreground mt-0.5">{step.sub}</p>
          </div>
        </div>
      ))}
    </div>
  </CardShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant C — Talk to Aria now (live teaser)
// ─────────────────────────────────────────────────────────────────────────────
const LiveTeaserVariant = () => (
  <CardShell>
    <div className="text-center mb-8">
      <ChipEyebrow>REQUEST RECEIVED</ChipEyebrow>
    </div>
    <h2
      className="text-center font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-4"
      style={{ fontSize: 'clamp(30px, 4.2vw, 44px)' }}
    >
      While you wait — <AccentItalic>talk to Aria yourself.</AccentItalic>
    </h2>
    <p className="text-center text-muted-foreground text-[16px] max-w-[480px] mx-auto mb-9">
      She's online right now. Call her, or hear a real call she handled this morning.
    </p>

    <div className="max-w-[520px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <a
        href="tel:+9611234567"
        className="group flex flex-col gap-2 p-5 rounded-[16px] bg-foreground text-white hover:-translate-y-0.5 transition-transform shadow-md"
      >
        <Phone className="w-5 h-5 text-accent" />
        <span className="text-[11px] tracking-[0.16em] uppercase text-white/55">Call Aria</span>
        <span className="text-[19px] font-extrabold tracking-[-0.02em]">+961 1 234 567</span>
      </a>
      <button
        type="button"
        className="group flex flex-col gap-2 p-5 rounded-[16px] bg-white border border-black/[0.08] text-foreground hover:-translate-y-0.5 transition-transform shadow-sm text-left"
      >
        <Headphones className="w-5 h-5 text-accent" />
        <span className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">Listen to a real call</span>
        <span className="inline-flex items-center gap-2 text-[15px] font-semibold">
          <Play className="w-4 h-4 text-accent fill-accent" />
          0:47 — Friday order rush
        </span>
      </button>
    </div>

    <div className="text-center mt-8">
      <p className="text-[13px] text-muted-foreground">
        Your demo request is on its way — we'll be in touch within 24 hours.
      </p>
    </div>
  </CardShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant D — Confetti / scribble celebration
// ─────────────────────────────────────────────────────────────────────────────
const ConfettiVariant = () => {
  const dots = Array.from({ length: 14 }, (_, i) => i);
  return (
    <CardShell>
      <div className="relative flex flex-col items-center text-center py-10 min-h-[420px] justify-center">
        {dots.map((d) => {
          const left = (d * 37) % 100;
          const top = ((d * 53) % 80) + 5;
          const size = 6 + (d % 3) * 3;
          const colors = ['bg-accent', 'bg-navy', 'bg-emerald-400', 'bg-yellow-300'];
          return (
            <span
              key={d}
              className={`absolute rounded-full ${colors[d % colors.length]} opacity-80`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                transform: `rotate(${d * 24}deg)`,
              }}
            />
          );
        })}

        <Sparkles className="w-10 h-10 text-accent mb-4" />
        <h2
          className="font-heading font-bold text-foreground tracking-[-0.025em] leading-[1]"
          style={{ fontSize: 'clamp(48px, 7vw, 84px)' }}
        >
          <AccentItalic>Thank you!</AccentItalic>
        </h2>

        <div className="relative my-5">
          <svg width="140" height="28" viewBox="0 0 140 28" fill="none" aria-hidden="true">
            <path
              d="M 4 16 C 30 8, 70 24, 100 12 S 130 6, 138 18"
              stroke="#e57756"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        <p className="text-muted-foreground text-[17px] max-w-[420px]">
          Your demo request is on its way. We'll be in touch within{' '}
          <span className="font-semibold text-foreground">24 hours</span>.
        </p>
      </div>
    </CardShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Variant E — Skip the wait (alternative channels)
// ─────────────────────────────────────────────────────────────────────────────
const SkipWaitVariant = () => (
  <CardShell>
    <div className="text-center mb-10">
      <div className="inline-flex w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 items-center justify-center mb-5">
        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
      </div>
      <h2
        className="font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-3"
        style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
      >
        Got it. <AccentItalic>Don't want to wait?</AccentItalic>
      </h2>
      <p className="text-muted-foreground text-[16px] max-w-[480px] mx-auto">
        Three ways to talk to us right now. Pick whatever's easiest.
      </p>
    </div>

    <div className="max-w-[520px] mx-auto grid grid-cols-1 gap-3">
      {[
        { Icon: MessageCircle, label: 'WhatsApp the team',  hint: 'Average reply time · 4 minutes',  cta: 'Open WhatsApp' },
        { Icon: Phone,         label: 'Call us',             hint: '+961 1 234 567 · Mon–Fri 9–6',     cta: 'Call now' },
        { Icon: Calendar,      label: 'Book a slot directly', hint: 'Pick a time that works for you',   cta: 'See calendar' },
      ].map(({ Icon, label, hint, cta }) => (
        <button
          key={label}
          type="button"
          className="flex items-center gap-4 p-4 rounded-[14px] bg-white border border-black/[0.06] hover:border-accent hover:-translate-y-0.5 transition-all shadow-sm text-left"
        >
          <div className="shrink-0 w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-foreground">{label}</p>
            <p className="text-[13px] text-muted-foreground">{hint}</p>
          </div>
          <span className="text-[13px] font-semibold text-accent inline-flex items-center gap-1">
            {cta}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </span>
        </button>
      ))}
    </div>
  </CardShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant F — Social proof
// ─────────────────────────────────────────────────────────────────────────────
const SocialProofVariant = () => (
  <CardShell>
    <div className="text-center mb-9">
      <div className="inline-flex w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 items-center justify-center mb-5">
        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
      </div>
      <h2
        className="font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-3"
        style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}
      >
        You're in <AccentItalic>good company.</AccentItalic>
      </h2>
      <p className="text-muted-foreground text-[16px] max-w-[480px] mx-auto">
        Over 200 businesses across Lebanon are already letting Talkys answer the phone.
      </p>
    </div>

    <div className="max-w-[520px] mx-auto bg-background border border-black/[0.06] rounded-[18px] p-6 mb-7">
      <div className="flex gap-1 mb-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
        ))}
      </div>
      <p className="text-[15px] text-foreground leading-[1.6] mb-4">
        "Talkys took over our delivery line in two days. We stopped losing weekend orders the same week."
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold">R</div>
        <div>
          <p className="text-[13px] font-semibold text-foreground">Rana K.</p>
          <p className="text-[12px] text-muted-foreground">Operations · Bright Smile Dental</p>
        </div>
      </div>
    </div>

    <div className="flex gap-8 justify-center items-center flex-wrap opacity-50">
      {['BrightSmile', 'NextClinic', 'OakLaw', 'Nexter'].map((logo) => (
        <span key={logo} className="text-[15px] font-bold tracking-[-0.02em] text-foreground">
          {logo}
        </span>
      ))}
    </div>

    <p className="text-center text-[13px] text-muted-foreground mt-7">
      Your demo request is on its way — we'll be in touch within 24 hours.
    </p>
  </CardShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant G — On the doorstep of something big (staircase / threshold)
// ─────────────────────────────────────────────────────────────────────────────
const DoorstepVariant = () => (
  <CardShell>
    <div className="text-center mb-9">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-[11px] font-bold tracking-[0.18em] uppercase mb-5">
        <Mountain className="w-3.5 h-3.5" />
        Step 1 of something big
      </div>
      <h2
        className="font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-4 max-w-[640px] mx-auto"
        style={{ fontSize: 'clamp(32px, 4.6vw, 52px)' }}
      >
        You're at the <AccentItalic>doorstep</AccentItalic> of something big.
      </h2>
      <p className="text-muted-foreground text-[17px] max-w-[480px] mx-auto">
        You just joined the businesses rewriting how Lebanon answers the phone.
        We'll be in touch within 24 hours.
      </p>
    </div>

    <div className="max-w-[460px] mx-auto flex items-end gap-2 h-[120px]" aria-hidden="true">
      {[18, 32, 50, 72, 100].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          {i === 4 && (
            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_0_4px_rgba(229,119,86,0.18)] mb-1" />
          )}
          <div
            className={`w-full rounded-t-[6px] transition-all ${
              i === 4 ? 'bg-accent' : 'bg-foreground/12'
            }`}
            style={{ height: `${h}%` }}
          />
        </div>
      ))}
    </div>
    <p className="text-center text-[12px] tracking-[0.16em] uppercase text-muted-foreground mt-3">
      You · Demo · Onboarding · Live · Scale
    </p>
  </CardShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant H — The clock starts now (live countdown)
// ─────────────────────────────────────────────────────────────────────────────
const CountdownVariant = () => {
  const target = useRef<number>(Date.now() + 24 * 60 * 60 * 1000);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, target.current - now);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <CardShell>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-emerald-600 mb-5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          The clock is running
        </div>
        <h2
          className="font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-4 max-w-[640px] mx-auto"
          style={{ fontSize: 'clamp(30px, 4.4vw, 48px)' }}
        >
          You're <AccentItalic>hours away</AccentItalic> from a quieter phone.
        </h2>
        <p className="text-muted-foreground text-[16px] max-w-[500px] mx-auto">
          By the time this counter hits zero, you'll be talking to your AI receptionist.
        </p>
      </div>

      <div className="max-w-[460px] mx-auto grid grid-cols-3 gap-3">
        {[
          { v: pad(hours),   l: 'Hours' },
          { v: pad(minutes), l: 'Minutes' },
          { v: pad(seconds), l: 'Seconds' },
        ].map(({ v, l }) => (
          <div key={l} className="bg-foreground text-white rounded-[14px] py-5 text-center">
            <div className="text-[42px] font-extrabold tracking-[-0.04em] tabular-nums leading-none">
              {v}
            </div>
            <div className="text-[10.5px] tracking-[0.18em] uppercase text-white/55 mt-2">{l}</div>
          </div>
        ))}
      </div>
    </CardShell>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Variant I — Today is your last missed call (pain-point reversal)
// ─────────────────────────────────────────────────────────────────────────────
const LastMissedCallVariant = () => (
  <CardShell>
    <div className="text-center mb-8">
      <h2
        className="font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-4 max-w-[640px] mx-auto"
        style={{ fontSize: 'clamp(30px, 4.4vw, 50px)' }}
      >
        Today might be your <AccentItalic>last missed call.</AccentItalic>
      </h2>
      <p className="text-muted-foreground text-[16px] max-w-[480px] mx-auto">
        Within 24 hours, Aria will start picking up every ring — even at 2am on a Friday.
      </p>
    </div>

    <div className="max-w-[440px] mx-auto space-y-3">
      <div className="flex items-center gap-3.5 p-4 rounded-[14px] bg-red-50/70 border border-red-100/80">
        <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <PhoneOff className="w-5 h-5" />
        </div>
        <div className="flex-1 line-through decoration-red-400/70 decoration-[1.5px]">
          <p className="text-[14px] font-semibold text-foreground/70">Missed call · Unknown number</p>
          <p className="text-[12px] text-muted-foreground">Friday · 11:47 PM</p>
        </div>
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-red-500">Yesterday</span>
      </div>

      <div className="flex items-center gap-3.5 p-4 rounded-[14px] bg-emerald-50/70 border border-emerald-100">
        <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
          <Phone className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-foreground">Aria · Order taken & confirmed</p>
          <p className="text-[12px] text-muted-foreground">Friday · 11:47 PM · From tomorrow</p>
        </div>
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-emerald-600">Tomorrow</span>
      </div>
    </div>

    <p className="text-center text-[13px] text-muted-foreground mt-7">
      Demo on its way — within 24 hours.
    </p>
  </CardShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant J — You just hired your first AI employee (reframe)
// ─────────────────────────────────────────────────────────────────────────────
const HiredVariant = () => (
  <CardShell>
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold tracking-[0.16em] uppercase mb-5">
        <Sparkles className="w-3.5 h-3.5" />
        Welcome aboard
      </div>
      <h2
        className="font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-4 max-w-[640px] mx-auto"
        style={{ fontSize: 'clamp(30px, 4.4vw, 50px)' }}
      >
        You just hired your <AccentItalic>first AI employee.</AccentItalic>
      </h2>
      <p className="text-muted-foreground text-[16px] max-w-[480px] mx-auto">
        Aria is being onboarded to your business. We'll have her live within 24 hours.
      </p>
    </div>

    <div className="max-w-[440px] mx-auto bg-background border border-black/[0.06] rounded-[18px] p-6">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-[#d4633f] text-white flex items-center justify-center text-xl font-extrabold">
          A
        </div>
        <div>
          <p className="text-[16px] font-bold text-foreground">Aria</p>
          <p className="text-[13px] text-muted-foreground">AI Receptionist · Hired today</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.14em] uppercase text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Hours', value: '24/7' },
          { label: 'Languages', value: 'AR · EN' },
          { label: 'Capacity', value: <InfinityIcon className="w-5 h-5 inline-block" /> },
        ].map((s, i) => (
          <div key={i} className="text-center bg-white border border-black/[0.05] rounded-[10px] py-2.5">
            <div className="text-[14px] font-bold text-foreground">{s.value}</div>
            <div className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 text-[12.5px] text-muted-foreground">
        <p>✓ Sick days: <span className="text-foreground font-semibold">0</span></p>
        <p>✓ Salary: <span className="text-foreground font-semibold">$0.02/min</span></p>
        <p>✓ Started: <span className="text-foreground font-semibold">The moment you hit submit</span></p>
      </div>
    </div>
  </CardShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant K — The future answered (minimal, poetic)
// ─────────────────────────────────────────────────────────────────────────────
const FutureAnsweredVariant = () => (
  <CardShell>
    <div className="flex flex-col items-center text-center py-20 min-h-[440px] justify-center">
      <div className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-8">
        — Request received —
      </div>
      <h2
        className="font-heading font-bold text-foreground tracking-[-0.035em] leading-[0.95]"
        style={{ fontSize: 'clamp(56px, 9vw, 120px)' }}
      >
        The future <AccentItalic>answered.</AccentItalic>
      </h2>
      <div className="w-12 h-px bg-foreground/20 my-10" />
      <p className="text-muted-foreground text-[15px] max-w-[360px]">
        Aria is ready when you are. Your demo lands in your inbox within 24 hours.
      </p>
    </div>
  </CardShell>
);

// ─────────────────────────────────────────────────────────────────────────────
// Variant L — From here, you don't go back (one-way arrow)
// ─────────────────────────────────────────────────────────────────────────────
const OneWayVariant = () => (
  <CardShell>
    <div className="text-center mb-9">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-white text-[11px] font-bold tracking-[0.18em] uppercase mb-5">
        <Rocket className="w-3.5 h-3.5" />
        You're off
      </div>
      <h2
        className="font-heading font-bold text-foreground tracking-[-0.025em] leading-[1.05] mb-4 max-w-[640px] mx-auto"
        style={{ fontSize: 'clamp(32px, 4.6vw, 54px)' }}
      >
        From here, <AccentItalic>you don't go back.</AccentItalic>
      </h2>
      <p className="text-muted-foreground text-[16px] max-w-[500px] mx-auto">
        Once Aria answers, you'll wonder how you ever ran your phones without her.
        Demo on its way — within 24 hours.
      </p>
    </div>

    <div className="max-w-[480px] mx-auto grid grid-cols-2 gap-3">
      <div className="p-5 rounded-[14px] bg-background border border-black/[0.06] text-left">
        <p className="text-[10.5px] tracking-[0.16em] uppercase text-muted-foreground mb-2">Before</p>
        <p className="text-[14px] text-foreground/65 leading-[1.5] line-through decoration-foreground/30 decoration-[1.5px]">
          Three missed calls, two voicemails, one angry text from your spouse.
        </p>
      </div>
      <div className="relative p-5 rounded-[14px] bg-foreground text-white text-left">
        <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-accent" />
        <p className="text-[10.5px] tracking-[0.16em] uppercase text-white/55 mb-2">After</p>
        <p className="text-[14px] text-white leading-[1.5]">
          Every call answered. Every order logged. You, off the phone.
        </p>
      </div>
    </div>
  </CardShell>
);

const VARIANTS: Variant[] = [
  { id: 'aria',     label: 'A · Aria speech bubble',       blurb: 'The AI agent introduces herself. On-brand for a voice-agent product.',                  Component: AriaVariant },
  { id: 'timeline', label: 'B · What happens next',         blurb: 'Three steps with time estimates. Sets clear expectations, reduces follow-up anxiety.',  Component: TimelineVariant },
  { id: 'live',     label: 'C · Talk to Aria right now',   blurb: 'Phone number + sample-call playback. Turns the dead-end into a product trial.',         Component: LiveTeaserVariant },
  { id: 'confetti', label: 'D · Confetti celebration',      blurb: 'Big italic headline, scribble doodle, brand-colored confetti. Joyful, on-brand.',       Component: ConfettiVariant },
  { id: 'skip',     label: 'E · Skip the wait',             blurb: 'WhatsApp + Call + Calendar. Conversion-focused — best at converting hot leads now.',    Component: SkipWaitVariant },
  { id: 'social',   label: 'F · Social proof',              blurb: 'Testimonial + logo strip. Reassures the visitor they made the right call.',             Component: SocialProofVariant },
  { id: 'doorstep', label: 'G · Doorstep of something big', blurb: '"You\'re at the doorstep…" + staircase visual. Visionary, momentum-driven.',            Component: DoorstepVariant },
  { id: 'clock',    label: 'H · The clock is running',      blurb: '"Hours away from a quieter phone" + live 24h countdown timer. Suspense + concrete.',    Component: CountdownVariant },
  { id: 'last',     label: 'I · Last missed call',          blurb: '"Today might be your last missed call." Before/after notification cards. Pain-reversal.', Component: LastMissedCallVariant },
  { id: 'hired',    label: 'J · First AI employee',          blurb: '"You just hired your first AI employee." HR profile card for Aria. Cheeky reframe.',    Component: HiredVariant },
  { id: 'future',   label: 'K · The future answered.',       blurb: 'Massive italic type, almost a billboard. Minimalist, designer-y, brand-forward.',       Component: FutureAnsweredVariant },
  { id: 'oneway',   label: 'L · From here, you don\'t go back', blurb: 'Bold one-way framing + before/after split. Confident, slightly cocky.',              Component: OneWayVariant },
];

const ThankYouIdeas = () => {
  const [active, setActive] = useState<string | 'all'>('all');

  useEffect(() => {
    document.title = 'Thank-you ideas · Talkys sandbox';
  }, []);

  const shown = active === 'all' ? VARIANTS : VARIANTS.filter((v) => v.id === active);

  return (
    <main className="min-h-screen bg-background py-14 px-6">
      <div className="max-w-[900px] mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-foreground/60 hover:text-accent text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>

        <header className="mb-10">
          <ChipEyebrow>SANDBOX</ChipEyebrow>
          <h1
            className="font-heading font-bold text-foreground tracking-[-0.03em] leading-[1.05] mt-4 mb-3"
            style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
          >
            Thank-you screen <AccentItalic>ideas.</AccentItalic>
          </h1>
          <p className="text-muted-foreground text-[17px] max-w-[620px]">
            Six directions for the post-submit state. Scroll, compare, then tell me which letter to ship.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-10">
          <button
            type="button"
            onClick={() => setActive('all')}
            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-all ${
              active === 'all'
                ? 'bg-foreground text-white border-foreground'
                : 'bg-white text-foreground/70 border-black/[0.08] hover:border-foreground/30'
            }`}
          >
            Show all
          </button>
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActive(v.id)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-all ${
                active === v.id
                  ? 'bg-foreground text-white border-foreground'
                  : 'bg-white text-foreground/70 border-black/[0.08] hover:border-foreground/30'
              }`}
            >
              {v.label.split(' · ')[0]}
            </button>
          ))}
        </div>

        <div className="space-y-14">
          {shown.map((v) => {
            const VariantComponent = v.Component;
            return (
              <section key={v.id} id={v.id}>
                <div className="mb-4">
                  <h2 className="text-foreground text-[20px] font-bold tracking-[-0.01em]">{v.label}</h2>
                  <p className="text-muted-foreground text-[14px] mt-0.5">{v.blurb}</p>
                </div>
                <VariantComponent />
              </section>
            );
          })}
        </div>

        <footer className="mt-16 pt-8 border-t border-black/[0.08] text-[13px] text-muted-foreground text-center">
          When you're decided, tell me the letter (A–F) and I'll wire that variant into the real form.
        </footer>
      </div>
    </main>
  );
};

export default ThankYouIdeas;
