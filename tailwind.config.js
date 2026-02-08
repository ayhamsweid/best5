/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif']
      },
      colors: {
        primary: '#22c55e',
        secondary: '#0f172a',
        accent: '#f0fdf4'
      }
    }
  },
  plugins: []
};
