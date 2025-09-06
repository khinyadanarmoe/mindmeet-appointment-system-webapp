/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8c95c5',
        secondary: '#6B7280',
        accent: '#10B981',
        background: '#F3F4F6',
        text: '#111827',
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))',
      },
    },
  },
  plugins: [],
}

