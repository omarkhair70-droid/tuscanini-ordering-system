import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E10600',
          yellow: '#FFC700',
          white: '#FFFFFF',
          dark: '#171717',
          charcoal: '#262626',
        },
      },
      boxShadow: {
        punch: '0 10px 30px rgba(225, 6, 0, 0.2)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
