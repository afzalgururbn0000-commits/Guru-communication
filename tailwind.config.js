/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.{html,js}",
  ],
  theme: {
    extend: {
      maxWidth: {
        '7xl': '100%',
        '6xl': '100%',
        '5xl': '100%',
        '8xl': '100%',
      },
      colors: {
        dark: {
          900: '#0a0b0e',
          800: '#12141a',
          700: '#1a1d26',
          600: '#252936',
        },
        cyan: {
          glow: '#00f2fe',
          bright: '#4facfe',
        },
        electric: '#00d2ff',
        purple: {
          glow: '#7928ca',
          accent: '#9333ea',
        },
        orange: {
          glow: '#ff4e00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(121, 40, 202, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(255, 78, 0, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
