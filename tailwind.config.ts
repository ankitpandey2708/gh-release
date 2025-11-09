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
      // Design system colors - gray scale + brand color (sky blue)
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Brand color - sky blue (#0ea5e9)
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        // Gray scale for most UI
        gray: {
          50: '#fafafa',
          200: '#e5e5e5',
          500: '#737373',
          600: '#525252',
          900: '#171717',
        },
        // Semantic colors
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      // Type scale from design spec: 12, 14, 16, 20, 24, 32, 48
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.6' }],     // 12px - captions, labels
        'sm': ['0.875rem', { lineHeight: '1.6' }],    // 14px - secondary text
        'base': ['1rem', { lineHeight: '1.6' }],      // 16px - body text
        'xl': ['1.25rem', { lineHeight: '1.2' }],     // 20px - small headings
        '2xl': ['1.5rem', { lineHeight: '1.2' }],     // 24px - medium headings
        '3xl': ['2rem', { lineHeight: '1.2' }],       // 32px - large headings
        '5xl': ['3rem', { lineHeight: '1.2' }],       // 48px - hero text
      },
      // Font weights: 400 (normal), 600 (semibold), 700 (bold)
      fontWeight: {
        normal: '400',
        semibold: '600',
        bold: '700',
      },
      // Border radius: 8px, 12px, 16px
      borderRadius: {
        'md': '0.5rem',   // 8px - buttons, inputs
        'lg': '0.75rem',  // 12px - cards
        'xl': '1rem',     // 16px - large containers
      },
      // Shadow system - 3 levels
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.05)',      // Subtle cards
        'md': '0 4px 6px rgba(0,0,0,0.1)',       // Default elevation
        'lg': '0 10px 15px rgba(0,0,0,0.1)',     // Hover state
      },
      // Animation timing: 150ms, 200ms, 300ms
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Consistent transition timing
      transitionDuration: {
        '150': '150ms',
        DEFAULT: '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
};
export default config;
