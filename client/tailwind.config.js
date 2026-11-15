/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#070a12",
          900: "#0b101d",
          850: "#0e1424",
          800: "#131b2e",
          700: "#1a253e",
        },
        pulseGreen: {
          500: "#10b981",
          400: "#34d399",
          600: "#059669",
        },
        pulseCyan: {
          500: "#06b6d4",
          400: "#22d3ee",
          600: "#0891b2",
        },
      },
    },
  },
  plugins: [],
}
