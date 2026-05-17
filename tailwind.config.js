/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950:'#0a0806', 900:'#13100c', 800:'#1c1812', 700:'#2a2419', 600:'#3d3424' },
        gold: { 100:'#fef3c7', 200:'#fde68a', 300:'#fcd34d', 400:'#fbbf24', 500:'#d4a548', 600:'#b8893a', 700:'#92691f', 800:'#704d10' },
      },
      fontFamily: {
        display: ['Cinzel','serif'],
        serif: ['"Cormorant Garamond"','Georgia','serif'],
        sans: ['Manrope','system-ui','sans-serif'],
      },
      boxShadow: {
        'gold-soft': '0 0 0 1px rgba(212,165,72,0.15), 0 8px 32px -8px rgba(212,165,72,0.25)',
        'gold-glow': '0 0 0 1px rgba(212,165,72,0.4), 0 0 40px -8px rgba(212,165,72,0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fcd34d 0%, #d4a548 45%, #b8893a 100%)',
      },
    },
  },
  plugins: [],
}
