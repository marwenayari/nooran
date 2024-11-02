import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ]
      },
      colors: {
        'dark-beige': '#f4ebe5',
        beige: '#fcf8f6'
      },
      backgroundImage: {
        cloud: "url('/cloudbg.jpg')"
      }
    }
  },
  plugins: []
} satisfies Config
