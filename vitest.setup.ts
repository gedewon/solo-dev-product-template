import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Test files import from 'vitest' explicitly (no `test.globals`), so Testing
// Library's automatic cleanup never registers. Do it here.
afterEach(() => {
  cleanup();
});

// jsdom has no matchMedia. Anything that reads the system theme or
// prefers-reduced-motion needs it to exist.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
