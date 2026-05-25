/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        showroom: {
          950: '#05070d',
          900: '#08111f',
          800: '#0c192e',
          700: '#10243f'
        },
        neon: {
          blue: '#2ed3ff',
          cyan: '#5ff7ff',
          violet: '#8b5cf6'
        }
      },
      boxShadow: {
        glow: '0 0 35px rgba(46, 211, 255, 0.22)',
        panel: '0 20px 70px rgba(0, 0, 0, 0.35)'
      },
      backgroundImage: {
        'showroom-grid':
          'linear-gradient(rgba(95,247,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(95,247,255,.08) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
