import classNames from '@/utils/frontend/classNames';

export const LinkStyle = (customClasses?: string) => {
  const baseStyle = 'text-link hover:text-link-hover';
  return classNames(baseStyle, customClasses);
};
