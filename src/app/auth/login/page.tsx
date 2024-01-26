'use client';
import AuthFormContainer from '@/components/form/AuthFormContainer';
import AuthFormHeader from '@/components/form/AuthFormHeader';
import { ApiRoutes, PageRoutes } from '@/models/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoginRequest,
  zLoginRequest,
} from '@/models/requestPayloads/auth/LoginRequest';
import { useContext, useState } from 'react';
import InputLabel from '@/components/form/input/InputLabel';
import RhfTextInputWithLabel from '@/components/form/input/RhfTextInputWithLabel';
import Button from '@/components/Button';
import fetchWrapper from '@/utils/fetchWrapper';
import { zSuccessResponse } from '@/models/responsePayloads/SuccessResponse';
import { ToastContext } from '@/contexts/toastContext';
import getErrorMessage from '@/utils/getErrorMessage';
import { useRouter } from 'next/navigation';
import LinkWrapper from '@/components/link/LinkWrapper';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setError, setSuccess } = useContext(ToastContext);
  const router = useRouter();

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

  const onSubmit = async (data: FormType) => {
    setLoading(true);
    try {
      await fetchWrapper('POST', ApiRoutes.LOGIN, data, {
        zRequestType: zLoginRequest,
        zResponseType: zSuccessResponse,
      });
      setSuccess('Successfully logged in!');
      router.push(PageRoutes.DASHBOARD);
    } catch (error) {
      setError(getErrorMessage(error));
      console.error(error);
    } finally {
      setLoading(false);
    }
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
                    <LinkWrapper
                      href={PageRoutes.FORGOT_PASSWORD}
                      customClasses="font-semibold"
                    >
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
              <Button
                buttonStyle="submit"
                type="submit"
                loading={loading}
                disabled={!!Object.keys(formErrors).length}
                disabledCallback={() => {}}
              >
                Sign in
              </Button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <LinkWrapper
              customClasses="font-semibold"
              href={PageRoutes.REGISTER}
            >
              Start a 14 day free trial
            </LinkWrapper>
          </p>
        </AuthFormContainer>
      </div>
    </>
  );
};

export default Login;
