/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chatBg: "#0f0c20",
        cardBg: "rgba(22, 19, 44, 0.85)",
        primaryPurple: "#7c3aed",
        secondaryPurple: "#6d28d9",
        bubbleOutgoing: "#6366f1",
        bubbleIncoming: "#1e1b38",
      },
    },
  },
  plugins: [],
}
