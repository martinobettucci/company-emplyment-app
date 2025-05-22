/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: "#2B6CB0",
          light: "#63B3ED",
          dark: "#2C5282"
        },
        accent: "#F59E42",
        success: "#38A169",
        warning: "#ECC94B",
        error: "#E53E3E"
      },
      boxShadow: {
        card: "0 4px 24px 0 rgba(34, 41, 47, 0.08)"
      }
    },
  },
  plugins: [],
}
