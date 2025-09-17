/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: false, // Completely disable dark mode
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#6c757d',
      },
    },
  },
  plugins: [],
}
