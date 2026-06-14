import { useEffect, useRef, useState } from 'react';
import { Plug, Inbox, MessageCircle, Phone, Instagram, MessageSquare } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { ChipEyebrow } from '@/components/ChipEyebrow';
import { AccentItalic } from '@/components/AccentItalic';

const ICONS = [Plug, Inbox];

interface CardCopy {
  eyebrow: string;
  title: string;
  titleAccent: string;
  desc: string;
}

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const cardsCopy = t<CardCopy[]>('howItWorks.cards');
  const cards = Array.isArray(cardsCopy) ? cardsCopy : [];

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
    <section ref={sectionRef} id="how-it-works" className="py-24 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-5 inline-block">
            <ChipEyebrow>{(t('howItWorks.eyebrow') as string) || 'WHAT HAPPENS AFTER'}</ChipEyebrow>
          </div>
          <h2 className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-100 section-headline">
            {t('howItWorks.titlePrefix') as string}{' '}
            <AccentItalic>{t('howItWorks.titleHighlight') as string}</AccentItalic>
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 delay-150 mt-4 text-base text-muted-foreground max-w-[560px] mx-auto">
            {t('howItWorks.subtitle') as string}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {cards.map((card, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={i}
                className="animate-on-scroll opacity-0 translate-y-4 bg-white border border-black/[0.06] rounded-[22px] p-7 lg:p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-700"
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10.5px] font-bold tracking-[0.22em] mb-5 border bg-background border-black/[0.06] text-foreground">
                  <span className="text-accent text-[12px]">‹</span>
                  {card.eyebrow}
                  <span className="text-accent text-[12px]">›</span>
                </div>

                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-white mb-5 bg-gradient-to-br from-teal to-teal-light shadow-[0_10px_24px_-10px_rgba(14,79,92,0.5)]">
                  {Icon && <Icon className="w-6 h-6" strokeWidth={2} />}
                </div>

                <h3 className="font-heading font-bold text-2xl text-foreground mb-3 tracking-[-0.015em]">
                  {card.title}
                  {card.titleAccent && (
                    <>
                      {' '}<AccentItalic>{card.titleAccent}</AccentItalic>
                    </>
                  )}
                </h3>
                <p className="text-base text-muted-foreground leading-[1.5] mb-6">
                  {card.desc}
                </p>

                {i === 0 ? <IntegrationsGrid /> : <InboxMock />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================================ Integrations grid */

type Integration = {
  name: string;
  src: string;           // cdn URL or local /logos/* path
  fallbackMark: string;  // shown if the image fails to load
  fallbackColor: string;
  invert?: boolean;      // white-on-transparent logos need invert to be visible on white tiles
};

const INTEGRATIONS: Integration[] = [
  { name: 'Shopify',    src: 'https://cdn.simpleicons.org/shopify',        fallbackMark: 'SH', fallbackColor: '#95BF47' },
  { name: 'Salesforce', src: '/logos/salesforce.svg',                      fallbackMark: 'SF', fallbackColor: '#00A1E0' },
  { name: 'Odoo',       src: 'https://cdn.simpleicons.org/odoo',           fallbackMark: 'OD', fallbackColor: '#714B67' },
  { name: 'Zoho',       src: 'https://cdn.simpleicons.org/zoho',           fallbackMark: 'ZO', fallbackColor: '#E04C2C' },
  { name: 'HubSpot',    src: 'https://cdn.simpleicons.org/hubspot',        fallbackMark: 'HB', fallbackColor: '#FF7A59' },
  { name: 'Google',     src: 'https://cdn.simpleicons.org/googlecalendar', fallbackMark: 'G',  fallbackColor: '#4285F4' },
  { name: 'Talabat',    src: '/logos/talabat.svg',                         fallbackMark: 'TB', fallbackColor: '#FF5A00' },
  { name: 'Foodics',    src: '/logos/foodics.svg',                         fallbackMark: 'F',  fallbackColor: '#0F3B57' },
  { name: 'Omega POS',  src: '/logos/omegapos.png',                        fallbackMark: 'Ω',  fallbackColor: '#0E4F5C' },
  { name: 'Squirrel',   src: '/logos/squirrel.webp',                       fallbackMark: 'SQ', fallbackColor: '#C25B40', invert: true },
  { name: 'Toters',     src: '/logos/toters.png',                          fallbackMark: 'TO', fallbackColor: '#FF3D00' },
];

function BrandLogo({ logo }: { logo: Integration }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-[13px] font-bold font-heading"
        style={{ background: logo.fallbackColor }}
      >
        {logo.fallbackMark}
      </span>
    );
  }

  return (
    <img
      src={logo.src}
      alt={`${logo.name} logo`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-10 h-10 object-contain"
      style={logo.invert ? { filter: 'invert(1) brightness(0.65)' } : undefined}
    />
  );
}

function IntegrationsGrid() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {INTEGRATIONS.map((it) => (
        <div
          key={it.name}
          title={it.name}
          className="aspect-square flex items-center justify-center rounded-xl bg-white border border-black/[0.06] hover:border-accent/30 transition-all"
        >
          <BrandLogo logo={it} />
        </div>
      ))}
      <a
        href="#get-started"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className="aspect-square flex flex-col items-center justify-center rounded-xl border border-dashed border-accent/40 bg-accent/[0.04] text-accent transition-all hover:bg-accent hover:text-white hover:border-accent hover:shadow-coral"
      >
        <span className="text-base font-heading font-bold leading-none">+</span>
        <span className="text-[10px] font-medium mt-0.5">many more</span>
      </a>
    </div>
  );
}

