'use client';
import AuthFormContainer from '@/components/form/AuthFormContainer';
import AuthFormHeader from '@/components/form/AuthFormHeader';
import { ApiRoutes, PageRoutes } from '@/models/routes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useContext, useEffect, useState } from 'react';
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
import { EmailOnly, zEmailOnly } from '@/models/requestPayloads/auth/EmailOnly';
import { wait } from '@/utils/helpers/wait';
import { showFormError } from '@/utils/frontend/showFormError';
import { LogMetadata } from '@/models/LogInfo';
import { ClientLogger } from '@/utils/logger/ClientLogger';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setError, setSuccess } = useContext(ToastContext);
  const router = useRouter();

  type FormType = EmailOnly;
  const formSchema = zEmailOnly;

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const fieldNames: Record<keyof FormType, keyof FormType> = {
    email: 'email',
  };

  const onSubmit = async (data: FormType) => {
    const method = 'app/auth/forgotPassword - onSubmit';
    const metadata: LogMetadata = { email: data.email };
    setLoading(true);
    try {
      const res = await fetchWrapper<SuccessResponse>(
        'POST',
        ApiRoutes.FORGOT_PASSWORD,
        data,
        {
          zRequestType: formSchema,
          zResponseType: zSuccessResponse,
        }
      );

      if (!res.success) {
        throw new Error(res.displayMessage);
      }

      setSuccess('Success! Check your inbox for a reset link.');
      await wait(3);
      router.push(PageRoutes.LOGIN);
    } catch (error) {
      ClientLogger.error(method, 'form submit failed', error, metadata);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const displayFormError = useCallback(() => {
    showFormError<FormType>(formErrors, setError);
  }, [formErrors, setError]);

  useEffect(() => {
    displayFormError();
  }, [formErrors, displayFormError]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <AuthFormHeader pageTitle="Forgot password" />

        <AuthFormContainer>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <RhfTextInputWithLabel
              autoFocus={true}
              label="Email address"
              register={register}
              id={fieldNames.email}
              type="email"
              error={!!formErrors.email}
              required={true}
              autoComplete="email"
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

export default ForgotPassword;
