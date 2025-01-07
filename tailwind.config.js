/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'border-flow': 'border-flow 8s ease-in-out infinite',
      },
      keyframes: {
        'border-flow': {
          '0%, 100%': {
            'border-color': '#FFD700',
            'border-width': '3px',
            'box-shadow': '0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 8px rgba(255, 215, 0, 0.2)',
          },
          '25%': {
            'border-color': '#FF6B6B',
            'border-width': '3px',
            'box-shadow': '0 0 20px rgba(255, 107, 107, 0.3), inset 0 0 8px rgba(255, 107, 107, 0.2)',
          },
          '50%': {
            'border-color': '#4ECDC4',
            'border-width': '3px',
            'box-shadow': '0 0 20px rgba(78, 205, 196, 0.3), inset 0 0 8px rgba(78, 205, 196, 0.2)',
          },
          '75%': {
            'border-color': '#9D50BB',
            'border-width': '3px',
            'box-shadow': '0 0 20px rgba(157, 80, 187, 0.3), inset 0 0 8px rgba(157, 80, 187, 0.2)',
          }
        }
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}