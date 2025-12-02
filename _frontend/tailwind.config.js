/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './src/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00C853',     // verde principal
          light: '#64DD17',       // verde claro vibrante
          dark: '#006B3F',        // verde médio escuro
          gradientStart: '#00C853',
          gradientMid: '#64DD17',
          gradientEnd: '#003B2E',
        },
        secondary: {
          DEFAULT: '#004D40',     // verde petróleo
          light: '#00695C',       // variante mais clara
          dark: '#003B2E',        // fundo profundo
        },
        accent: {
          DEFAULT: '#1B5E20',     // verde folha escuro
          light: '#2E7D32',       // verde folha médio
          dark: '#003B2E',        // quase preto esverdeado
        },
        success: {
          DEFAULT: '#64DD17',     // sucesso vibrante
          light: '#89E74F',       // sucesso claro
          dark: '#43A047',        // sucesso escuro
        },
        warning: {
          DEFAULT: '#FFD740',     // amarelo alerta
          light: '#FFE57F',
          dark: '#FFC400',
        },
        danger: {
          DEFAULT: '#E53935',
          light: '#EF5350',
          dark: '#C62828',
        },
        info: {
          DEFAULT: '#00897B',     // teal informativo
          light: '#26A69A',
          dark: '#00695C',
        },
        neutral: {
          light: '#F1FFF5',       // off-white frio
          DEFAULT: '#4E5D53',     // cinza esverdeado
          dark: '#1C2421',        // escuro neutro
        },
        warm: { // reutilizado para manter classes existentes -> paleta verde
          50: '#F1FFF5',
          100: '#E0F7E9',
          200: '#C8EFCF',
          300: '#A5E6B2',
          400: '#81DC93',
          500: '#00C853', // principal
          600: '#00A342',
          700: '#007D32',
          800: '#003B2E',
          900: '#001F17',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #00C853 0%, #64DD17 50%, #003B2E 100%)',
        'warm-gradient': 'linear-gradient(to bottom right, #F1FFF5, #C8EFCF)',
        'glow-gradient': 'radial-gradient(circle at center, rgba(0,200,83,0.35) 0%, transparent 70%)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      blur: {
        xs: '2px',
      },
      boxShadow: {
        'warm': '0 4px 14px 0 rgba(0, 200, 83, 0.15)',
        'warm-lg': '0 10px 40px 0 rgba(0, 200, 83, 0.25)',
        'glow': '0 0 25px rgba(100, 221, 23, 0.45)',
        'soft': '0 2px 8px 0 rgba(0,59,46,0.12)',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        gradient: 'gradient 8s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },

  plugins: [],
  darkMode: 'class',
};
