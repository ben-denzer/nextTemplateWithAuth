import LinkWrapper from '@/components/Link';
import AuthForm from '@/components/form/AuthForm';
import AuthFormContainer from '@/components/form/AuthFormContainer';
import AuthFormHeader from '@/components/form/AuthFormHeader';
import { PageRoutes } from '@/models/routes';

const Login: React.FC = () => {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <AuthFormHeader pageTitle="Sign in to your account" />

        <AuthFormContainer>
          <AuthForm>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <LinkWrapper href={PageRoutes.FORGOT_PASSWORD} customClasses="font-semibold">
                    Forgot password?
                  </LinkWrapper>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-button-submit px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-button-submit-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button-submit"
              >
                Sign in
              </button>
            </div>
          </AuthForm>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <LinkWrapper customClasses="font-semibold" href={PageRoutes.REGISTER}>
              Start a 14 day free trial
            </LinkWrapper>
          </p>
        </AuthFormContainer>
      </div>
    </>
  );
};

export default Login;
