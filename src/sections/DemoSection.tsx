import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import {
  Utensils, Car, BedDouble, ShoppingBag,
  Mic, MessageSquare, Phone, Play, Pause,
  Camera, Info, Video, Send, Smile, Plus, Image as ImageIcon,
  Check, CheckCheck,
} from 'lucide-react';
import { useT, useLocale } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';
import { INDUSTRIES, type IndustryId } from '@/data/industries';
import {
  DEMO_SCRIPTS,
  CHAT_LANGUAGES,
  CHAT_LANGUAGE_LABEL,
  type ChatLanguage,
} from '@/data/demoScripts';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number | string }>;

const INDUSTRY_ICONS: Record<IndustryId, IconComponent> = {
  restaurant: Utensils,
  dealership: Car,
  hotel: BedDouble,
  retail: ShoppingBag,
};

type Mode = 'voice' | 'chat';

const DemoSection = () => {
  const t = useT();
  const { locale } = useLocale();
  const [activeIndustry, setActiveIndustry] = useState<IndustryId>('dealership');
  const [activeMode, setActiveMode] = useState<Mode>('chat');
  const [chatLang, setChatLang] = useState<ChatLanguage>('arabizi');

  return (
    <section id="demo" className="py-16 lg:py-20">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-7">
          <div className="mb-4 inline-block">
            <ChipEyebrow>{t('demo.eyebrow') as string}</ChipEyebrow>
          </div>
          <h2 className="section-headline">
            {t('demo.titlePrefix') as string}{' '}
            <AccentItalic>{t('demo.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-[560px] mx-auto">
            {t('demo.subtitle') as string}
          </p>
        </div>

        {/* Mobile: industries stacked above demo. Desktop: industries become a left rail beside the demo. */}
        <div className="flex flex-col items-stretch gap-5 md:flex-row md:items-start md:justify-center md:gap-8">

          {/* Industry pills (row on mobile, column on desktop) */}
          <div className="flex flex-wrap justify-center gap-2 md:flex-col md:flex-nowrap md:items-stretch md:gap-2 md:w-44 md:flex-shrink-0">
            {INDUSTRIES.map((ind) => {
              const Icon = INDUSTRY_ICONS[ind.id];
              const isActive = activeIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(ind.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-accent text-white border-accent shadow-coral'
                      : 'bg-white text-foreground/70 border-black/[0.06] hover:border-accent/30 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2} />
                  <span>{ind.label[locale]}</span>
                </button>
              );
            })}
            <a
              href="#get-started"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-teal/40 bg-teal/[0.04] text-teal text-sm font-medium transition-all hover:bg-teal hover:text-white hover:border-teal hover:shadow-[0_8px_20px_-8px_rgba(14,79,92,0.45)]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.25} />
              <span>{t('demo.customIndustry') as string}</span>
            </a>
          </div>

          {/* Active demo + its toolbar (mode + language fused above the card) */}
          <div className={`mx-auto md:mx-0 w-full transition-[max-width,width] duration-300 ease-out ${activeMode === 'chat' ? 'max-w-[340px] md:w-[340px]' : 'max-w-[460px] md:w-[460px]'}`}>
          <div className="flex items-center justify-center flex-wrap gap-2 mb-3">
            {/* Compact mode toggle */}
            <div className="inline-flex p-0.5 bg-white border border-black/[0.06] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <button
                onClick={() => setActiveMode('chat')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeMode === 'chat'
                    ? 'bg-accent text-white shadow-coral'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
                {t('demo.chatMode') as string}
              </button>
              <button
                onClick={() => setActiveMode('voice')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeMode === 'voice'
                    ? 'bg-accent text-white shadow-coral'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <Mic className="w-3.5 h-3.5" strokeWidth={2} />
                {t('demo.voiceMode') as string}
              </button>
            </div>

            {/* Compact language toggle (chat only) */}
            {activeMode === 'chat' && (
              <div className="inline-flex p-0.5 bg-white border border-black/[0.06] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                {CHAT_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setChatLang(lang)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      chatLang === lang
                        ? 'bg-foreground text-white'
                        : 'text-foreground/55 hover:text-foreground'
                    }`}
                  >
                    {CHAT_LANGUAGE_LABEL[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div key={`mode-${activeMode}`} className="animate-mode-in">
            {activeMode === 'chat'
              ? <ChatDemo key={`chat-${activeIndustry}-${chatLang}`} industry={activeIndustry} chatLang={chatLang} />
              : <VoiceDemo key={`voice-${activeIndustry}`} industry={activeIndustry} />
            }
          </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DemoSection;

/* ============================================================ Voice demo */

function VoiceDemo({ industry: industryId }: { industry: IndustryId }) {
  const t = useT();
  const { locale } = useLocale();
  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? INDUSTRIES[0];

  const audioPrimary = industry.demoCall.audio[locale];
  const audioFallback = industry.demoCall.audio.en;

  const [audioSrc, setAudioSrc] = useState<string>(audioPrimary);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setAudioSrc(audioPrimary);
    setCurrentTime(0);
  }, [audioPrimary]);

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
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  const handleAudioError = () => {
    setIsPlaying(false);
    if (audioSrc !== audioFallback) setAudioSrc(audioFallback);
  };

  const progress = industry.demoCall.duration > 0
    ? Math.min(100, (currentTime / industry.demoCall.duration) * 100)
    : 0;

  return (
    <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-card p-6 sm:p-8 space-y-6">
      {/* Caller line */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-3.5 h-3.5" />
          <span className="font-medium text-foreground/80">
            {isPlaying ? (t('demo.liveLabel') as string) : (t('demo.callerLabel') as string)}
          </span>
          <span>·</span>
          <span>{industry.demoCall.caller}</span>
        </div>
      </div>

      {/* Waveform — the visual */}
      <Waveform isActive={isPlaying} />

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-accent hover:bg-accent-soft text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-coral"
          aria-label={isPlaying ? (t('demo.pauseAria') as string) : (t('demo.playAria') as string)}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ms-0.5 rtl:rotate-180" />}
        </button>
        <div className="flex-1">
          <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-soft transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-mono tabular-nums">
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

function Waveform({ isActive }: { isActive: boolean }) {
  return (
    <div className="h-20 flex items-center gap-1 px-2">
      {Array.from({ length: 32 }, (_, k) => (
        <div
          key={k}
          className={`flex-1 rounded-[3px] transition-all ${isActive ? 'animate-wave-pulse' : ''}`}
          style={{
            background: 'linear-gradient(180deg, #e57756 0%, #f5a585 100%)',
            animationDelay: `${(k < 16 ? k : 31 - k) * 0.04}s`,
            height: isActive ? undefined : '12%',
            opacity: isActive ? undefined : 0.4,
            boxShadow: '0 0 12px rgba(229,119,86,0.25)',
          }}
        />
      ))}
    </div>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, '0')}`;
}

/* ============================================================ Chat demo */

type PlatformId = 'whatsapp' | 'instagram' | 'messenger';

interface PlatformTheme {
  id: PlatformId;
  name: string;
  headerBg: string;       // CSS background for the chat header
  headerText: string;     // text color on header
  shellBg: string;        // chat body background
  sentBg: string;         // outgoing bubble bg
  sentText: string;
  receivedBg: string;     // incoming bubble bg
  receivedText: string;
  inputBg: string;
  accent: string;         // accent color for icons / send button
  Logo: ComponentType<{ className?: string }>;
}

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path
        d="M22.6 18.7c-.3-.2-1.9-1-2.2-1s-.5-.2-.8.1-.9 1-1.1 1.2c-.2.2-.4.2-.7.1-.8-.4-1.7-.9-2.4-1.7-.6-.7-1.1-1.5-1.4-2.2-.1-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.2-.5 0-.2 0-.4-.1-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.1 2 3 4.9 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4 0-.1-.2-.2-.5-.4z"
        fill="#fff"
      />
    </svg>
  );
}

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#feda75" />
          <stop offset=".3" stopColor="#fa7e1e" />
          <stop offset=".6" stopColor="#d62976" />
          <stop offset="1" stopColor="#962fbf" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#ig-grad)" />
      <rect x="7" y="7" width="18" height="18" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="16" cy="16" r="4" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="21" cy="11" r="1.2" fill="#fff" />
    </svg>
  );
}

function MessengerLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ms-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00C6FF" />
          <stop offset="1" stopColor="#0078FF" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#ms-grad)" />
      <path
        d="M16 7c-5 0-9 3.7-9 8.4 0 2.7 1.4 5 3.5 6.6V25l3.3-1.8c.7.2 1.4.3 2.2.3 5 0 9-3.7 9-8.4S21 7 16 7zm.9 11.3-2.3-2.5-4.5 2.5 4.9-5.2 2.3 2.5 4.5-2.5-4.9 5.2z"
        fill="#fff"
      />
    </svg>
  );
}

