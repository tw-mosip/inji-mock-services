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
    constructor() {
        Object.defineProperty(this, "result", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "onload", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "onloadend", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    readAsText(file) {
        // Simulate async file reading
        Promise.resolve().then(() => {
            if (this.onload) {
                this.result = `data for ${file.name}`;
                this.onload({
                    target: { result: this.result },
                });
            }
        });
    }
}
Object.defineProperty(MockFileReader, "EMPTY", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 0
});
Object.defineProperty(MockFileReader, "LOADING", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 1
});
Object.defineProperty(MockFileReader, "DONE", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 2
});
global.FileReader = MockFileReader;
// Clear mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
// Override global act to support both sync and async callbacks
import { act } from '@testing-library/react';
const originalAct = act;
global.act = (callback) => {
    return originalAct(async () => {
        await callback();
        // Flush microtasks and ensure all timers are processed
        await new Promise((resolve) => setImmediate(resolve));
        jest.runAllTimers(); // Process all pending timers
        await new Promise((resolve) => process.nextTick(resolve)); // Final microtask flush
    });
};
