/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          background: '#ffffff',
          surface: '#f5f5f7',
          card: '#ffffff',
          text: {
            primary: '#1d1d1f',
            secondary: '#86868b',
          },
          border: '#d2d2d7',
        },
        // Dark mode colors
        dark: {
          background: '#000000',
          surface: '#1c1c1e',
          card: '#2c2c2e',
          text: {
            primary: '#ffffff',
            secondary: '#8e8e93',
          },
          border: '#38383a',
        },
        // Brand colors
        brand: {
          orange: {
            light: '#ff6b35',
            dark: '#ff7a47',
          },
          blue: {
            light: '#007aff',
            dark: '#0a84ff',
          },
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
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'apple': '8px',
        'apple-lg': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-2px)' },
          '70%': { transform: 'translateY(-1px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
