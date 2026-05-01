/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          dark: '#e05e00',
          light: '#ff8c33',
          50: '#fff5eb',
          100: '#ffe6cc',
          200: '#ffcc99',
          300: '#ffb366',
          400: '#ff9933',
          500: '#FF6B00',
          600: '#e05e00',
          700: '#b84d00',
          800: '#8f3c00',
          900: '#662b00',
        },
        dark: {
          DEFAULT: '#0d0d0d',
          50: '#262626',
          100: '#1f1f1f',
          200: '#1a1a1a',
          300: '#161616',
          400: '#121212',
          500: '#0f0f0f',
          600: '#0d0d0d',
          700: '#0a0a0a',
          800: '#080808',
          900: '#050505',
        },
        surface: {
          DEFAULT: '#1a1a1a',
          light: '#222222',
          dark: '#141414',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 107, 0, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 107, 0, 0.4)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 107, 0, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
