/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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