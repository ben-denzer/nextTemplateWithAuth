import Link from 'next/link';
import { LinkStyle } from './linkStyle';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  customClasses?: string;
}

const LinkWrapper: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Link href={props.href} className={LinkStyle(props.customClasses)}>
      {children}
    </Link>
  );
};

export default LinkWrapper;
