'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { useCallback, useReducer } from 'react';
import { toastMessagesReducer } from '@/components/Toast/toastMessagesReducer';
import { ToastContext } from '@/contexts/toastContext';
import { ToastContainer } from '@/components/Toast/ToastContainer';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'BD Starter',
//   description: 'Add your description here',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [toastMessages, setToastMessages] = useReducer(toastMessagesReducer, []);

  const setError = useCallback((message: string) => {
    setToastMessages({ type: 'ADD_ERROR', message });
  }, []);

  const setSuccess = useCallback((message: string) => {
    setToastMessages({ type: 'ADD_SUCCESS', message });
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContext.Provider value={{ setError, setSuccess }}>
          {children}
          <ToastContainer
            HeadlessUiTransition={Transition}
            CheckCircleIcon={CheckCircleIcon}
            ExclamationCircleIcon={ExclamationCircleIcon}
            XIcon={XCircleIcon}
            toastMessages={toastMessages}
            setToastMessages={setToastMessages}
          />
        </ToastContext.Provider>
      </body>
    </html>
  );
}
