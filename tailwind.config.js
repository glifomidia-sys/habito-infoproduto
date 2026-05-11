/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Lumina light theme
        bg: {
          DEFAULT: '#f9fafb',
          card:    '#ffffff',
          sidebar: '#f3f4f6',
          hover:   '#f0f0f0',
        },
        border: {
          DEFAULT: '#e5e7eb',
          strong:  '#d1d5db',
        },
        text: {
          DEFAULT: '#111827',
          sub:     '#6b7280',
          muted:   '#9ca3af',
        },
        accent: {
          DEFAULT: '#10b981',
          light:   '#d1fae5',
          dark:    '#059669',
        },
        danger: {
          DEFAULT: '#ef4444',
          light:   '#fee2e2',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        sm:   '0 1px 2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}

