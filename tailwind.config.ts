import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

// not sure why they made this necessary, but need to remove warnings
delete (colors as any)['lightBlue'];
delete (colors as any)['warmGray'];
delete (colors as any)['trueGray'];
delete (colors as any)['coolGray'];
delete (colors as any)['blueGray'];

const primary = colors.sky;
const info = colors.neutral;
const danger = colors.red;
const text = colors.gray;

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
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      ...colors,
      primary,
      'button-submit': primary[600],
      'button-submit-hover': primary[500],
      'button-submit-disabled': primary[400],
      'button-submit-textcolor': colors.white,
      'button-info': info[600],
      'button-info-hover': info[500],
      'button-info-disabled': info[400],
      'button-info-textcolor': colors.white,
      'button-danger': danger[600],
      'button-danger-hover': danger[500],
      'button-danger-disabled': danger[400],
      'button-danger-textcolor': colors.white,
      link: primary[600],
      'link-hover': primary[500],
      'link-disabled': primary[400],
      normaltext: text[900],
      lighttext: text[500],
      extralighttext: text[300],
      dangertext: danger[600],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
