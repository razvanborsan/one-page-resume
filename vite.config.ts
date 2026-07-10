/// <reference types="vitest/config" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {playwright} from '@vitest/browser-playwright';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {port: 5173},
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{browser: 'chromium'}],
    },
  },
});
