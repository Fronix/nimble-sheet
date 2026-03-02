/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        parchment: '#F5E6C8',
        'parchment-dark': '#E0CFA0',
        'parchment-border': '#C4A96A',
        stone: '#1A1A2E',
        'stone-mid': '#2D2D44',
        'stone-light': '#3D3D58',
        gold: '#C9A84C',
        'gold-light': '#F0C97A',
        'gold-dark': '#9B7A28',
        crimson: '#8B1A1A',
        'crimson-light': '#C23535',
        'ink-dark': '#1C1008',
        'ink-mid': '#4A3728',
        'ink-light': '#7A6050',
        'mana-blue': '#4A7FBF',
        'mana-light': '#7AAAD6',
        'hp-green': '#3D7A3D',
        'hp-light': '#5FA85F',
        wound: '#8B1A1A',
        accent: '#C9A84C',
      },
      fontFamily: {
        cinzel: ['CinzelDecorative-Regular'],
        'cinzel-bold': ['CinzelDecorative-Bold'],
        fell: ['IMFellEnglish-Regular'],
        'fell-italic': ['IMFellEnglish-Italic'],
      },
    },
  },
  plugins: [],
};
