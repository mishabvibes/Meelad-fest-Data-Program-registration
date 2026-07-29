/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        night: '#0B3B2E',      // deep emerald - primary
        nightdeep: '#072920',  // darker emerald for gradients
        gold: '#C9A227',       // brass/gold accent
        goldlight: '#E7C873',
        sand: '#FBF6EC',       // warm background
        sandline: '#EAE0C8',
        ink: '#1B2420',
        rose: '#B5493B',       // small accent for alerts (girls-only tags etc.)
      },
      fontFamily: {
        display: ['var(--font-amiri)', 'serif'],
        mal: ['var(--font-malayalam)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
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
