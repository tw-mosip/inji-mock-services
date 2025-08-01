/** @type {import('tailwindcss').Config} */
export const content = [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}',
];

export const theme = {
  extend: {
    fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
  },
};

export const plugins = [];
