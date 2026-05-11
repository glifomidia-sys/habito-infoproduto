/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        // Midnight Forge theme
        bg: {
          DEFAULT: '#07070a',
          card:    '#0d0d14',
          alt:     '#131319',
          sidebar: '#090910',
          hover:   '#1a1a24',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          strong:  'rgba(255,255,255,0.12)',
          accent:  'rgba(245,158,11,0.25)',
        },
        text: {
          DEFAULT: '#f0f0f5',
          sub:     '#9898b0',
          muted:   '#4a4a60',
        },
        accent: {
          DEFAULT: '#f59e0b',
          light:   'rgba(245,158,11,0.10)',
          glow:    'rgba(245,158,11,0.18)',
          dark:    '#d97706',
        },
        danger: {
          DEFAULT: '#f87171',
          light:   'rgba(248,113,113,0.10)',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.35s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'shimmer':    'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(245,158,11,0.25)' },
          '50%':      { boxShadow: '0 0 40px rgba(245,158,11,0.55)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'card':       '0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-depth': '0 2px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        'sm':         '0 1px 2px rgba(0,0,0,0.4)',
        'glow-sm':    '0 0 16px rgba(245,158,11,0.20)',
        'glow-md':    '0 0 32px rgba(245,158,11,0.35)',
        'glow-lg':    '0 0 60px rgba(245,158,11,0.45)',
        'glow-gold':  '0 0 40px rgba(251,191,36,0.50)',
      },
    },
  },
  plugins: [],
}
