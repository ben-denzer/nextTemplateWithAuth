import classNames from '@/utils/frontend/classNames';
import SmallLogo from '../SmallLogo';

interface AuthFormHeaderProps {
  pageTitle: React.ReactNode;
  wrapperCustomClass?: string;
  textCustomClass?: string;
}

const AuthFormHeader: React.FC<AuthFormHeaderProps> = (props) => {
  const { pageTitle, wrapperCustomClass, textCustomClass } = props;

  return (
    <div
      className={classNames(
        'sm:mx-auto sm:w-full sm:max-w-sm',
        wrapperCustomClass
      )}
    >
      <SmallLogo customClasses="mx-auto h-10 w-auto" />
      <h2
        className={classNames(
          'mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900',
          textCustomClass
        )}
      >
        {pageTitle}
      </h2>
    </div>
  );
};

export default AuthFormHeader;
