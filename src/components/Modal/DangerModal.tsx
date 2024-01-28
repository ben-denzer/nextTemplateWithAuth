import React, { useRef } from 'react';
import { _Modal } from './_Modal';
import Button from '../Button';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  cancelButtonText?: string;
  modalTitle: string;
  modalCopy?: React.ReactNode;
  loading?: boolean;
  primaryButtonText?: string;
  shouldShowModal: boolean;
  primaryButtonId?: string;
  cancelButtonId?: string;
  closeModal: () => void;
  primaryButtonCallback: () => void;
}

const buttonCustomClasses = 'h-8 my-1 mx-1';
const buttonCustomStyle: React.CSSProperties = { maxWidth: '10rem' };

const DangerModal: React.FC<ModalProps> = (props) => {
  const {
    closeModal,
    primaryButtonCallback,
    shouldShowModal,
    primaryButtonText,
    loading,
    cancelButtonText,
    modalTitle,
    modalCopy,
    primaryButtonId,
    cancelButtonId,
  } = props;

  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <_Modal
        cancelButtonRef={cancelButtonRef}
        shouldShowModal={shouldShowModal}
        closeModal={closeModal}
      >
        <div className="sm:flex sm:items-center">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangleIcon
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              {modalTitle}
            </Dialog.Title>
            {modalCopy && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">{modalCopy}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 sm:mt-4 flex w-full justify-end">
          <Button
            buttonStyle="info"
            id={cancelButtonId}
            onClick={closeModal}
            customClasses={buttonCustomClasses}
            style={buttonCustomStyle}
          >
            {cancelButtonText || 'Cancel'}
          </Button>
          <Button
            buttonStyle="danger"
            id={primaryButtonId}
            loading={loading}
            onClick={primaryButtonCallback}
            customClasses={buttonCustomClasses}
            style={buttonCustomStyle}
          >
            {primaryButtonText || 'Ok'}
          </Button>
        </div>
      </_Modal>
    </>
  );
};

export { DangerModal };
