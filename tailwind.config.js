/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d5fd',
          300: '#a5b8fb',
          400: '#8194f8',
          500: '#6270f3',
          600: '#4d53e8',
          700: '#4040cf',
          800: '#3636a7',
          900: '#313284',
        },
        danger:  { DEFAULT: '#ef4444', light: '#fef2f2' },
        warning: { DEFAULT: '#f59e0b', light: '#fffbeb' },
        success: { DEFAULT: '#10b981', light: '#ecfdf5' },
      },
      fontFamily: {
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        display: ['"Syne"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-in':     'slideIn 0.4s ease-out',
        'fade-up':      'fadeUp 0.5s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%':   { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        fadeUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
