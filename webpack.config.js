/* eslint-disable no-undef */
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ENVIRONMENT = process.env.NODE_ENV
const PRODUCTION = ENVIRONMENT === 'production'
const SOURCEMAP = !PRODUCTION || process.env.SOURCEMAP

const PATH = {
  JS: './node_modules/glaemscribe/build/web/glaemscribe/js',
  ADDED_FONTS: './vendor/fonts',
  INCLUDED_FONTS: './node_modules/glaemscribe/fonts/build/webs',
}

const include = [
	/node_modules\/glaemscribe/,
	`${__dirname}/source/`,
	`${__dirname}/vendor/`,
]

module.exports = {
	devtool: SOURCEMAP ? 'source-map' : 'none',
	entry: [
		...glob.sync(`${PATH.INCLUDED_FONTS}/*.css`),
		`${__dirname}/source/index.js`,
	],
	externals: {
		react: 'react',
		'react-dom': 'ReactDOM',
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		}, {
			test: /\.s?css$/, include,
			use: [
				{ loader: MiniCssExtractPlugin.loader, options: { hmr: !PRODUCTION } },
				'css-loader',
				{ loader: 'sass-loader', options: { implementation: require('sass'), sassOptions: { fiber: require('fibers') } } },
			],
		}, {
			test: /\.(woff2?|eot|ttf|svg)#?/, include,
			loader: 'url-loader',
			options: {
				name: 'assets/[name].[ext]',
				limit: 100000,
			}
		}],
	},
	output: {
		chunkFilename: 'react-glaemscribe.[id].js',
		filename: PRODUCTION ? 'react-glaemscribe.min.js' : 'react-glaemscribe.js',
		library: 'react-glaemscribe',
		libraryTarget: 'umd',
		path: path.resolve(__dirname, 'dist'),
		publicPath: './',
		umdNamedDefine: true,
	},
	plugins: [
		...PRODUCTION
			? [
				new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(ENVIRONMENT) }),
				new webpack.optimize.ModuleConcatenationPlugin(),
				new webpack.optimize.UglifyJsPlugin({
					minimize: true,
					output: { comments: false, semicolons: false },
					sourceMap: SOURCEMAP,
				}),
			]
			: [],
		new MiniCssExtractPlugin({
			chunkFilename: 'react-glaemscribe.[id].css',
			filename: 'react-glaemscribe.css',
			ignoreOrder: true,
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'source/'),
		},
		extensions: ['.css', '.js', '.scss'],
		modules: ['node_modules'],
	},
	stats: {
		children: false,
	},
}
/* eslint-enable no-undef */
