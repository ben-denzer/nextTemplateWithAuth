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
import { useRouter } from 'next/navigation';
import {
  ResetPasswordForm,
  zResetPasswordForm,
  zResetPasswordPayload,
} from '@/models/requestPayloads/auth/ResetPassword';
import { getQueryParam } from '@/utils/frontend/getQueryParam';
import { showFormError } from '@/utils/frontend/showFormError';
import { LogMetadata } from '@/models/LogInfo';
import { ClientLogger } from '@/utils/logger/ClientLogger';

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setError, setSuccess } = useContext(ToastContext);
  const router = useRouter();

  type FormType = ResetPasswordForm;
  const formSchema = zResetPasswordForm;

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const email = getQueryParam('email');
    if (email) {
      setValue('email', email);
    }
  }, []);

  const fieldNames: Record<keyof FormType, keyof FormType> = {
    email: 'email',
    password: 'password',
    password2: 'password2',
  };

  const onSubmit = async (formData: FormType) => {
    const method = 'app/auth/resetPassword - onSubmit';
    const metadata: LogMetadata = { email: formData.email };
    setLoading(true);
    const token = getQueryParam('token');
    const payload = { ...formData, token };
    try {
      const res = await fetchWrapper<SuccessResponse>(
        'POST',
        ApiRoutes.PASSWORD_RESET,
        payload,
        {
          zRequestType: zResetPasswordPayload,
          zResponseType: zSuccessResponse,
        }
      );

      if (!res.success) {
        throw new Error(res.displayMessage);
      }

      setSuccess('Success!');
      router.push(PageRoutes.DASHBOARD);
    } catch (error) {
      ClientLogger.error(method, 'form submit failed', error, metadata);
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
        <AuthFormHeader pageTitle="Reset password" />

        <AuthFormContainer>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <RhfTextInputWithLabel
              label="Email address"
              register={register}
              id={fieldNames.email}
              type="email"
              error={!!formErrors.email}
              required={true}
              disabled={true}
            />

            <RhfTextInputWithLabel
              autoFocus={true}
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
                Submit
              </Button>
            </div>
          </form>
        </AuthFormContainer>
      </div>
    </>
  );
};

export default ResetPassword;
