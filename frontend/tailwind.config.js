/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkRed: "#991b1b",
          red: "#dc2626",
          yellow: "#f59e0b",
          amber: "#d97706",
          dark: "#0f172a"
        }
      }
    },
  },
  plugins: [],
}