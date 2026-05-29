/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(30, 41, 59, 0.08)',
        glow: '0 24px 70px rgba(79, 70, 229, 0.22)',
      },
      colors: {
        ink: '#111827',
        mist: '#f5f8ff',
        coral: '#ff6b7a',
      },
    },
  },
  plugins: [],
};
