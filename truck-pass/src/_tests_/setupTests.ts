import { TextEncoder, TextDecoder } from 'text-encoding';
import '@testing-library/jest-dom';
import '../_tests_/mocks/i18n';
import '../_tests_/mocks/react-router-dom';

// Polyfill TextEncoder/Decoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock FileReader
global.FileReader = jest.fn(() => {
  const mockReader = {
    readAsText: jest.fn((file) => {
      console.log('Mock FileReader reading:', file.name);
      Promise.resolve().then(() => {
        if (mockReader.onload) {
          mockReader.onload({
            target: { result: `data for ${file.name}` },
          } as ProgressEvent<FileReader>);
        }
      });
    }),
    onload: null,
    onloadend: null,
    result: null,
  };
  return mockReader as any;
});

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Override global act to support both sync and async callbacks
import { act } from '@testing-library/react';

const originalAct = act;
global.act = (callback: () => void | Promise<void>) => {
  return originalAct(async () => {
    await callback();
    // Flush microtasks and ensure all timers are processed
    await new Promise((resolve) => setImmediate(resolve));
    jest.runAllTimers(); // Process all pending timers
    await new Promise((resolve) => process.nextTick(resolve)); // Final microtask flush
  });
};