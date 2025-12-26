import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock TradingView global
global.window.TradingView = {
  widget: vi.fn(),
  MiniChart: vi.fn(),
};
