import React from 'react';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual, // Preserve any unmocked actual exports
    Link: ({ children, to, id }: { children: React.ReactNode; to: string; id?: string }) =>
      React.createElement('a', { href: to, id }, children),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});
