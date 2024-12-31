const { defineConfig } = require('vitest/config')

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['src/testSetup.ts'],
  },
})
