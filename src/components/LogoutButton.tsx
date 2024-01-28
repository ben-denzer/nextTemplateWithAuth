'use client';
import { ToastContext } from '@/contexts/toastContext';
import { zSuccessResponse } from '@/models/responsePayloads/SuccessResponse';
import { ApiRoutes, PageRoutes } from '@/models/routes';
import fetchWrapper from '@/utils/frontend/fetchWrapper';
import getErrorMessage from '@/utils/helpers/getErrorMessage';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { DangerModal } from './Modal/DangerModal';

export const LogoutButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showModal, setShowModal] = useState(false);
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

  return (
    <>
      <div onClick={() => setShowModal(true)}>{children}</div>
      <DangerModal
        shouldShowModal={showModal}
        modalTitle="Are you sure?"
        closeModal={() => setShowModal(false)}
        primaryButtonCallback={logout}
      />
    </>
  );
};
