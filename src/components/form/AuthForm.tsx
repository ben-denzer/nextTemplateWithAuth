import classNames from '@/utils/classNames';

interface AuthFormProps {
  children: React.ReactNode;
  customClasses?: string;
}

const AuthForm: React.FC<AuthFormProps> = (props) => {
  const { children, customClasses } = props;

  return <form className={classNames('space-y-6', customClasses)}>{children}</form>;
};

export default AuthForm;
