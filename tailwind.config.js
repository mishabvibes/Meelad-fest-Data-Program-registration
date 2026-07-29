/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        night: '#0E3A2E',
        'night-deep': '#0A2A21',
        gold: '#C9A227',
        goldlight: '#F0D687',
        sand: '#F6EFDD',
        sandline: '#EAE0C8',
        ink: '#1B2420',
        rose: '#B5493B',
      },
      fontFamily: {
        display: ['var(--font-noto-serif-malayalam)', 'serif'],
        mal: ['var(--font-anek-malayalam)', 'sans-serif'],
        body: ['var(--font-anek-malayalam)', 'sans-serif'],
        anek: ['var(--font-anek-malayalam)', 'sans-serif'],
        'noto-serif-ml': ['var(--font-noto-serif-malayalam)', 'serif'],
      },
      borderRadius: {
        arch: '999px 999px 12px 12px',
      },
      boxShadow: {
        soft: '0 8px 30px -12px rgba(11,59,46,0.35)',
      },
      backgroundImage: {
        'star-pattern': "radial-gradient(circle at 1px 1px, rgba(201,162,39,0.35) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
}
