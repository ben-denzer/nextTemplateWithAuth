import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const primary = colors.sky;

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      ...colors,
      primary,
      'button-submit': primary[600],
      'button-submit-hover': primary[500],
      'button-submit-disabled': primary[400],
      link: primary[600],
      'link-hover': primary[500],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
