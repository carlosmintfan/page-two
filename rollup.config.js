import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import license from 'rollup-plugin-license';
import terser from '@rollup/plugin-terser';

const config = {
  input: 'src/page.ts',
  plugins: [
    typescript(),
    nodeResolve({
      main: true
    }),
    commonjs(),
    license({
      banner: [
        '/*!',
        ' * <%= pkg.description %> – version <%= pkg.version %> (<%= moment().format("YYYY-MM-DD") %>)',
        ' * Copyright (c) 2012 TJ Holowaychuk &lt;tj@vision-media.ca&gt;',
        ' * Copyright (c) 2025 page-two contributors',
        ' * Licensed under the MIT license (https://github.com/carlosmintfan/page-two/blob/master/LICENSE.txt)',
        ' * Contains code from the path-to-regexp library, which is:',
        ' * Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)',
        ' * Licensed under the MIT license (https://github.com/pillarjs/path-to-regexp/blob/master/LICENSE)',
        ' */'
      ].join('\n'),
    }),
  ],
  output: [
    {
      file: 'dist/page.js',
      format: 'umd',
      name: 'page'
    },
    {
      file: 'dist/page.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/page.min.js',
      format: 'umd',
      name: 'page',
      plugins: [terser()]
    },
    {
      file: 'dist/page.esm.min.js',
      format: 'esm',
      plugins: [terser()]
    }
  ]
};

export default config;
