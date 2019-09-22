const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CWD = process.cwd();
const SRC_DIR = path.join(CWD, 'src');
const ENTRY_FILE = path.join(SRC_DIR, 'index.js');
const DIST_DIR = path.join(CWD, 'dist');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: ENTRY_FILE,
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: false
          }
        }]
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.(gif|jpe?g|png)$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.s?css$/,
        loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      }
    ]
  },

  resolve: {
    extensions: ['*', '.json', '.scss', '.jsx', '.js']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlPlugin({
      template: path.join(SRC_DIR, 'index.html'),
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:6].css',
      chunkFilename: '[id].[hash:6].css',
      minimize: true
    }),
    new CopyPlugin([
      { from: path.join(SRC_DIR, 'assets'), to: path.join(DIST_DIR, 'assets') },
    ]),
  ],

  devServer: {
    port: 3333
  }
}
