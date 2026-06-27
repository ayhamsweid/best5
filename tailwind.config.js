/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './admin/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './routes/**/*.{ts,tsx}'
  ],
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
