import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: {
    index: 'src/a.js',
    index2: 'src/a2.js',
  },
  output: {
    name: 'rollit',
    dir: 'dist',
    format: 'esm',
  },
  plugins: [ nodeResolve() ]
};
