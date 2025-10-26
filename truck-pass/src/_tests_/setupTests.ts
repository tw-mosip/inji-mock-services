import { TextEncoder, TextDecoder } from 'text-encoding';
import '@testing-library/jest-dom';
import './mocks/i18n';
import '../_tests_/mocks/react-router-dom';

// Polyfill TextEncoder/Decoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock FileReader
// Mock FileReader with required static properties and correct types
class MockFileReader {
  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;

  public result: string | null = null;
  public onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  public onloadend: ((event: ProgressEvent<FileReader>) => void) | null = null;

  readAsText(file: { name: string }) {
    // Simulate async file reading
    Promise.resolve().then(() => {
      if (this.onload) {
        this.result = `data for ${file.name}`;
        this.onload({
          target: { result: this.result },
        } as ProgressEvent<FileReader>);
      }
    });
  }
}

global.FileReader = MockFileReader as any;

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Override global act to support both sync and async callbacks
import { act } from '@testing-library/react';

const originalAct = act;
(global as any).act = (callback: () => void | Promise<void>) => {
  return originalAct(async () => {
    await callback();
    // Flush microtasks and ensure all timers are processed
    await new Promise((resolve) => setImmediate(resolve));
    jest.runAllTimers(); // Process all pending timers
    await new Promise((resolve) => process.nextTick(resolve)); // Final microtask flush
  });
};