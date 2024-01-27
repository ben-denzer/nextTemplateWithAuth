import { FieldErrors } from 'react-hook-form';

export const showFormError = <T>(
  formErrors: FieldErrors,
  setError: (msg: string) => void
) => {
  const formErrorKey = Object.keys(formErrors)[0] as keyof T;
  const formErrorMessage = formErrors[formErrorKey]?.message as string;
  if (formErrorMessage) {
    setError(formErrorMessage);
  }
};
