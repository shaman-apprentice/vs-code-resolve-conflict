//@ts-check
'use strict';

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const outputPath = path.resolve(__dirname, '..', 'out', 'web-view');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'web',

  entry: './src/resolve-conflict-web-view/resolve-conflict.ts',
  output: {
    path: outputPath,
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
  plugins: [
    new CopyPlugin([
      {
        from: 'src/resolve-conflict-web-view/resolve-conflict.css',
        to: outputPath,
      },
      {
        from: 'src/resolve-conflict-web-view/resolve-conflict.html',
        to: outputPath,
      },
    ]),
  ],
};

module.exports = config;
