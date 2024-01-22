import { createContext } from 'react';

export const ToastContext = createContext<{
  setSuccess: (msg: string) => void;
  setError: (msg: string) => void;
}>({ setSuccess: () => null, setError: () => null });
