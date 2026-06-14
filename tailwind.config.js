/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'bg-soft': 'hsl(var(--bg-soft))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          soft: 'hsl(var(--accent-soft))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        teal: { DEFAULT: '#0e4f5c', light: '#156675' },
        coral: { DEFAULT: '#e57756', soft: '#f5a585' },
        cream: { DEFAULT: '#fdf9f5', soft: '#f7efe7' },
        navy: '#1a1f2e',
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      boxShadow: {
        tile: '0 18px 40px -10px rgba(14,79,92,0.14), 0 4px 12px -4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
        card: '0 14px 36px -14px rgba(14,79,92,0.18), 0 2px 8px -2px rgba(0,0,0,0.04)',
        'card-hover': '0 24px 50px -18px rgba(14,79,92,0.22)',
        coral: '0 12px 30px -10px rgba(229,119,86,0.55)',
        'coral-strong': '0 20px 50px -18px rgba(229,119,86,0.55)',
      },
      borderRadius: {
        'pill': '999px',
      },
      keyframes: {
        'bob-tile': {
          '0%,100%': { transform: 'rotate(var(--rot, 0deg)) translateY(0)' },
          '50%':     { transform: 'rotate(var(--rot, 0deg)) translateY(-8px)' },
        },
        'orb-breathe': {
          '0%,100%': { transform: 'translate(-50%, -50%) scale(1)' },
          '50%':     { transform: 'translate(-50%, -50%) scale(1.05)' },
        },
        'orb-ripple': {
          '0%':   { width: '120px', height: '120px', opacity: '0.6', borderWidth: '1.5px' },
          '100%': { width: '420px', height: '420px', opacity: '0',   borderWidth: '0.5px' },
        },
        'live-blink': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.4' },
        },
        'wave-pulse': {
          '0%,100%': { height: '10%', opacity: '0.55' },
          '50%':     { height: '95%', opacity: '1' },
        },
        'scroll-logos': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bubble-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0)    scale(1)' },
        },
        'bounce-soft': {
          '0%,100%': { transform: 'translateY(0)',   opacity: '0.7' },
          '50%':     { transform: 'translateY(6px)', opacity: '1' },
        },
        'mode-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0)    scale(1)' },
        },
      },
      animation: {
        'bob-tile': 'bob-tile 9s ease-in-out infinite',
        'orb-breathe': 'orb-breathe 3s ease-in-out infinite',
        'orb-ripple': 'orb-ripple 4s ease-out infinite',
        'live-blink': 'live-blink 2s ease-in-out infinite',
        'wave-pulse': 'wave-pulse 1.4s ease-in-out infinite',
        'scroll-logos': 'scroll-logos 30s linear infinite',
        'bubble-in': 'bubble-in 280ms ease-out both',
        'bounce-soft': 'bounce-soft 1.8s ease-in-out infinite',
        'mode-in': 'mode-in 320ms ease-out both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
