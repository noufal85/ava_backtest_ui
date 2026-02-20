/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { primary: '#0d1117', secondary: '#161b22', tertiary: '#21262d' },
        border: { primary: '#30363d', secondary: '#21262d', accent: '#58a6ff' },
        text: { primary: '#f0f6fc', secondary: '#8b949e', muted: '#6e7681' },
        bull: '#2ea043',
        bear: '#da3633',
        accent: '#58a6ff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
