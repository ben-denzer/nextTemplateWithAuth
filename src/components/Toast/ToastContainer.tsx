import React from 'react';
import { SharedToast, SharedToastProps } from './SharedToast';
import IconType from '@/models/IconType';

interface ToastContainerProps {
  HeadlessUiTransition: any;
  CheckCircleIcon: IconType;
  ExclamationCircleIcon: IconType;
  XIcon: IconType;
  toastMessages: Partial<SharedToastProps>[];
  setToastMessages: React.Dispatch<{
    type: 'ADD_ERROR' | 'ADD_SUCCESS' | 'REMOVE';
    message?: string | undefined;
    messageId?: string | undefined;
  }>;
}

export const ToastContainer: React.FC<ToastContainerProps> = (props) => {
  const {
    HeadlessUiTransition: Transition,
    CheckCircleIcon,
    ExclamationCircleIcon,
    XIcon,
    toastMessages,
    setToastMessages,
  } = props;
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      {Boolean(toastMessages?.length) &&
        [...toastMessages].reverse().map((message) => {
          if (!message.toastType || !message.headline || !message.messageId) {
            return null;
          }
          return (
            <SharedToast
              key={message.messageId}
              showToast={true}
              messageId={message.messageId}
              toastType={message.toastType}
              headline={message.headline}
              closeToast={(messageId) => setToastMessages({ type: 'REMOVE', messageId })}
              HeadlessUiTransition={Transition}
              CheckCircleIcon={CheckCircleIcon}
              ExclamationCircleIcon={ExclamationCircleIcon}
              XIcon={XIcon}
            />
          );
        })}
    </div>
  );
};
