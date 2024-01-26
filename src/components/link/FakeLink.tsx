import classNames from '@/utils/classNames';
import { LinkStyle } from './linkStyle';

interface LinkProps {
  children: React.ReactNode;
  customClasses?: string;
}

export const FakeLink: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <span
      className={classNames(LinkStyle(props.customClasses), 'cursor-pointer')}
    >
      {children}
    </span>
  );
};
