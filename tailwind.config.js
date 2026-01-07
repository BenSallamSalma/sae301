/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html.twig",
    "./assets/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs de navigation
        'nav-bg': '#2E2D3F',
        'nav-hover': '#007bff',
        'nav-border': '#e0e0e0',
        // Couleurs de footer
        'footer-bg': '#2c3e50',
        'footer-text': '#ecf0f1',
        'footer-link': '#bdc3c7',
        'footer-link-hover': '#3498db',
        'footer-heading': '#ffffff',
        'footer-border': '#34495e',
      },
      screens: {
        'xs': '480px',
        'sm': '768px',
        'md': '992px',
        'lg': '1200px',
        'xl': '1400px',
      },
      fontSize: {
        'base': '16px',
        'base-mobile': '14px',
        'base-xs': '13px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideDown': 'slideDown 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          'from': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}

