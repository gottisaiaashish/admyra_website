/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        card: '#111827',
        primary: {
          start: '#9333ea', // purple-600
          end: '#3b82f6',   // blue-500
        },
        text: {
          main: '#ffffff',
          muted: '#d1d5db', // gray-300
        },
        accent: {
          indigo: '#4f46e5',
          cyan: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}
