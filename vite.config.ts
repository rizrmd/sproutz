import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      fastRefresh: true,
      babel: {
        plugins: ['@emotion/babel-plugin'],
        presets: [
          [
            '@babel/preset-react',
            {
              pragma: 'jsx',
              pragmaFrag: 'Fragment',
              throwIfNamespace: false,
              runtime: 'classic',
            },
          ],
        ],
      },
    }),
  ],
})
