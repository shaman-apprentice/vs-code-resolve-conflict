//@ts-check

'use strict';
// TODO copy css
// TODO run in parallel

const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'web',

  entry: './src/web-view/resolve-conflict.ts',
  output: {
    path: path.resolve(__dirname, '..', 'out', 'web-view'),
    filename: 'resolve-conflict.js',
  },
  devtool: 'source-map',
  externals: {
    vscode: 'vscode',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },
};

module.exports = config;