const PLATFORMS: PlatformTheme[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    headerBg: '#075e54',
    headerText: '#fff',
    shellBg: '#ECE5DD',
    sentBg: '#DCF8C6',
    sentText: '#1a1a1a',
    receivedBg: '#fff',
    receivedText: '#1a1a1a',
    inputBg: '#fff',
    accent: '#25D366',
    Logo: WhatsAppLogo,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    headerBg: '#fff',
    headerText: '#1a1a1a',
    shellBg: '#fff',
    sentBg: 'linear-gradient(135deg,#962fbf 0%,#d62976 50%,#fa7e1e 100%)',
    sentText: '#fff',
    receivedBg: '#efefef',
    receivedText: '#1a1a1a',
    inputBg: '#f5f5f5',
    accent: '#d62976',
    Logo: InstagramLogo,
  },
  {
    id: 'messenger',
    name: 'Messenger',
    headerBg: '#fff',
    headerText: '#1a1a1a',
    shellBg: '#fff',
    sentBg: 'linear-gradient(135deg,#00C6FF 0%,#0078FF 100%)',
    sentText: '#fff',
    receivedBg: '#f0f0f0',
    receivedText: '#1a1a1a',
    inputBg: '#f5f5f5',
    accent: '#0078FF',
    Logo: MessengerLogo,
  },
];

