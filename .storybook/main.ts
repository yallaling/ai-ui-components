import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },

  async viteFinal(config) {
    return mergeConfig(config, {
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
  },
};

export default config;
