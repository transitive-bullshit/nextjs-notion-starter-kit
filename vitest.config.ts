import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Pure lib utilities run fine in Node; add jsdom here if/when we test
    // React components.
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx']
  }
})
