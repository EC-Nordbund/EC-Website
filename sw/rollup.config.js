import esbuild from 'rollup-plugin-esbuild'
import nodeResolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/main.js',
  output: {
    file: '../static/sw.js',
    format: 'esm'
  },
  plugins: [
    esbuild({
      include: /\.ts$/
    }),
    nodeResolve()
  ]
};