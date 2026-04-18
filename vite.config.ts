import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Vite requires a default export for config files.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
