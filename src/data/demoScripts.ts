import type { IndustryId } from '@/data/industries';

export type ChatSide = 'customer' | 'agent';

/**
 * The script language for the chat demo. Independent from the site's
 * UI locale — a user reading the English site can still pick Arabizi
 * to see how Talkys handles informal Arabic in Latin characters.
 */
export type ChatLanguage = 'en' | 'ar' | 'arabizi';

export const CHAT_LANGUAGES: ChatLanguage[] = ['en', 'arabizi', 'ar'];

export const CHAT_LANGUAGE_LABEL: Record<ChatLanguage, string> = {
  en: 'EN',
  arabizi: 'Arabizi',
  ar: 'AR',
};

export interface ChatMessage {
  side: ChatSide;
  text?: string;
  /** Optional image attached to the message. Public path, e.g. `/dealership-jetour.jpg`. */
  image?: string;
}

const JETOUR_IMG = '/dealership-jetour.jpg';

const EN: Record<IndustryId, ChatMessage[]> = {
  restaurant: [
    { side: 'customer', text: 'Hi! Do you deliver to Hamra?' },
    { side: 'agent',    text: 'Yes! 35 min average. What can I get for you?' },
    { side: 'customer', text: '2 shawarmas and 1 fries please' },
    { side: 'agent',    text: 'Garlic sauce on the side?' },
    { side: 'customer', text: 'Yes, and one Pepsi' },
    { side: 'agent',    text: 'Total $12.50. Card on delivery?' },
    { side: 'customer', text: 'Yes please 🙏' },
    { side: 'agent',    text: 'Confirmed ✓ Driver will call when close' },
  ],
  dealership: [
    { side: 'customer', text: 'Hi! Is the Jetour Traveller still available?' },
    { side: 'agent',    text: 'Yes — let me send you a photo 📸' },
    { side: 'agent',    image: JETOUR_IMG },
    { side: 'customer', text: 'Looks great! Test drive?' },
    { side: 'agent',    text: 'Thursday at 5pm?' },
    { side: 'customer', text: 'Perfect' },
    { side: 'agent',    text: "Booked ✓ Bring your driver's license" },
    { side: 'customer', text: 'Thanks! 🙏' },
    { side: 'agent',    text: 'See you Thursday 🚗' },
  ],
  hotel: [
    { side: 'customer', text: 'Sea-view room July 15–17?' },
    { side: 'agent',    text: 'Yes! $180/night, breakfast included' },
    { side: 'customer', text: 'Two guests, book it please' },
    { side: 'agent',    text: 'Use the card on file?' },
    { side: 'customer', text: 'Yes' },
    { side: 'agent',    text: 'Confirmed ✓ See you July 15' },
    { side: 'customer', text: 'Great, thank you!' },
    { side: 'agent',    text: "We'll be ready for you 🌊" },
  ],
  retail: [
    { side: 'customer', text: 'Is the brown leather bag still in stock?' },
    { side: 'agent',    text: 'Yes! Delivery or pickup?' },
    { side: 'customer', text: 'Delivery today if possible' },
    { side: 'agent',    text: '5–6pm slot works?' },
    { side: 'customer', text: 'Yes' },
    { side: 'agent',    text: '$95 + $5 delivery. Confirm?' },
    { side: 'customer', text: 'Confirm' },
    { side: 'agent',    text: 'Shipped ✓ Tracking sent to your phone' },
  ],
};

