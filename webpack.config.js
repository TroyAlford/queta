/* eslint-disable @typescript-eslint/no-var-requires,global-require,no-undef */
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const ENVIRONMENT = process.env.NODE_ENV
const PRODUCTION = ENVIRONMENT === 'production'
const SOURCEMAP = !PRODUCTION || process.env.SOURCEMAP

const include = [
	/node_modules\/glaemscribe/,
	`${__dirname}/source/`,
	`${__dirname}/vendor/`,
]

module.exports = {
	devtool: SOURCEMAP ? 'source-map' : 'none',
	entry: `${__dirname}/source/index.ts`,
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
	module: {
		rules: [{
			exclude: /node_modules/,
			loader: 'babel-loader',
			test: /\.js$/,
		}, {
			include,
			test: /\.s?css$/,
			use: [
				{ loader: MiniCssExtractPlugin.loader, options: { hmr: !PRODUCTION } },
				'css-loader',
				{ loader: 'sass-loader',
					options: {
						implementation: require('sass'),
						sassOptions: { fiber: require('fibers') },
					},
				},
			],
		}, {
			include,
			loader: 'file-loader',
			options: {
				limit: 100000,
				name: 'assets/[name].[ext]',
				outputPath: 'fonts/',
			},
			test: /\.(woff2?|eot|ttf|svg)#?/,
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
		extensions: ['.css', '.js', '.scss', '.ts', '.tsx'],
		modules: ['node_modules'],
	},
	stats: {
		children: false,
	},
}
/* eslint-enable no-undef */
