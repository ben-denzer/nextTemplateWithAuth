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
      'button-submit-textcolor': colors.white,
      'button-info': colors.neutral[600],
      'button-info-hover': colors.neutral[500],
      'button-info-disabled': colors.neutral[400],
      'button-info-textcolor': colors.white,
      'button-danger': colors.red[600],
      'button-danger-hover': colors.red[500],
      'button-danger-disabled': colors.red[400],
      'button-danger-textcolor': colors.white,
      link: primary[600],
      'link-hover': primary[500],
      'link-disabled': primary[400],
      normaltext: colors.gray[900],
      lighttext: colors.gray[500],
      extralighttext: colors.gray[300],
      dangertext: colors.red[600],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
