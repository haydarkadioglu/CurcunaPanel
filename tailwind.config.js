/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f0ff',
          pink: '#ff00ff',
          purple: '#9d00ff',
          cyan: '#00ffff',
          green: '#00ff88',
        },
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'glitch-2': 'glitch-2 1s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 4s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'glitch-2': {
          '0%, 100%': { 
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)',
          },
          '25%': { 
            transform: 'translate(-2px, 2px)',
            filter: 'hue-rotate(30deg)',
          },
          '50%': { 
            transform: 'translate(2px, -2px)',
            filter: 'hue-rotate(60deg)',
          },
          '75%': { 
            transform: 'translate(-2px, -2px)',
            filter: 'hue-rotate(30deg)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-neon': {
          '0%, 100%': { 
            opacity: 1,
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '50%': { 
            opacity: 0.9,
            textShadow: '0 0 4px currentColor, 0 0 8px currentColor, 0 0 12px currentColor',
          },
        },
      },
    },
  },
  plugins: [],
}