const PLATFORM_HOLD_MS = 4500;          // how long each platform skin is shown
const FULL_LOOP_MS = PLATFORM_HOLD_MS * PLATFORMS.length;

function ChatDemo({
  industry: industryId,
  chatLang,
}: {
  industry: IndustryId;
  chatLang: ChatLanguage;
}) {
  const messages = DEMO_SCRIPTS[chatLang]?.[industryId] ?? DEMO_SCRIPTS.en[industryId];
  const bubbleDir: 'rtl' | 'ltr' = chatLang === 'ar' ? 'rtl' : 'ltr';

  const [clock, setClock] = useState(0);

  useEffect(() => {
    setClock(0);
    const id = setInterval(() => setClock((c) => c + 100), 100);
    return () => clearInterval(id);
  }, [industryId, chatLang]);

  const tInLoop = clock % FULL_LOOP_MS;
  const platformIndex = Math.min(
    PLATFORMS.length - 1,
    Math.floor(tInLoop / PLATFORM_HOLD_MS),
  );
  const platform = PLATFORMS[platformIndex];

  // Reveal messages on a stagger over the full loop
  const messageReveals = useMemo(() => {
    const totalRevealMs = FULL_LOOP_MS - 1200; // leave 1.2s tail
    const step = totalRevealMs / messages.length;
    return messages.map((_, i) => Math.floor(step * (i + 1)));
  }, [messages]);

  const visibleCount = messageReveals.filter((r) => r <= tInLoop).length;

  return (
    <div
      className="rounded-[28px] overflow-hidden shadow-card transition-colors duration-500"
      style={{ background: platform.shellBg }}
    >
      <ChatHeader platform={platform} industryId={industryId} />
      <div
        className="px-3 py-4 space-y-2 h-[540px] overflow-y-auto transition-colors duration-500"
        style={{ background: platform.shellBg }}
      >
        {messages.slice(0, visibleCount).map((m, i) => (
          <ChatBubble key={`${platform.id}-${i}`} message={m} platform={platform} dir={bubbleDir} />
        ))}
        {visibleCount < messages.length && (
          <TypingIndicator
            side={messages[visibleCount]?.side ?? 'agent'}
            platform={platform}
          />
        )}
      </div>
      <ChatInputBar platform={platform} />
      <PlatformDots active={platformIndex} />
    </div>
  );
}

function ChatHeader({ platform, industryId }: { platform: PlatformTheme; industryId: IndustryId }) {
  const { locale } = useLocale();
  const industry = INDUSTRIES.find((i) => i.id === industryId)!;
  const Logo = platform.Logo;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 transition-colors duration-500"
      style={{ background: platform.headerBg, color: platform.headerText }}
    >
      <Logo className="w-7 h-7 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight truncate">Talkys · {industry.label[locale]}</p>
        <p className="text-[11px] opacity-70 leading-tight">{platform.name === 'WhatsApp' ? 'online' : platform.name === 'Instagram' ? 'Active now' : 'Active now'}</p>
      </div>
      {platform.id === 'whatsapp' ? (
        <>
          <Video className="w-5 h-5 opacity-90" strokeWidth={1.75} />
          <Phone className="w-5 h-5 opacity-90" strokeWidth={1.75} />
        </>
      ) : platform.id === 'instagram' ? (
        <>
          <Phone className="w-5 h-5 opacity-80" strokeWidth={1.75} />
          <Camera className="w-5 h-5 opacity-80" strokeWidth={1.75} />
          <Info className="w-5 h-5 opacity-80" strokeWidth={1.75} />
        </>
      ) : (
        <>
          <Phone className="w-5 h-5 opacity-80" strokeWidth={1.75} />
          <Video className="w-5 h-5 opacity-80" strokeWidth={1.75} />
          <Info className="w-5 h-5 opacity-80" strokeWidth={1.75} />
        </>
      )}
    </div>
  );
}

