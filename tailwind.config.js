import daisyui from 'daisyui';

export default {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        customtheme: {
          primary: '#000000',
          secondary: '#ffffff',
          error: '#dc2626',
        },
      },
    ],
  },
  server: {
    open: true,
  },
};
