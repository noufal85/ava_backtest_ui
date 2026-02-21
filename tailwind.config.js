/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary, #0d1117)',
          secondary: 'var(--bg-secondary, #161b22)',
          tertiary: 'var(--bg-tertiary, #21262d)',
        },
        border: {
          primary: 'var(--border-primary, #30363d)',
          secondary: '#21262d',
          accent: 'var(--accent, #58a6ff)',
        },
        text: {
          primary: 'var(--text-primary, #f0f6fc)',
          secondary: 'var(--text-secondary, #8b949e)',
          muted: '#6e7681',
        },
        bull: 'var(--profit, #2ea043)',
        bear: 'var(--loss, #da3633)',
        accent: 'var(--accent, #58a6ff)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
