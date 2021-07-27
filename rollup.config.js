import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: {
        index: 'src/a.js',
    },
    output: {
        name: 'rollit',
        dir: 'dist',
        format: 'esm',
    },
  plugins: [nodeResolve()]
};

