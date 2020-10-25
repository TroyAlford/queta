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
	`${__dirname}/temp/`,
	`${__dirname}/vendor/`,
]

module.exports = {
	devServer: {
		contentBase: './source',
		historyApiFallback: true,
		hot: true,
		injectHot: true,
		port: 1234,
		watchContentBase: true,
	},
	devtool: SOURCEMAP ? 'source-map' : 'none',
	entry: {
		'queta-docs': `${__dirname}/source/docs/index.tsx`,
		'queta-react': `${__dirname}/source/react/Queta.tsx`,
		'queta-web-components': `${__dirname}/source/web-components/index.ts`,
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
	module: {
		rules: [{
			exclude: /node_modules/,
			loader: 'babel-loader',
			test: /\.[jt]sx?$/,
		}, {
			include,
			test: /\.css$/,
			use: ['style-loader', 'css-loader'],
		}, {
			include,
			test: /\.scss$/,
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
		chunkFilename: '[name].[id].js',
		filename: PRODUCTION ? '[name].min.js' : '[name].js',
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
			'~': path.resolve(__dirname, 'source'),
		},
		extensions: ['.tsx', '.ts', '.js', '.scss', '.css'], // Order matters!
		modules: ['node_modules'],
	},
	stats: {
		children: false,
	},
}
/* eslint-enable no-undef */
