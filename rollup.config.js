import alias from '@rollup/plugin-alias';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import tsconfig from './tsconfig.json';

const __dirname = dirname(fileURLToPath(import.meta.url));

const aliases = Object.entries(tsconfig.compilerOptions.paths).map(([name, [path]]) => {
  return {
    find: name,
    replacement: resolve(__dirname, 'out', path) + '.js'
  };
});

const shared = {
  plugins: [
    alias({
      entries: [
        ...aliases,
        { find: 'frigid', replacement: resolve(__dirname, 'node_modules/frigid/out/index.js') }
      ]
    })
  ],
  watch: {
    include: 'out/**/*'
  }
}

export default [
  {
    ...shared,
    input: './out/src/index.js',
    output: {
      file: 'bin/app.bundle.js',
      format: 'es'
    }
  },
  {
    ...shared,
    input: './out/src/hot-index.js',
    output: {
      file: 'bin/ipc-tower.bundle.js',
      format: 'es'
    }
  }
];
