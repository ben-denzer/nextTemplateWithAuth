import { ToastType } from '../../models/ToastType';
import { toastMessagesReducer, ToastReducerProps } from './toastMessagesReducer';

it('should add an error message when empty', () => {
  const state: ToastReducerProps[] = [];
  const result = toastMessagesReducer(state, { type: 'ADD_ERROR', message: 'test' });
  expect(result).toEqual([
    {
      toastType: 'ERROR',
      headline: 'test',
      messageId: expect.any(String),
    },
  ]);
});

it('should add an error message when not empty', () => {
  const state: ToastReducerProps[] = [
    {
      toastType: ToastType.ERROR,
      headline: 'test',
      messageId: '123',
    },
  ];
  const result = toastMessagesReducer(state, { type: 'ADD_ERROR', message: 'test2' });
  expect(result).toEqual([
    {
      toastType: 'ERROR',
      headline: 'test',
      messageId: '123',
    },
    {
      toastType: 'ERROR',
      headline: 'test2',
      messageId: expect.any(String),
    },
  ]);
});

it('should ignore the update if message is empty - error', () => {
  const state: ToastReducerProps[] = [];
  const result = toastMessagesReducer(state, { type: 'ADD_ERROR' });
  expect(result).toEqual([]);
});

it('should add a success message when empty', () => {
  const state: ToastReducerProps[] = [];
  const result = toastMessagesReducer(state, { type: 'ADD_SUCCESS', message: 'test' });
  expect(result).toEqual([
    {
      toastType: 'SUCCESS',
      headline: 'test',
      messageId: expect.any(String),
    },
  ]);
});

it('should add a success message when not empty', () => {
  const state: ToastReducerProps[] = [
    {
      toastType: ToastType.ERROR,
      headline: 'test',
      messageId: '123',
    },
  ];
  const result = toastMessagesReducer(state, { type: 'ADD_SUCCESS', message: 'test2' });
  expect(result).toEqual([
    {
      toastType: 'ERROR',
      headline: 'test',
      messageId: '123',
    },
    {
      toastType: 'SUCCESS',
      headline: 'test2',
      messageId: expect.any(String),
    },
  ]);
});

it('should ignore the update if message is empty - success', () => {
  const state: ToastReducerProps[] = [];
  const result = toastMessagesReducer(state, { type: 'ADD_SUCCESS' });
  expect(result).toEqual([]);
});

it('should remove a message', () => {
  const state: ToastReducerProps[] = [
    {
      toastType: ToastType.ERROR,
      headline: 'test',
      messageId: '123',
    },
    {
      toastType: ToastType.SUCCESS,
      headline: 'test2',
      messageId: '456',
    },
  ];
  const result = toastMessagesReducer(state, { type: 'REMOVE', messageId: '123' });
  expect(result).toEqual([
    {
      toastType: 'SUCCESS',
      headline: 'test2',
      messageId: '456',
    },
  ]);
});

it('should remove all messages if no messageId passed', () => {
  const state: ToastReducerProps[] = [
    {
      toastType: ToastType.ERROR,
      headline: 'test',
      messageId: '123',
    },
    {
      toastType: ToastType.SUCCESS,
      headline: 'test2',
      messageId: '456',
    },
  ];
  const result = toastMessagesReducer(state, { type: 'REMOVE' });
  expect(result).toEqual([]);
});

it('should return the state if no action passed', () => {
  const state: ToastReducerProps[] = [
    {
      toastType: ToastType.ERROR,
      headline: 'test',
      messageId: '123',
    },
    {
      toastType: ToastType.SUCCESS,
      headline: 'test2',
      messageId: '456',
    },
  ];
  const result = toastMessagesReducer(state, { type: 'NOTHING' as any });
  expect(result).toEqual(state);
});
