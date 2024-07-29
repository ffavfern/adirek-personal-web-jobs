/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        customtheme: {
          "primary": "#000000", 
          "secondary": "#ffffff", 
          "error": "#dc2626", 
        },
      },
    ],
  },
  
}