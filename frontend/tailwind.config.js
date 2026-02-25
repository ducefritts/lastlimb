/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        arcade: {
          black: '#0a0a0f',
          darker: '#0f0f1a',
          dark: '#1a1a2e',
          mid: '#16213e',
          blue: '#0f3460',
          cyan: '#00fff5',
          pink: '#ff006e',
          yellow: '#ffbe0b',
          green: '#06d6a0',
          purple: '#8338ec',
          red: '#ff4444',
          gem: '#00e5ff',
        }
      },
      animation: {
        'flicker': 'flicker 1.5s infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pixel-shake': 'pixelShake 0.3s steps(2) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: 1 },
          '20%, 24%, 55%': { opacity: 0.4 }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        glow: {
          from: { textShadow: '0 0 10px #00fff5, 0 0 20px #00fff5' },
          to: { textShadow: '0 0 20px #00fff5, 0 0 40px #00fff5, 0 0 80px #00fff5' }
        },
        pixelShake: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(2px, 0)' },
          '50%': { transform: 'translate(-2px, 0)' },
          '75%': { transform: 'translate(0, 2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
}
