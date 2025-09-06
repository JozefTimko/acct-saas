import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['tests/setup.env.ts'],
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: true
  },
});
