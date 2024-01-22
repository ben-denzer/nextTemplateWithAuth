import Link from 'next/link';
import classNames from '@/utils/classNames';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  customClasses?: string;
}

const LinkWrapper: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Link href={props.href} className={classNames('text-link hover:text-link-hover', props.customClasses)}>
      {children}
    </Link>
  );
};

export default LinkWrapper;
