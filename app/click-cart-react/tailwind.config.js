/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#F7931E',
        accent: '#FFD23F',
        neutral: '#2B2B2B',
        'base-100': '#FFFFFF',
      },
    },
  },
  plugins: [],
} 