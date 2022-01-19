import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchMediaMock from 'jest-matchmedia-mock';
import toast, { Toaster } from '../src';

let matchMedia: MatchMediaMock;

beforeAll(() => {
  matchMedia = new MatchMediaMock();
  matchMedia.useMediaQuery('(prefers-reduced-motion: reduce)');
});

afterAll(() => {
  matchMedia.destroy();
});

jest.useFakeTimers()

test('closes notification', async () => {
  render(
    <>
      <Toaster />
      <button
        type="button"
        onClick={() => {
          toast((t) => (
            <div>
              Example
              <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                title={'close'}
              >
                Close
              </button>
            </div>
          ));
        }}
      >
        Notify!
      </button>
    </>
  );
  userEvent.click(screen.getByRole('button', { name: /notify/i }));
  screen.getByText(/example/i);

  userEvent.click(screen.getByRole('button', { name: /close/i }));
  act(() => {
    jest.runAllTimers()
  })
  await waitForElementToBeRemoved(() => screen.queryByText(/example/i));
});
