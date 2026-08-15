/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        // Same palette as the authority dashboard (frontend/neuron-sentinel/
        // tailwind.config.js) so the two apps read as one product, plus the
        // brand green matches the Neuron Sentinel logo.
        app: '#F1F4F9',
        surface: '#FFFFFF',
        'surface-alt': '#F7F9FC',
        border: '#E6EAF1',
        'text-primary': '#141B2C',
        'text-secondary': '#5B6576',
        'text-tertiary': '#96A1B3',
        brand: {
          DEFAULT: '#009E60',
          soft: '#E3F2ED',
          dark: '#00543E',
        },
        risk: {
          low: '#1E9E5A',
          'low-soft': '#E6F7EC',
          medium: '#EF8F1E',
          'medium-soft': '#FDF1DE',
          high: '#DC3B3B',
          'high-soft': '#FCE7E7',
          critical: '#9B1C1C',
          'critical-soft': '#F8DADA',
        },
        rain: '#3E8FDE',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
      },
      borderRadius: {
        xl2: '16px',
      },
    },
  },
  plugins: [],
};
