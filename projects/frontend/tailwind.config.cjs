/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: "#8b5cf6",
        "background-dark": "#050505",
        "card-dark": "#000000",
        "sidebar-dark": "#0a0a0a",
        "border-dark": "#1f1f1f",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        'lg': '0.375rem',
        'xl': '0.5rem',
      },
    },
  },
  daisyui: {
    themes: ['lofi'],
    logs: false,
  },
  plugins: [require('daisyui')],
}
