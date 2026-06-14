export const EN_TRANSLATIONS = {
  nav: {
    links: {
      howItWorks: 'How it Works',
      features: 'Features',
      getStarted: 'Get Started',
    },
    bookDemo: 'Book a Demo',
    toggleTheme: 'Toggle theme',
    languageSwitch: 'Switch language',
  },
  hero: {
    badge: 'Now Live in Lebanon',
    title: 'Meet',
    subtitle:
      'Talkys gives you a team of AI voice agents that take orders, answer calls, handle deliveries, and manage customer conversations — 24/7, in Arabic and English.',
    ctaPrimary: 'Book a Free Demo',
    ctaSecondary: 'See How It Works',
    scribble: 'Try it free, no card',
    channels: {
      call:          { name: 'Phone calls',     tagline: 'We answer every ring' },
      whatsappChat:  { name: 'WhatsApp chat',   tagline: 'Replies in seconds' },
      whatsappCall:  { name: 'WhatsApp call',   tagline: 'Voice calls, picked up 24/7' },
      instagram:     { name: 'Instagram DMs',   tagline: 'Every message handled' },
      facebook:      { name: 'Facebook',        tagline: 'Inbox and comments covered' },
      messenger:     { name: 'Messenger',       tagline: 'Always-on responses' },
      sms:           { name: 'SMS',             tagline: 'Texts back in real time' },
      email:         { name: 'Email',           tagline: 'Inbox handled for you' },
      calendar:      { name: 'Google Calendar', tagline: 'Books meetings on your behalf' },
    },
  },
  problem: {
    titlePrefix: "Lebanon's Businesses Are Losing",
    titleHighlight: 'Revenue',
    titleSuffix: 'to Missed Calls',
    subtitle:
      'Every unanswered call is a lost order. Every busy line is a customer calling your competitor.',
    eyebrow: 'THE PROBLEM',
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
    eyebrow: 'THE SOLUTION',
    ariaName: 'Aria',
    ariaTagline: 'AI Agent · On call',
  },
  howItWorks: {
    titlePrefix: 'Connects to your stack.',
    titleHighlight: 'Catches every customer.',
    subtitle:
      'Talkys talks to the tools you already use and brings every conversation into one place — so nothing falls through the cracks.',
    eyebrow: 'WHAT HAPPENS AFTER',
    cards: [
      {
        eyebrow: 'INTEGRATIONS',
        title: 'Plugs into the tools you already use',
        titleAccent: '',
        desc: 'POS, e-commerce, CRM, accounting, delivery — Talkys keeps everything in sync. No exports, no spreadsheets, no double entry.',
      },
      {
        eyebrow: 'LEAD HANDOFF',
        title: 'Every chat, summarized.',
        titleAccent: 'You take the lead.',
        desc: 'Talkys handles the noise, surfaces the real leads, and gets out of the way. You do the work that matters.',
      },
    ],
  },
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
  getStarted: {
    titlePrefix: 'Book Your',
    titleHighlight: 'Free Demo',
    paragraph:
      'See exactly how Talkys works for your business. Our team will walk you through a live demo customized to your industry and workflow.',
    eyebrow: 'GET STARTED',
    formMeta: 'No credit card · 14-day trial · We will be in touch within 24h',
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
    newsletterPlaceholder: 'Your email',
    newsletterCta: 'Subscribe',
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
    copyright: '© 2026 Talkys AI · All rights reserved',
  },
  legal: {
    lastUpdated: 'Last updated: June 14, 2026',
    backToHome: 'Back to home',
    contactNote: 'Questions? Reach us at',
    contactEmail: 'hello@talkys.ai',
    privacy: {
      title: 'Privacy Policy',
      intro:
        'This Privacy Policy explains how Talkys AI ("we", "us", "our") collects, uses, and protects information when you visit our website or use our AI voice agent platform.',
      sections: [
        {
          heading: '1. Information We Collect',
          body: 'We collect information you provide directly — such as your name, email, company, and any details you share when booking a demo. When you use the platform, we also collect call recordings, transcripts, usage logs, and basic device and browser data.',
        },
        {
          heading: '2. How We Use Your Information',
          body: 'We use the information to operate and improve the service, respond to your requests, provide customer support, send service-related updates, and meet legal obligations. We do not sell personal data.',
        },
        {
          heading: '3. Sharing and Disclosure',
          body: 'We share data with trusted vendors who process it on our behalf (such as hosting, analytics, and telephony providers) under confidentiality obligations. We may disclose information when required by law or to protect our rights and users.',
        },
        {
          heading: '4. Data Retention',
          body: 'We keep personal data only as long as needed to provide the service, comply with legal obligations, and resolve disputes. Call recordings and transcripts are retained according to your account configuration.',
        },
        {
          heading: '5. Your Rights',
          body: 'Subject to applicable law, you may request access, correction, deletion, or portability of your personal data, or object to certain processing. To exercise these rights, contact us using the details below.',
        },
        {
          heading: '6. Security',
          body: 'We apply administrative, technical, and physical safeguards designed to protect your data. No method of transmission or storage is 100% secure, but we work to maintain reasonable protections.',
        },
        {
          heading: '7. Changes to This Policy',
          body: 'We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date above and, where appropriate, notify you through the platform.',
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      intro:
        'These Terms of Service ("Terms") govern your access to and use of the Talkys AI website and platform. By using our services, you agree to these Terms.',
      sections: [
        {
          heading: '1. Use of the Service',
          body: 'You may use Talkys only for lawful purposes and in line with these Terms. You agree not to misuse the service, attempt to disrupt it, or access it through unauthorized means.',
        },
        {
          heading: '2. Accounts',
          body: 'You are responsible for the activity that happens under your account and for keeping your credentials secure. Notify us promptly if you suspect unauthorized use.',
        },
        {
          heading: '3. Acceptable Use',
          body: 'Do not use Talkys to violate any law, infringe intellectual property, harass others, or generate content that is fraudulent, harmful, or deceptive. We may suspend or terminate accounts that violate this policy.',
        },
        {
          heading: '4. Intellectual Property',
          body: 'The Talkys platform, including its software, branding, and content, is owned by Talkys AI or its licensors and is protected by intellectual property laws. You retain rights to content you submit, and grant us a limited license to process it to provide the service.',
        },
        {
          heading: '5. Disclaimers',
          body: 'The service is provided "as is" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee uninterrupted or error-free operation.',
        },
        {
          heading: '6. Limitation of Liability',
          body: 'To the maximum extent permitted by law, Talkys AI will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, profits, or revenue arising from your use of the service.',
        },
        {
          heading: '7. Termination',
          body: 'We may suspend or terminate access to the service at any time for any reason, including for violation of these Terms. You may stop using the service at any time.',
        },
        {
          heading: '8. Changes to These Terms',
          body: 'We may update these Terms periodically. Continued use of the service after changes take effect constitutes acceptance of the revised Terms.',
        },
      ],
    },
    cookies: {
      title: 'Cookie Policy',
      intro:
        'This Cookie Policy explains how Talkys AI uses cookies and similar technologies on our website. By using the site, you agree to the use of cookies as described here.',
      sections: [
        {
          heading: '1. What Are Cookies',
          body: 'Cookies are small text files placed on your device when you visit a website. They help the site function correctly, remember your preferences, and understand how visitors use the site.',
        },
        {
          heading: '2. Types of Cookies We Use',
          body: 'Essential cookies are required for the site to operate. Preference cookies remember choices such as your language. Analytics cookies help us understand traffic patterns and improve the experience. We do not use cookies for advertising.',
        },
        {
          heading: '3. Managing Cookies',
          body: 'Most browsers let you block or delete cookies through their settings. Disabling essential cookies may affect site functionality. Refer to your browser documentation for instructions.',
        },
        {
          heading: '4. Third-Party Cookies',
          body: 'Some cookies may be set by trusted third parties (for example, analytics providers). Those providers process data under their own privacy policies.',
        },
        {
          heading: '5. Updates',
          body: 'We may update this Cookie Policy as our use of cookies evolves. The "Last updated" date above reflects the latest revision.',
        },
      ],
    },
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
  testimonials: {
    eyebrow: 'CUSTOMERS',
    titlePrefix: '1,200+ businesses pick Talkys',
    titleHighlight: 'every day',
    items: [
      {
        quote: 'Talkys booked 11 appointments overnight. Felt like hiring a receptionist that never sleeps.',
        name: 'Sarah Chen',
        role: 'Operations · Bright Smile Dental',
        initials: 'SC',
      },
      {
        quote: 'We capture 3x more after-hours leads. The ROI was clear in the first week.',
        name: 'Marcus Rivera',
        role: 'Founder · OakLaw Firm',
        initials: 'MR',
      },
      {
        quote: 'Setup took 8 minutes. By morning, we had booked our first showing — without anyone lifting a finger.',
        name: 'Jenna Diaz',
        role: 'Agent · NextClinic Realty',
        initials: 'JD',
      },
    ],
  },
  demo: {
    eyebrow: 'HEAR IT IN ACTION',
    titlePrefix: 'Voice or chat —',
    titleHighlight: 'we cover both.',
    subtitle:
      'Pick an industry, pick a channel. Talkys handles every call and every conversation, on every platform your customers use.',
    industryLabel: 'Choose industry',
    modeLabel: 'Choose interaction',
    voiceMode: 'Voice',
    chatMode: 'Chat',
    languageNote: 'Talks in any language, but understands all languages.',
    callerLabel: 'Sample Call',
    liveLabel: '● LIVE',
    transcriptPrompt: 'Press play to hear a real Talkys agent take this call.',
    playAria: 'Play sample call',
    pauseAria: 'Pause sample call',
    customIndustry: 'Your industry',
  },
} as const;

// Widen all leaf string literals to `string` so ar.ts can satisfy the type.
type Widen<T> = T extends readonly (infer U)[]
  ? Widen<U>[]
  : T extends object
  ? { [K in keyof T]: Widen<T[K]> }
  : T extends string
  ? string
  : T;

export type Translations = Widen<typeof EN_TRANSLATIONS>;
