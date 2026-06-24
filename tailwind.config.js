/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif']
      },
      colors: {
        primary: '#B11226',
        secondary: '#151515',
        accent: '#FFF1F1',
        gold: '#D99A24'
      }
    }
  },
  plugins: []
};
