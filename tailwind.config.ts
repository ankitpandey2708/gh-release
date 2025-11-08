import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Override default spacing to enforce 8px scale (Design Spec A.1)
    spacing: {
      '0': '0',
      '0.5': '0.25rem',   // 4px - for fine adjustments
      '1': '0.5rem',      // 8px
      '2': '1rem',        // 16px
      '3': '1.5rem',      // 24px
      '4': '2rem',        // 32px
      '5': '2.5rem',      // 40px
      '6': '3rem',        // 48px
      '7': '3.5rem',      // 56px
      '8': '4rem',        // 64px
      '10': '5rem',       // 80px
      '12': '6rem',       // 96px
      '16': '8rem',       // 128px
      '20': '10rem',      // 160px
      '24': '12rem',      // 192px
    },
    extend: {
      // Design system colors - limited palette with neutral backgrounds (Design Spec C.1-2)
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#2563eb', // blue-600 - primary actions
          hover: '#1d4ed8',   // blue-700 - hover state
          light: '#dbeafe',   // blue-50 - subtle backgrounds
          dark: '#1e40af',    // blue-800 - high contrast
        },
        secondary: {
          DEFAULT: '#64748b', // slate-500 - secondary actions
          hover: '#475569',   // slate-600 - hover state
          light: '#f1f5f9',   // slate-100 - subtle backgrounds
        },
        neutral: {
          50: '#f8fafc',      // lightest background
          100: '#f1f5f9',     // subtle backgrounds
          200: '#e2e8f0',     // borders, dividers
          300: '#cbd5e1',     // stronger borders
          400: '#94a3b8',     // disabled text
          500: '#64748b',     // secondary text
          600: '#475569',     // body text
          700: '#334155',     // emphasized text
          800: '#1e293b',     // headings
          900: '#0f172a',     // highest contrast
        },
        success: {
          DEFAULT: '#16a34a', // green-600
          light: '#dcfce7',   // green-50
        },
        error: {
          DEFAULT: '#dc2626', // red-600
          light: '#fef2f2',   // red-50
          dark: '#991b1b',    // red-800
        },
        warning: {
          DEFAULT: '#ea580c', // orange-600
          light: '#fff7ed',   // orange-50
        },
      },
      // Type scale: 14, 16, 20, 24, 32 (Design Spec B.2)
      // Line height: 1.4-1.6 for body (Design Spec B.4)
      fontSize: {
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],  // 14px
        'body': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],         // 16px - base
        'h3': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],  // 20px
        'h2': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],   // 24px
        'h1': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],     // 32px
      },
      // Font weights: regular (400), medium (500), bold (700) (Design Spec B.1)
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      // Consistent border radius: 4px, 8px, 16px (Design Spec E.3-4)
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',  // 4px - small elements
        'md': '0.5rem',   // 8px - default
        'lg': '1rem',     // 16px - large cards
        'full': '9999px', // pills, avatars
      },
      // Minimal shadow system with consistent direction (Design Spec E.5)
      boxShadow: {
        'none': 'none',
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',           // subtle depth
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',         // default cards
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',       // elevated elements
        'focus': '0 0 0 3px rgb(37 99 235 / 0.1)',       // focus rings
      },
      // Border width consistency (Design Spec E.2)
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
      },
      // Animation timing: 200-300ms, consistent easing (Design Spec I.1-3)
      animation: {
        fadeIn: 'fadeIn 300ms ease-out',
        slideUp: 'slideUp 200ms ease-out',
        slideDown: 'slideDown 200ms ease-out',
        scaleIn: 'scaleIn 200ms ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      // Consistent transition timing (Design Spec I.1)
      transitionDuration: {
        DEFAULT: '200ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
      // Consistent easing (Design Spec I.3)
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Max width for text content (Design Spec B.5)
      maxWidth: {
        'prose': '65ch',  // 45-75 characters per line
      },
    },
  },
  plugins: [],
};
export default config;
