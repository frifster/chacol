/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dungeon-dark': '#1a1a1a',
        'dungeon-light': '#2d2d2d',
        'dungeon-accent': '#8b4513',
        'dungeon-text': '#f5f5f5',
      },
      fontFamily: {
        'medieval': ['MedievalSharp', 'cursive'],
      },
    },
  },
  plugins: [],
} 