function ChatBubble({
  message, platform, dir,
}: {
  message: { side: 'customer' | 'agent'; text?: string; image?: string };
  platform: PlatformTheme;
  dir: 'rtl' | 'ltr';
}) {
  const isAgent = message.side === 'agent';
  // In the chat, the AGENT is "us" (sent), CUSTOMER is "them" (received).
  const isSent = isAgent;
  const bg = isSent ? platform.sentBg : platform.receivedBg;
  const fg = isSent ? platform.sentText : platform.receivedText;
  // Bubble row alignment follows the chat platform UI (sent right, received left),
  // independent of the language inside the bubble.
  const rowClass = isSent ? 'ml-auto' : 'mr-auto';
  const cornerClass = isSent ? 'rounded-tr-md' : 'rounded-tl-md';
  const isImage = !!message.image;

  return (
    <div
      dir={dir}
      className={`max-w-[78%] ${isImage ? 'p-1' : 'px-3.5 py-2'} rounded-2xl ${rowClass} ${cornerClass} ${isImage ? 'overflow-hidden' : 'text-[14px] leading-[1.35]'} shadow-[0_1px_1px_rgba(0,0,0,0.04)] animate-bubble-in`}
      style={{ background: bg, color: fg }}
    >
      {isImage ? (
        <img
          src={message.image}
          alt=""
          className="block w-full max-w-[260px] rounded-xl object-cover"
          loading="lazy"
        />
      ) : (
        <>
          <span>{message.text}</span>
          {isSent && (
            <span className="ms-1 inline-flex items-center align-middle" style={{ opacity: 0.7 }}>
              <CheckCheck className="w-3.5 h-3.5" strokeWidth={2} />
            </span>
          )}
        </>
      )}
    </div>
  );
}

function TypingIndicator({
  side, platform,
}: {
  side: 'customer' | 'agent';
  platform: PlatformTheme;
}) {
  const isSent = side === 'agent';
  const bg = isSent ? platform.sentBg : platform.receivedBg;
  const tailClass = isSent
    ? 'rounded-tr-md ms-auto'
    : 'rounded-tl-md me-auto';
  return (
    <div
      className={`max-w-[60px] px-3 py-2 rounded-2xl ${tailClass} flex items-center gap-1`}
      style={{ background: bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse" style={{ animationDelay: '0s' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse" style={{ animationDelay: '0.15s' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
    </div>
  );
}

function ChatInputBar({ platform }: { platform: PlatformTheme }) {
  return (
    <div className="px-3 py-2.5 flex items-center gap-2 border-t border-black/[0.04]"
         style={{ background: platform.shellBg }}>
      {platform.id === 'whatsapp' ? (
        <>
          <Smile className="w-5 h-5 text-foreground/40" strokeWidth={1.75} />
          <div className="flex-1 rounded-full px-3 py-1.5 text-xs text-foreground/40"
               style={{ background: platform.inputBg }}>
            Message
          </div>
          <Plus className="w-5 h-5 text-foreground/40" strokeWidth={1.75} />
          <Mic className="w-5 h-5 text-foreground/40" strokeWidth={1.75} />
        </>
      ) : platform.id === 'instagram' ? (
        <>
          <div className="flex-1 rounded-full px-3 py-1.5 text-xs text-foreground/40 border border-black/10"
               style={{ background: platform.inputBg }}>
            Message...
          </div>
          <ImageIcon className="w-5 h-5 text-foreground/40" strokeWidth={1.75} />
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" style={{ color: platform.accent }} strokeWidth={2} />
          <div className="flex-1 rounded-full px-3 py-1.5 text-xs text-foreground/40"
               style={{ background: platform.inputBg }}>
            Aa
          </div>
          <Send className="w-5 h-5" style={{ color: platform.accent }} strokeWidth={2} />
        </>
      )}
    </div>
  );
}

function PlatformDots({ active }: { active: number }) {
  return (
    <div className="flex justify-center gap-1.5 py-3 bg-white border-t border-black/[0.06]">
      {PLATFORMS.map((p, i) => (
        <span
          key={p.id}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i === active ? 'w-6 bg-accent' : 'w-1.5 bg-foreground/20'
          }`}
        />
      ))}
    </div>
  );
}

// Mark Check imported as used; lint-friendly.
void Check;