const AR: Record<IndustryId, ChatMessage[]> = {
  restaurant: [
    { side: 'customer', text: 'مرحبا! بتوصلوا عالحمرا؟' },
    { side: 'agent',    text: 'أكيد! بمعدل ٣٥ دقيقة. شو بتحب تطلب؟' },
    { side: 'customer', text: 'شاورمتين و١ بطاطا لو سمحت' },
    { side: 'agent',    text: 'صوص ثوم عالجنب؟' },
    { side: 'customer', text: 'إي، ومعها بيبسي' },
    { side: 'agent',    text: 'المجموع ١٢٫٥ دولار. دفع كاش أو فيزا؟' },
    { side: 'customer', text: 'فيزا 🙏' },
    { side: 'agent',    text: 'تم التأكيد ✓ السائق رح يتصل قبل ما يوصل' },
  ],
  dealership: [
    { side: 'customer', text: 'هل الـ Jetour Traveller لسا متوفرة؟' },
    { side: 'agent',    text: 'إي — خليني ابعتلك صورة 📸' },
    { side: 'agent',    image: JETOUR_IMG },
    { side: 'customer', text: 'كتير حلوة! تجربة قيادة؟' },
    { side: 'agent',    text: 'الخميس الساعة ٥؟' },
    { side: 'customer', text: 'تمام' },
    { side: 'agent',    text: 'محجوز ✓ احضر معك رخصة القيادة' },
    { side: 'customer', text: 'شكراً! 🙏' },
    { side: 'agent',    text: 'بشوفك الخميس 🚗' },
  ],
  hotel: [
    { side: 'customer', text: 'غرفة على البحر ١٥–١٧ تموز؟' },
    { side: 'agent',    text: 'متوفرة! ١٨٠$ بالليلة، الفطور مشمول' },
    { side: 'customer', text: 'شخصان، احجزها لو سمحت' },
    { side: 'agent',    text: 'نفس البطاقة الموجودة؟' },
    { side: 'customer', text: 'إي' },
    { side: 'agent',    text: 'تم التأكيد ✓ بشوفك ١٥ تموز' },
    { side: 'customer', text: 'ممتاز، شكراً!' },
    { side: 'agent',    text: 'بنستناك 🌊' },
  ],
  retail: [
    { side: 'customer', text: 'هل حقيبة الجلد البنية لسا متوفرة؟' },
    { side: 'agent',    text: 'إي! توصيل ولا استلام؟' },
    { side: 'customer', text: 'توصيل اليوم إذا ممكن' },
    { side: 'agent',    text: 'بين ٥ و٦ مساءً مناسب؟' },
    { side: 'customer', text: 'إي' },
    { side: 'agent',    text: '٩٥$ + ٥$ توصيل. أأكد؟' },
    { side: 'customer', text: 'أكد' },
    { side: 'agent',    text: 'تم الشحن ✓ رقم التتبع رح يوصل عالموبايل' },
  ],
};

const ARABIZI: Record<IndustryId, ChatMessage[]> = {
  restaurant: [
    { side: 'customer', text: 'Marhaba! Bet wassel 3al Hamra?' },
    { side: 'agent',    text: 'Akeed! Bi mu3addal 35 da2i2a. Sho bt7ib totlob?' },
    { side: 'customer', text: '2 shawarma w 1 batata law sama7t' },
    { side: 'agent',    text: 'Sauce toum 3al jamb?' },
    { side: 'customer', text: 'Eh, w ma3on Pepsi' },
    { side: 'agent',    text: 'Total 12.50$. Cash aw card?' },
    { side: 'customer', text: 'Card law sama7t 🙏' },
    { side: 'agent',    text: 'Tamm el ta2keed ✓ El driver ra7 yet7ek 2abel ma yossal' },
  ],
  dealership: [
    { side: 'customer', text: 'Hi! El Jetour Traveller lessa mawjoode?' },
    { side: 'agent',    text: 'Eh — 5alleene b3atlak soura 📸' },
    { side: 'agent',    image: JETOUR_IMG },
    { side: 'customer', text: 'Mratabe ktir! Test drive?' },
    { side: 'agent',    text: 'El 5amis sa3a 5?' },
    { side: 'customer', text: 'Tamam' },
    { side: 'agent',    text: 'Ma7jouz ✓ Jeeb ma3ak ru5set swe2a' },
    { side: 'customer', text: 'Shukran! 🙏' },
    { side: 'agent',    text: 'Bshoufak el 5amis 🚗' },
  ],
  hotel: [
    { side: 'customer', text: 'Ghorfe 3al ba7r 15-17 tammouz?' },
    { side: 'agent',    text: 'Mawjoode! 180$ bel layle, breakfast mashmoul' },
    { side: 'customer', text: 'Shakhsen, e7jezha law sama7t' },
    { side: 'agent',    text: 'Nafs el card el mawjoode?' },
    { side: 'customer', text: 'Eh' },
    { side: 'agent',    text: 'Tamm el ta2keed ✓ Bshoufak 15 tammouz' },
    { side: 'customer', text: 'Mumtaz, shukran!' },
    { side: 'agent',    text: 'Mnestannak 🌊' },
  ],
  retail: [
    { side: 'customer', text: 'Hal 7a2ibat el jeld el bonniyye lessa mawjoode?' },
    { side: 'agent',    text: 'Eh! Delivery aw pickup?' },
    { side: 'customer', text: 'Delivery el yom iza moumken' },
    { side: 'agent',    text: 'Ben 5 w 6 el masa monaseb?' },
    { side: 'customer', text: 'Eh' },
    { side: 'agent',    text: '95$ + 5$ delivery. A2akkid?' },
    { side: 'customer', text: 'Akkid' },
    { side: 'agent',    text: 'Tamm el sha7n ✓ Tracking rah yossal 3al mobile' },
  ],
};

export const DEMO_SCRIPTS: Record<ChatLanguage, Record<IndustryId, ChatMessage[]>> = {
  en: EN,
  ar: AR,
  arabizi: ARABIZI,
};
