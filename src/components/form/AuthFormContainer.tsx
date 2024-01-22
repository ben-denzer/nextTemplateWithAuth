import classNames from '@/utils/classNames';

interface AuthFormContainerProps {
  children: React.ReactNode;
  customClasses?: string;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = (props) => {
  const { children, customClasses } = props;
  return <div className={classNames('mt-10 sm:mx-auto sm:w-full sm:max-w-sm', customClasses)}>{children}</div>;
};

export default AuthFormContainer;
