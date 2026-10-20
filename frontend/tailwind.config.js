/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        important: '#ef4444',
        normal: '#3b82f6',
        faible: '#6b7280',
      },
    },
  },
  plugins: [],
};
