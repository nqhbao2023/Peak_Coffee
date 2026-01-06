/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
