import React from 'react';
import { _Modal } from './_Modal';
import Button from '../Button';
import classNames from '@/utils/frontend/classNames';

interface ModalProps {
  cancelButtonText?: string;
  cancelButtonRef: React.RefObject<HTMLButtonElement>;
  modalTitle: string;
  loading?: boolean;
  primaryButtonText?: string;
  shouldShowModal: boolean;
  singleButton?: boolean;
  primaryButtonDisabled?: boolean;
  primaryButtonClassnames?: string;
  HeadlessUiDialog: any;
  HeadlessUiTransition: any;
  XIcon: React.FC<React.ComponentProps<'svg'>>;
  disabledCallback?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  closeModal: () => void;
  primaryButtonCallback: () => void;
  children: React.ReactNode;
}

const buttonCustomClasses = 'h-8 my-1 mx-1';
const buttonCustomStyle: React.CSSProperties = { maxWidth: '10rem' };

const GenericModal: React.FC<ModalProps> = (props) => {
  const {
    closeModal,
    primaryButtonCallback,
    shouldShowModal,
    primaryButtonText,
    loading,
    cancelButtonText,
    cancelButtonRef,
    modalTitle,
    children,
    singleButton,
    primaryButtonDisabled,
    primaryButtonClassnames,
    disabledCallback,
    HeadlessUiDialog: Dialog,
    HeadlessUiTransition: Transition,
    XIcon,
  } = props;

  return (
    <_Modal
      cancelButtonRef={cancelButtonRef}
      shouldShowModal={shouldShowModal}
      HeadlessUiDialog={Dialog}
      HeadlessUiTransition={Transition}
      XIcon={XIcon}
      closeModal={closeModal}
    >
      <div className="sm:flex sm:items-start">
        <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
          <Dialog.Title
            as="h3"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            {modalTitle}
          </Dialog.Title>
          {children}
        </div>
      </div>
      <div className="mt-5 sm:mt-4 flex w-full justify-end">
        {singleButton ? null : (
          <Button
            buttonStyle="info"
            onClick={closeModal}
            customClasses={buttonCustomClasses}
            style={buttonCustomStyle}
          >
            {cancelButtonText || 'Cancel'}
          </Button>
        )}
        <Button
          buttonStyle="submit"
          loading={loading}
          disabled={primaryButtonDisabled}
          disabledCallback={disabledCallback}
          onClick={primaryButtonCallback}
          customClasses={classNames(
            buttonCustomClasses,
            primaryButtonClassnames || ''
          )}
          style={buttonCustomStyle}
        >
          {primaryButtonText || 'Ok'}
        </Button>
      </div>
    </_Modal>
  );
};

export { GenericModal };
