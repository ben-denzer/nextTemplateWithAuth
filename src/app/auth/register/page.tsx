'use client';
import AuthFormContainer from '@/components/form/AuthFormContainer';
import AuthFormHeader from '@/components/form/AuthFormHeader';
import { ApiRoutes, PageRoutes } from '@/models/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useEffect, useState } from 'react';
import RhfTextInputWithLabel from '@/components/form/input/RhfTextInputWithLabel';
import Button from '@/components/Button';
import fetchWrapper from '@/utils/frontend/fetchWrapper';
import {
  SuccessResponse,
  zSuccessResponse,
} from '@/models/responsePayloads/SuccessResponse';
import { ToastContext } from '@/contexts/toastContext';
import getErrorMessage from '@/utils/helpers/getErrorMessage';
import {
  SignupRequest,
  zSignupRequest,
} from '@/models/requestPayloads/auth/SignupRequest';
import { useRouter } from 'next/navigation';
import LinkWrapper from '@/components/link/LinkWrapper';
import { showFormError } from '@/utils/frontend/showFormError';

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setError, setSuccess } = useContext(ToastContext);
  const router = useRouter();

  type FormType = SignupRequest;
  const formSchema = zSignupRequest;

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setError: setFormError,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const fieldNames: Record<keyof FormType, keyof FormType> = {
    email: 'email',
    password: 'password',
    password2: 'password2',
  };

  const onSubmit = async (data: FormType) => {
    setLoading(true);
    try {
      const signupRes = await fetchWrapper<SuccessResponse>(
        'POST',
        ApiRoutes.REGISTER,
        data,
        {
          zRequestType: formSchema,
          zResponseType: zSuccessResponse,
        }
      );

      if (!signupRes.success) {
        if (signupRes.status === 409) {
          setError('Email already in use');
          setFormError(fieldNames.email, {
            type: 'manual',
            message: 'Email already in use',
          });
          return;
        }
        throw new Error(signupRes.displayMessage);
      }

      setSuccess('Success!');
      router.push(PageRoutes.DASHBOARD);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const displayFormError = () => {
    showFormError<FormType>(formErrors, setError);
  };

  useEffect(() => {
    displayFormError();
  }, [formErrors]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <AuthFormHeader pageTitle="Create account" />

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
              autoFocus={true}
            />

            <RhfTextInputWithLabel
              label="Password"
              register={register}
              id={fieldNames.password}
              type="password"
              error={!!formErrors.password}
              required={true}
            />

            <RhfTextInputWithLabel
              label="Confirm Password"
              register={register}
              id={fieldNames.password2}
              type="password"
              error={!!formErrors.password2}
              required={true}
            />

            <div>
              <Button
                buttonStyle="submit"
                type="submit"
                loading={loading}
                disabled={!!Object.keys(formErrors).length}
                disabledCallback={displayFormError}
              >
                Sign up
              </Button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <LinkWrapper customClasses="font-semibold" href={PageRoutes.LOGIN}>
              Log in
            </LinkWrapper>
          </p>
        </AuthFormContainer>
      </div>
    </>
  );
};

export default Signup;
