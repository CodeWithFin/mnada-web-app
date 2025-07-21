/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          50: '#fef7f0',
          100: '#feeee0',
          200: '#fcd9c1',
          300: '#f9bf97',
          400: '#f59e6b',
          500: '#ff6b35', // Mnada orange
          600: '#e8581f',
          700: '#c1441a',
          800: '#9a3718',
          900: '#7c2e16',
        },
        gray: {
          50: '#f5f5f7',
          100: '#f0f0f0',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#86868b',
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#1d1d1f',
        },
        blue: {
          light: '#007aff',
          dark: '#0a84ff',
        },
        // Semantic colors
        success: {
          light: '#30d158',
          dark: '#32d74b',
        },
        warning: {
          light: '#ff9f0a',
          dark: '#ff9f0a',
        },
        error: {
          light: '#ff3b30',
          dark: '#ff453a',
        },
        // Surface colors
        surface: {
          light: '#ffffff',
          dark: '#000000',
        },
        card: {
          light: '#f5f5f7',
          dark: '#1c1c1e',
        },
        'card-elevated': {
          light: '#ffffff',
          dark: '#2c2c2e',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'apple': '8px',
        'apple-lg': '16px',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gentle-bounce': 'gentle-bounce 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'gentle-bounce': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'apple': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'apple-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
