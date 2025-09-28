import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', 
  build: {
    outDir: 'dist', 
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    port: 5173,
    open: true,
    host: true, 
    hmr: {
      host: process.env.GITHUB_CODESPACES ? `${process.env.GITHUB_CODESPACE_NAME}-5173.app.github.dev` : 'localhost',
      protocol: 'wss',
    },
  },
});
