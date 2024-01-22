import { v4 as uuid } from 'uuid';

export enum ToastType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ToastReducerProps {
  toastType: ToastType;
  headline: string;
  messageId: string;
}

export const toastMessagesReducer = (
  state: ToastReducerProps[],
  action: { type: 'ADD_ERROR' | 'ADD_SUCCESS' | 'REMOVE'; message?: string; messageId?: string }
) => {
  switch (action.type) {
    case 'ADD_ERROR':
      if (action.message) {
        const newMessage: ToastReducerProps = {
          toastType: ToastType.ERROR,
          headline: action.message,
          messageId: `E-${uuid()}`,
        };
        return [...state, newMessage];
      }
      return state;
    case 'ADD_SUCCESS':
      if (action.message) {
        const newMessage: ToastReducerProps = {
          toastType: ToastType.SUCCESS,
          headline: action.message,
          messageId: `S-${uuid()}`,
        };
        return [...state, newMessage];
      }
      return state;
    case 'REMOVE':
      if (action.messageId) {
        return state.filter((m) => m.messageId !== action.messageId);
      }
      // if no messageId, clear all
      return [];
    default:
      return state;
  }
};
