import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Pure lib utilities run fine in Node; add jsdom here if/when we test
    // React components.
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    coverage: {
      // Reported, not gated — `pnpm test:unit --coverage` prints a summary.
      // No CI-failing threshold yet; coverage of lib/ is still growing.
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['lib/**/*.ts'],
      exclude: ['lib/**/*.test.ts', 'lib/generated/**']
    }
  }
})
