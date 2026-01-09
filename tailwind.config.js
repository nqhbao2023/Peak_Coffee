/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#F9F5F1',
          100: '#F0EBE5',
          200: '#E2D6C8',
          300: '#D1BFA8',
          400: '#BFA080',
          500: '#A6825D',
          600: '#8C6645',
          700: '#6B4C35',
          800: '#4E3629',
          900: '#36261F',
          950: '#1F1410',
        },
        brand: {
          red: '#C8102E', // Highlands Red style
          dark: '#5B0909',
        }
      },
      transitionDuration: {
        '150': '150ms',
      },
    },
  },
  plugins: [],
  // Disable unused CSS for smaller bundle
  corePlugins: {
    // Keep only what we need
  },
}
