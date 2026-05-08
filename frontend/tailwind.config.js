/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-main)',
        card: 'var(--bg-card)',
        primary: {
          start: '#9333ea', // purple-600
          end: '#3b82f6',   // blue-500
        },
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
        },
        accent: {
          indigo: '#4f46e5',
          cyan: '#06b6d4',
        },
        border: {
          subtle: 'var(--border-subtle)',
        }
      }
    },
  },
  plugins: [],
}
