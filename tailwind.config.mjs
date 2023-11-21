const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        'green-light': {
          extend: 'light',
          colors: {
            background: '#F0FFF4',
            foreground: '#000000',
            primary: {
              50: '#E7F3E7',
              100: '#CCE6CC',
              200: '#99CC99',
              300: '#65B365',
              400: '#448844',
              500: '#2B572B',
              600: '#224422',
              700: '#193319',
              800: '#112211',
              900: '#081108',
              950: '#050A05',
              DEFAULT: '#2B572B',
              foreground: '#ffffff'
            },
            focus: '#7FE8B7'
          },
          layout: {
            disabledOpacity: '0.3',
            radius: {
              small: '4px',
              medium: '6px',
              large: '8px'
            },
            borderWidth: {
              small: '1px',
              medium: '2px',
              large: '3px'
            }
          }
        }
      }
    })
  ]
};
