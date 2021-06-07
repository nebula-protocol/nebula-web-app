import reactRefresh from '@vitejs/plugin-react-refresh';
import * as path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@terra-money/terra.js': path.resolve(__dirname, 'src/alias/terra.js'),
      'bowser': 'bowser/bundled.js',
      'styled-components': 'styled-components/dist/styled-components.cjs.js',
    },
  },
  plugins: [reactRefresh(), tsconfigPaths(), svgr()],
  //build: {
  //  rollupOptions: {
  //    input: {
  //      main: path.resolve(__dirname, 'index.html'),
  //      subpage: path.resolve(__dirname, 'subpage.html'),
  //    },
  //  },
  //},
});