/* ============================================================ Inbox mock */

type Channel = 'whatsapp' | 'phone' | 'instagram' | 'messenger';

interface InboxRow {
  initials: string;
  name: string;
  channel: Channel;
  preview: string;
  tag: 'hot' | 'booked' | 'replied' | 'reply';
  live?: boolean;
}

const INBOX_ROWS: InboxRow[] = [
  { initials: 'FA', name: 'Fadi Azar',    channel: 'whatsapp',  preview: 'Wants 2 shawarmas + delivery to Hamra', tag: 'hot',     live: true },
  { initials: 'KD', name: 'Karim Daher',  channel: 'phone',     preview: 'Test drive Thursday 5pm',               tag: 'booked' },
  { initials: 'SN', name: 'Sara Nassar',  channel: 'instagram', preview: 'Asked about Civic pricing',             tag: 'replied' },
  { initials: 'MK', name: 'Maya Khoury',  channel: 'messenger', preview: 'Needs to speak with manager',           tag: 'reply' },
];

const CHANNEL_STYLES: Record<Channel, { avatar: string; iconColor: string }> = {
  whatsapp:  { avatar: '#25D366',                                                              iconColor: '#25D366' },
  phone:     { avatar: '#e57756',                                                              iconColor: '#e57756' },
  instagram: { avatar: 'linear-gradient(135deg,#962fbf 0%,#d62976 50%,#fa7e1e 100%)',           iconColor: '#d62976' },
  messenger: { avatar: 'linear-gradient(135deg,#00C6FF 0%,#0078FF 100%)',                       iconColor: '#0078FF' },
};

const TAGS: Record<InboxRow['tag'], { label: string; bg: string; fg: string }> = {
  hot:     { label: 'Hot lead',     bg: 'bg-accent/15',          fg: 'text-accent' },
  booked:  { label: 'Booked',       bg: 'bg-emerald-500/10',     fg: 'text-emerald-700' },
  replied: { label: 'Replied',      bg: 'bg-foreground/[0.06]',  fg: 'text-foreground/55' },
  reply:   { label: 'Needs reply',  bg: 'bg-amber-400/15',       fg: 'text-amber-700' },
};

function ChannelIcon({ channel }: { channel: Channel }) {
  const color = CHANNEL_STYLES[channel].iconColor;
  const Icon =
    channel === 'whatsapp'  ? MessageCircle :
    channel === 'phone'     ? Phone :
    channel === 'instagram' ? Instagram :
                              MessageSquare;
  return <Icon className="w-3 h-3" strokeWidth={2.5} style={{ color }} />;
}

function InboxMock() {
  return (
    <div className="rounded-[14px] bg-white border border-black/[0.06] overflow-hidden">
      {/* Tab strip */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-black/[0.06] text-[10.5px] font-semibold">
        <span className="px-2 py-1 rounded-full bg-foreground text-white">All</span>
        <span className="px-2 py-1 rounded-full text-accent bg-accent/10">Hot leads</span>
        <span className="px-2 py-1 rounded-full text-foreground/55">Booked</span>
        <span className="px-2 py-1 rounded-full text-foreground/55">Needs reply</span>
      </div>
      {/* Rows */}
      <ul className="divide-y divide-black/[0.05]">
        {INBOX_ROWS.map((row) => {
          const tag = TAGS[row.tag];
          const channelStyle = CHANNEL_STYLES[row.channel];
          return (
            <li key={row.name} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-bg-soft transition-colors">
              <div className="relative">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-[11px] font-bold"
                  style={{ background: channelStyle.avatar }}
                >
                  {row.initials}
                </span>
                {row.live && (
                  <span className="absolute -bottom-0 -end-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground leading-tight">
                  <ChannelIcon channel={row.channel} />
                  <span className="truncate">{row.name}</span>
                </div>
                <p className="text-[11px] text-foreground/55 truncate leading-tight mt-0.5">{row.preview}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tag.bg} ${tag.fg} whitespace-nowrap`}>
                {tag.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default HowItWorksSection;
