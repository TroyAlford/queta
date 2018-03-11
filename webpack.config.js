/* eslint-disable no-undef */
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const ENVIRONMENT = process.env.NODE_ENV
const PRODUCTION = ENVIRONMENT === 'production'
const SOURCEMAP = !PRODUCTION || process.env.SOURCEMAP
const STORYBOOK = Boolean(process.env.STORYBOOK)

const plugins = []
const externals = {}

if (PRODUCTION) {
  plugins.push(
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(ENVIRONMENT) }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: { comments: false, semicolons: false },
      sourceMap: SOURCEMAP,
    })
  )
  Object.assign(externals, {
    'mobx-react': 'mobx-react',
    'mobx-state-tree': 'mobx-state-tree',
    'react-dom': 'react-dom',
    mobx: 'mobx',
    react: 'react',
  })
}
if (!STORYBOOK) {
  plugins.push(new ExtractTextPlugin({
    allChunks: true,
    disable: STORYBOOK,
    filename: 'react-glaemscribe.css',
  }))
}

module.exports = {
  devtool: SOURCEMAP ? 'source-map' : 'none',
  entry: `${__dirname}/source/index.js`,
  externals,
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.(woff2?|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000',
    }, {
      test: /\.s?css$/,
      use: STORYBOOK
        ? ['style-loader', 'css-loader', 'sass-loader']
        : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
    }],
  },
  output: {
    filename: PRODUCTION ? 'react-glaemscribe.min.js' : 'react-glaemscribe.js',
    library: 'react-glaemscribe',
    libraryTarget: 'umd',
    path: `${__dirname}/build`,
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'source/'),
    },
  },
  stats: {
    children: false,
  },
  plugins,
}
/* eslint-enable no-undef */
