/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kaios: {
          bg: '#E4E3E0',
          ink: '#141414',
          accent: '#F27D26',
        }
      }
    },
  },
  plugins: [],
}
