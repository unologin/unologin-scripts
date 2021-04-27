
const webpack           = require('webpack');
const path              = require('path');
const ESLintPlugin      = require('eslint-webpack-plugin');

module.exports = 
{
  entry: './src/main.ts',
  output:
  {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    library: 'unologin',
    libraryTarget: 'umd',
    // this fixes "self is not defined" in nextjs
    globalObject: 'this',
  },
  resolve: 
  {
    extensions: ['.ts']
  },
  module: 
  {
    rules: 
    [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 
        [
          {
            loader: 'babel-loader',
            options: 
            {
              presets: 
              [
                '@babel/preset-env'
              ],
              plugins: 
              [
                '@babel/plugin-transform-runtime',
                '@babel/proposal-class-properties',
                '@babel/proposal-object-rest-spread'
              ]
            }
          },
          'ts-loader'
        ]
      }
    ]
  },
  plugins: 
  [
    new ESLintPlugin(
      {
        extensions: ['ts']
      }
    )
  ]
}