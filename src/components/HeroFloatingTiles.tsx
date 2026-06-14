import type { ReactNode } from 'react';
import { useT } from '@/context/LocaleContext';

type ChannelKey =
  | 'call'
  | 'whatsappChat'
  | 'whatsappCall'
  | 'instagram'
  | 'facebook'
  | 'messenger'
  | 'sms'
  | 'email'
  | 'calendar';

interface TileProps {
  style: { top?: string; bottom?: string; left?: string; right?: string };
  rotation: number;
  delay: number;
  channelKey: ChannelKey;
  dotColor: string;
  popupSide: 'right' | 'left';
  children: ReactNode;
}

function FloatingTile({ style, rotation, delay, channelKey, dotColor, popupSide, children }: TileProps) {
  const t = useT();
  const name = t(`hero.channels.${channelKey}.name`) as string;
  const tagline = t(`hero.channels.${channelKey}.tagline`) as string;

  const popupPositionClass =
    popupSide === 'right'
      ? 'left-full ml-3 top-1/2 -translate-y-1/2 -translate-x-1 group-hover:translate-x-0'
      : 'right-full mr-3 top-1/2 -translate-y-1/2 translate-x-1 group-hover:translate-x-0';

  const arrowPositionClass =
    popupSide === 'right'
      ? 'right-full top-1/2 -translate-y-1/2 -mr-1.5'
      : 'left-full top-1/2 -translate-y-1/2 -ml-1.5';

  const arrowShadowStyle =
    popupSide === 'right'
      ? { boxShadow: '-3px 3px 6px -2px rgba(14,79,92,0.08)' }
      : { boxShadow: '3px -3px 6px -2px rgba(14,79,92,0.08)' };

  return (
    <div className="absolute z-[1] hidden md:block group" style={style}>
      <div
        className="w-[88px] h-[88px] bg-white rounded-[22px] flex items-center justify-center shadow-tile animate-bob-tile"
        style={{ ['--rot' as string]: `${rotation}deg`, animationDelay: `${delay}s` }}
      >
        {children}
      </div>

      <div
        role="tooltip"
        className={`pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 ${popupPositionClass}`}
      >
        <div className="relative bg-white rounded-[14px] shadow-[0_18px_40px_-10px_rgba(14,79,92,0.18),0_4px_12px_-4px_rgba(0,0,0,0.08)] px-3.5 py-2.5 min-w-[150px] whitespace-nowrap text-start">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
            <span className="text-[13px] font-semibold text-foreground leading-tight">{name}</span>
          </div>
          <p className="text-[11.5px] text-muted-foreground leading-snug ms-4">{tagline}</p>
          <div
            className={`absolute w-3 h-3 bg-white rotate-45 ${arrowPositionClass}`}
            style={arrowShadowStyle}
          />
        </div>
      </div>
    </div>
  );
}

const CallIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#0e4f5c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
  </svg>
);

const WhatsAppChatIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <path
      fill="#25D366"
      d="M16 .5C7.44.5.5 7.44.5 16c0 2.82.74 5.58 2.14 8.01L.5 31.5l7.69-2.02a15.47 15.47 0 0 0 7.81 2.1h.01c8.55 0 15.49-6.95 15.49-15.5C31.5 7.44 24.55.5 16 .5z"
    />
    <path
      fill="#fff"
      d="M22.93 19.4c-.38-.19-2.27-1.12-2.62-1.25-.35-.13-.61-.19-.87.19-.26.38-1 1.25-1.22 1.51-.22.26-.45.29-.83.1-.38-.19-1.62-.6-3.08-1.9-1.14-1.02-1.91-2.27-2.14-2.65-.22-.38-.02-.59.17-.78.17-.17.38-.45.58-.67.19-.22.26-.38.38-.64.13-.26.06-.48-.03-.67-.1-.19-.87-2.09-1.19-2.86-.31-.75-.63-.65-.87-.66-.22-.01-.48-.01-.74-.01s-.67.1-1.02.48c-.35.38-1.34 1.31-1.34 3.2 0 1.89 1.37 3.71 1.56 3.97.19.26 2.7 4.13 6.55 5.79.92.4 1.63.63 2.19.81.92.29 1.76.25 2.42.15.74-.11 2.27-.93 2.59-1.82.32-.9.32-1.66.22-1.83-.1-.16-.35-.26-.74-.45z"
    />
  </svg>
);

const WhatsAppCallIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <circle cx="16" cy="16" r="15.5" fill="#25D366" />
    <path
      fill="#fff"
      d="M22.5 19.7l-2.6-1.2c-.4-.2-.9-.1-1.2.2l-1.1 1.1c-.2.2-.5.2-.7.1a10.3 10.3 0 0 1-4.8-4.8c-.1-.2-.1-.5.1-.7l1.1-1.1c.3-.3.4-.8.2-1.2l-1.2-2.6c-.3-.6-1-.9-1.6-.6l-1.5.7c-.5.2-.8.8-.8 1.3.1 1.7.8 5.4 4.4 9 3.6 3.6 7.3 4.3 9 4.4.5 0 1.1-.3 1.3-.8l.7-1.5c.3-.6 0-1.3-.6-1.6z"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#ig-grad)" />
    <rect x="6.5" y="6.5" width="19" height="19" rx="5.5" fill="none" stroke="#fff" strokeWidth="2" />
    <circle cx="16" cy="16" r="4.5" fill="none" stroke="#fff" strokeWidth="2" />
    <circle cx="22" cy="10" r="1.3" fill="#fff" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <circle cx="16" cy="16" r="15.5" fill="#1877F2" />
    <path
      fill="#fff"
      d="M20.5 17.2l.65-4.18h-4.01V10.3c0-1.14.56-2.26 2.36-2.26h1.83v-3.56s-1.66-.28-3.24-.28c-3.31 0-5.47 2-5.47 5.63v3.19H8.97v4.18h3.65v10.1a14.4 14.4 0 0 0 4.51 0V17.2h3.37z"
    />
  </svg>
);

const MessengerIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <defs>
      <radialGradient id="msg-grad" cx="20%" cy="105%" r="120%">
        <stop offset="0%" stopColor="#0099FF" />
        <stop offset="60%" stopColor="#A033FF" />
        <stop offset="100%" stopColor="#FF5280" />
      </radialGradient>
    </defs>
    <path
      fill="url(#msg-grad)"
      d="M16 1.5C7.7 1.5 1.5 7.6 1.5 15.6c0 4.18 1.7 7.8 4.5 10.3v5l4.13-2.27c1.1.3 2.26.47 3.47.5L16 30.5c8.3 0 14.5-6.1 14.5-14.9 0-8-6.2-14.1-14.5-14.1z"
    />
    <path
      fill="#fff"
      d="M7.4 19.6l4.27-6.77 4.27 2.27 4.06-4.27-4.06 6.77-4.27-2.27-4.27 4.27z"
    />
  </svg>
);

const SmsIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <rect x="1" y="1" width="30" height="30" rx="8" fill="#0e4f5c" />
    <path
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 11h16v9H14l-4 4v-4H8z"
    />
    <circle cx="12" cy="15.5" r="1.1" fill="#fff" />
    <circle cx="16" cy="15.5" r="1.1" fill="#fff" />
    <circle cx="20" cy="15.5" r="1.1" fill="#fff" />
  </svg>
);

const GmailIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <path fill="#4285F4" d="M4 8v16a2 2 0 0 0 2 2h3V14.5l-5-3z" />
    <path fill="#34A853" d="M28 8v16a2 2 0 0 1-2 2h-3V14.5l5-3z" />
    <path fill="#FBBC04" d="M9 26V14.5l7 5.25 7-5.25V26h-3.5l-3.5-2.5L12.5 26z" />
    <path fill="#EA4335" d="M4 8a2 2 0 0 1 2-2h.5L16 13l9.5-7H26a2 2 0 0 1 2 2v3.5l-12 9-12-9z" />
    <path fill="#C5221F" d="M4 8v3.5l5 3V8z" />
  </svg>
);

const GoogleCalendarIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <rect x="4" y="4" width="24" height="24" rx="3" fill="#fff" />
    <path d="M22 4h6v6h-6z" fill="#EA4335" />
    <path d="M4 22h6v6H4z" fill="#1A73E8" />
    <path d="M22 22h6v6h-6z" fill="#FBBC04" />
    <path d="M4 4h6v6H4z" fill="#34A853" />
    <text x="16" y="21" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="11" fill="#1A73E8">31</text>
  </svg>
);

export function HeroFloatingTiles() {
  return (
    <>
      <FloatingTile style={{ top: '8%',  left:  '5%' }} rotation={-12} delay={-0.0} channelKey="call"          dotColor="#0e4f5c" popupSide="right"><CallIcon /></FloatingTile>
      <FloatingTile style={{ top: '8%',  right: '5%' }} rotation={10}  delay={-1.0} channelKey="whatsappChat"  dotColor="#25D366" popupSide="left"><WhatsAppChatIcon /></FloatingTile>

      <FloatingTile style={{ top: '30%', left:  '3%' }} rotation={6}   delay={-2.0} channelKey="instagram"     dotColor="#d6249f" popupSide="right"><InstagramIcon /></FloatingTile>
      <FloatingTile style={{ top: '30%', right: '3%' }} rotation={-8}  delay={-3.0} channelKey="facebook"      dotColor="#1877F2" popupSide="left"><FacebookIcon /></FloatingTile>

      <FloatingTile style={{ top: '52%', left:  '5%' }} rotation={-10} delay={-4.0} channelKey="whatsappCall"  dotColor="#25D366" popupSide="right"><WhatsAppCallIcon /></FloatingTile>
      <FloatingTile style={{ top: '52%', right: '5%' }} rotation={8}   delay={-5.0} channelKey="messenger"     dotColor="#A033FF" popupSide="left"><MessengerIcon /></FloatingTile>

      <FloatingTile style={{ top: '74%', left:  '4%' }} rotation={14}  delay={-6.0} channelKey="sms"           dotColor="#0e4f5c" popupSide="right"><SmsIcon /></FloatingTile>
      <FloatingTile style={{ top: '74%', right: '4%' }} rotation={-6}  delay={-7.0} channelKey="email"         dotColor="#EA4335" popupSide="left"><GmailIcon /></FloatingTile>

      <FloatingTile style={{ bottom: '6%', left: '18%' }} rotation={4} delay={-8.0} channelKey="calendar"      dotColor="#1A73E8" popupSide="right"><GoogleCalendarIcon /></FloatingTile>
    </>
  );
}
