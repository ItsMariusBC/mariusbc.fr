/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        sparkle: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: 0 },
          '50%': { transform: 'scale(1) rotate(90deg)', opacity: 0.7 },
          '100%': { transform: 'scale(0) rotate(180deg)', opacity: 0 }
        }
      },
      animation: {
        sparkle: 'sparkle 1s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};