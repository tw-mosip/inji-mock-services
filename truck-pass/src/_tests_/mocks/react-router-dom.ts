import React from 'react';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    Link: ({ children, to, id }: { children: React.ReactNode; to: string; id?: string }) =>
      React.createElement('a', { href: to, id }, children),
    useNavigate: () => mockedNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

export { mockedNavigate };
