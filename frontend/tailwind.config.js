/** @type {import('tailwindcss').Config} */

const systemFonts = [
  'sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Open Sans',
  'Helvetica Neue'
];

module.exports = {
  content: ['./src/**/**/*.{js,jsx,ts,tsx}', './public/*.html'],
  theme: {
    extend: {
      colors: {
        shark: '#1b1c1e',
        zircon: '#f1f6ff',
        'nile-blue-50': '#f4f7fb',
        'nile-blue-100': '#e8edf6',
        'nile-blue-200': '#ccdaeb',
        'nile-blue-300': '#9fbcda',
        'nile-blue-400': '#6c98c4',
        'nile-blue-500': '#497cae',
        'nile-blue-600': '#376292',
        'nile-blue-700': '#2d4f77',
        'nile-blue-800': '#294463',
        'nile-blue-900': '#263a53',
        'nile-blue-950': '#192638',
        'zircon-shade-1': '#f6f9fe'
      },
      borderRadius: { half: '50%' },
      fontFamily: { inter: ['Inter', ...systemFonts], ubuntu: ['Ubuntu', ...systemFonts] },
      screens: {
        'small-phones': { max: '340px' },
        phones: { max: '600px' },
        tablets: { max: '768px' },
        laptops: { max: '992px' },
        large: { max: '1200px' },
        'x-large': { max: '1440px' }
      }
    }
  },
  plugins: []
};
