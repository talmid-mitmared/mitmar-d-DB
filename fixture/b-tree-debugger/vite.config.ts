import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow simple imports from the repo packages folder when wiring the debugger.
      '@packages': path.resolve(__dirname, '../../packages')
    }
  }
});
