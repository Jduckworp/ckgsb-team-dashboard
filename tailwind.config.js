/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // CKGSB Visual Identity
        ckgsb: {
          blue: '#1495D9', // primary "sky blue"
          'blue-dark': '#0094D7',
          navy: '#041440', // dark brand base / app bar
          'navy-700': '#0a1f5c',
          orange: '#F99922', // accent / highlights
        },
      },
      fontFamily: {
        sans: ['DIN', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['DIN', 'Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
