import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: ['lit', '@lit/reactive-element', '@lit/localize'],
    alias: {
      '@yallaling/web-ai-components': new URL('../packages/components/dist/esm/index.js', import.meta.url).pathname,
      '@yallaling/web-ai-core': new URL('../packages/core/dist/esm/index.js', import.meta.url).pathname,
    },
  },
  optimizeDeps: {
    include: ['lit'],
    exclude: ['@yallaling/web-ai-components', '@yallaling/web-ai-core'],
  },
});
