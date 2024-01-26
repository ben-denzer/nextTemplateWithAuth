'use client';
import { ToastContext } from '@/contexts/toastContext';
import { zSuccessResponse } from '@/models/responsePayloads/SuccessResponse';
import { ApiRoutes, PageRoutes } from '@/models/routes';
import fetchWrapper from '@/utils/fetchWrapper';
import getErrorMessage from '@/utils/getErrorMessage';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';

export const LogoutButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setError } = useContext(ToastContext);
  const router = useRouter();

  const logout = async () => {
    try {
      await fetchWrapper('POST', ApiRoutes.LOGOUT, null, {
        zResponseType: zSuccessResponse,
      });
      router.replace(PageRoutes.LOGIN);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return <div onClick={logout}>{children}</div>;
};
