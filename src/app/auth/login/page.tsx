'use client';
import LinkWrapper from '@/components/Link';
import AuthFormContainer from '@/components/form/AuthFormContainer';
import AuthFormHeader from '@/components/form/AuthFormHeader';
import { PageRoutes } from '@/models/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginRequest, zLoginRequest, LoginRequestFields } from '@/models/requestPayloads/LoginRequest';
import InputLabel from '@/components/form/input/InputLabel';
import RhfTextInputWithLabel from '@/components/form/input/RhfTextInputWithLabel';

const Login: React.FC = () => {
  type FormType = LoginRequest;
  const formSchema = zLoginRequest;

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const fieldNames: Record<keyof FormType, keyof FormType> = {
    email: 'email',
    password: 'password',
  };

  console.log({ formErrors });

  const onSubmit = (data: FormType) => {
    console.log(data);
    return;
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <AuthFormHeader pageTitle="Sign in to your account" />

        <AuthFormContainer>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <RhfTextInputWithLabel
              label="Email address"
              register={register}
              id={fieldNames.email}
              type="email"
              error={!!formErrors.email}
              required={true}
              autoComplete="email"
            />

            <RhfTextInputWithLabel
              label={
                <div className="flex items-center justify-between">
                  <InputLabel label="Password" id="password" required={true} />
                  <div className="text-sm">
                    <LinkWrapper href={PageRoutes.FORGOT_PASSWORD} customClasses="font-semibold">
                      Forgot password?
                    </LinkWrapper>
                  </div>
                </div>
              }
              register={register}
              id={fieldNames.password}
              type="password"
              error={!!formErrors.password}
              required={true}
              autoComplete="current-password"
            />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-button-submit px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-button-submit-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button-submit"
              >
                Sign in
              </button>
            </div>
          </form>
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
