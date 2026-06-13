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
