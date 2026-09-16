import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF6B00',
          50: '#FFF3E6',
          100: '#FFE0BF',
          200: '#FFCC99',
          300: '#FFB366',
          400: '#FF9933',
          500: '#FF6B00',
          600: '#E66000',
          700: '#CC5500',
          800: '#994000',
          900: '#662B00',
        },
        deepOrange: {
          DEFAULT: '#E85D04',
          50: '#FEF0E6',
          100: '#FBDABF',
          200: '#F8C299',
          300: '#F4A266',
          400: '#F07D30',
          500: '#E85D04',
          600: '#C95103',
          700: '#A94503',
          800: '#7A3202',
          900: '#4B1F01',
        },
        maroon: {
          DEFAULT: '#7B1B1B',
          50: '#F8EAEA',
          100: '#EDCACA',
          200: '#DFA0A0',
          300: '#CE6E6E',
          400: '#B84444',
          500: '#7B1B1B',
          600: '#6B1717',
          700: '#5A1313',
          800: '#440F0F',
          900: '#2D0A0A',
        },
        cream: {
          DEFAULT: '#FDF6EC',
          50: '#FFFFFF',
          100: '#FEFAF5',
          200: '#FDF6EC',
          300: '#FAE9D4',
          400: '#F5D8B2',
          500: '#EEC48A',
          600: '#E3A85C',
          700: '#D48730',
          800: '#A8671F',
          900: '#7A4C16',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FBF6E3',
          100: '#F5E9BB',
          200: '#EDD98E',
          300: '#E4C660',
          400: '#DAB93E',
          500: '#D4AF37',
          600: '#B8962A',
          700: '#9A7C1F',
          800: '#7A6118',
          900: '#584610',
        },
      },
      fontFamily: {
        devanagari: [
          'Noto Sans Devanagari',
          'Mangal',
          'Arial Unicode MS',
          'sans-serif',
        ],
        sans: [
          'Noto Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: [
          'Noto Serif Devanagari',
          'Noto Serif',
          'Georgia',
          'Cambria',
          'serif',
        ],
      },
      backgroundImage: {
        'devotional-gradient':
          'linear-gradient(135deg, #FF6B00 0%, #E85D04 50%, #7B1B1B 100%)',
        'saffron-gradient':
          'linear-gradient(180deg, #FF6B00 0%, #E85D04 100%)',
        'gold-gradient':
          'linear-gradient(135deg, #D4AF37 0%, #E85D04 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        devotional: '0 4px 24px rgba(255, 107, 0, 0.15)',
        'devotional-lg': '0 8px 48px rgba(255, 107, 0, 0.2)',
        gold: '0 4px 24px rgba(212, 175, 55, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
