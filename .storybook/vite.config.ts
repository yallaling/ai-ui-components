import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: ['lit', '@lit/reactive-element', '@lit/localize'],
  },
  optimizeDeps: {
    include: ['lit', '@yallaling/web-ai-components'],
  },
});
