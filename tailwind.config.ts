import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Design system colors - limited palette with neutral backgrounds
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#2563eb', // blue-600
          hover: '#1d4ed8',   // blue-700
          light: '#dbeafe',   // blue-50
        },
        secondary: {
          DEFAULT: '#64748b', // slate-500
          hover: '#475569',   // slate-600
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          600: '#475569',
          700: '#334155',
          900: '#0f172a',
        },
      },
      // Type scale: 14, 16, 20, 24, 32
      fontSize: {
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],  // 14px
        'body': ['1rem', { lineHeight: '1.5' }],         // 16px
        'h3': ['1.25rem', { lineHeight: '1.4' }],        // 20px
        'h2': ['1.5rem', { lineHeight: '1.4' }],         // 24px
        'h1': ['2rem', { lineHeight: '1.3' }],           // 32px
      },
      // Font weights: regular (400), medium (500), bold (700)
      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700',
      },
      // Consistent border radius: 4px, 8px, 16px
      borderRadius: {
        'sm': '0.25rem',  // 4px
        'md': '0.5rem',   // 8px
        'lg': '1rem',     // 16px
      },
      // Minimal shadow system
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
      // Animation timing: 200-300ms, consistent easing
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Consistent transition timing
      transitionDuration: {
        DEFAULT: '200ms',
        '250': '250ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
};
export default config;
