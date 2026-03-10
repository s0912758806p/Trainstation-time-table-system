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
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        sidebar: {
          bg:     '#0f172a',
          border: 'rgba(255, 255, 255, 0.06)',
          muted:  '#64748b',
          text:   '#cbd5e1',
          active: '#818cf8',
        },
        surface: {
          DEFAULT: '#f1f5f9',
          card:    '#ffffff',
          hover:   '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', '-apple-system', 'BlinkMacSystemFont', 'PingFang TC', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        'card-hover': '0 4px 12px rgba(15,23,42,0.10), 0 2px 4px rgba(15,23,42,0.06)',
        'brand': '0 2px 6px rgba(99,102,241,0.35)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
