/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Palette
        'dd-navy': '#0E113C',
        'dd-navy-light': '#181C54',
        'dd-navy-dark': '#070926',
        'dd-navy-tint': '#EEF0F8',
        'dd-amber': '#FBA920',
        'dd-amber-hover': '#E0910E',
        'dd-amber-light': '#FFF8EB',
        'dd-amber-tint': 'rgba(251, 169, 32, 0.12)',
        
        // Mapped Palette
        'dd-black': '#0E113C',
        'dd-dark': '#070926',
        'dd-sidebar': '#0E113C',
        'dd-secondary-black': '#181C54',
        'dd-card-dark': '#141847',
        'dd-bg': '#F6F8FB',
        'dd-light-gray': '#EEF0F8',
        'dd-border': '#E2E8F0',
        'dd-primary-text': '#0E113C',
        'dd-secondary-text': '#5A627A',
        'dd-muted-text': '#94A3B8',

        // Direct Utility Tokens
        navy: {
          DEFAULT: '#0E113C',
          50: '#F0F2FA',
          100: '#EEF0F8',
          200: '#D5DAEE',
          300: '#9EABD8',
          700: '#181C54',
          800: '#111545',
          900: '#0E113C',
          950: '#070926',
        },
        amber: {
          DEFAULT: '#FBA920',
          hover: '#E0910E',
          light: '#FFF8EB',
          50: '#FFFDF9',
          100: '#FFF8EB',
          200: '#FEECC7',
          400: '#FBA920',
          500: '#E0910E',
          600: '#C77D06',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'dd-card': '0 1px 3px rgba(14, 17, 60, 0.05), 0 1px 2px rgba(14, 17, 60, 0.03)',
        'dd-elevated': '0 10px 25px -3px rgba(14, 17, 60, 0.08), 0 4px 6px -4px rgba(14, 17, 60, 0.04)',
        'dd-amber': '0 4px 14px 0 rgba(251, 169, 32, 0.35)',
      }
    },
  },
  plugins: [],
}
