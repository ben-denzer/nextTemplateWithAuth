import React, { Fragment } from 'react';
import { ToastType } from './toastMessagesReducer';

export interface SharedToastProps {
  toastType: ToastType;
  headline: React.ReactNode;
  lineTwo?: React.ReactNode;
  showToast: boolean;
  messageId: string;
  HeadlessUiTransition: any;
  CheckCircleIcon: React.FC<React.ComponentProps<'svg'>>;
  ExclamationCircleIcon: React.FC<React.ComponentProps<'svg'>>;
  XIcon: React.FC<React.ComponentProps<'svg'>>;
  closeToast: (messageId: string) => void;
}

export const SharedToast: React.FC<SharedToastProps> = (props) => {
  const {
    headline,
    lineTwo,
    showToast,
    toastType,
    closeToast,
    messageId,
    HeadlessUiTransition: Transition,
    CheckCircleIcon,
    ExclamationCircleIcon,
    XIcon,
  } = props;

  setTimeout(() => {
    closeToast(messageId);
  }, 7000);

  return (
    <>
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end mb-1 toast">
        {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
        <Transition
          show={showToast}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toastType === ToastType.SUCCESS && (
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  )}
                  {toastType === ToastType.ERROR && (
                    <ExclamationCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">{headline}</p>
                  {Boolean(lineTwo) && <p className="mt-1 text-sm text-gray-500">{lineTwo}</p>}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 closeToast"
                    onClick={() => closeToast(messageId)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
};
