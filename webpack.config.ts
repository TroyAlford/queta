/* eslint-disable @typescript-eslint/no-var-requires,global-require,no-undef */
import path from 'path'
import PluginMinimizeCSS from 'css-minimizer-webpack-plugin'
import PluginExtractCSS from 'mini-css-extract-plugin'
import PluginTerser from 'terser-webpack-plugin'
import webpack from 'webpack'

const ENVIRONMENT = process.env.NODE_ENV
const PRODUCTION = ENVIRONMENT === 'production'

const include = [
	/node_modules\/glaemscribe/,
	`${__dirname}/source/`,
	`${__dirname}/temp/`,
	`${__dirname}/vendor/`,
]

const FONT = (test: RegExp, mimetype: string) => ({
	include,
	loader: 'file-loader',
	options: { limit: 100_000, name: 'assets/[name].[ext]', outputPath: 'fonts/', mimetype },
	test,
})

module.exports = {
	devServer: {
		compress: true,
		devMiddleware: {
			index: true,
			publicPath: '/',
			writeToDisk: true,
		},
		historyApiFallback: true,
		hot: true,
		port: 1234,
		static: {
			directory: path.join(__dirname, './source/docs'),
		},
	},
	devtool: 'source-map',
	entry: {
		'queta-react': `${__dirname}/source/react/Queta.tsx`,
		'queta-web-components': `${__dirname}/source/web-components/index.ts`,
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
	mode: PRODUCTION ? 'production' : 'development',
	module: {
		rules: [{
			exclude: /node_modules/,
			loader: 'babel-loader',
			test: /\.[jt]sx?$/,
		}, {
			include, test: /\.scss$/,
			use: [
				PluginExtractCSS.loader,
				'css-loader',
				{ loader: 'sass-loader',
					options: {
						implementation: require('sass'),
						sassOptions: { fiber: require('fibers') },
					},
				},
			],
		}, {
			test: /\.(woff2?|eot|ttf|svg)#?/,
			type: 'asset/resource',
		}],
	},
	optimization: {
		minimize: PRODUCTION,
		minimizer: [
			new PluginMinimizeCSS(),
			new PluginTerser(),
		],
	},
	output: {
		chunkFilename: PRODUCTION ? 'queta-[name].min.js' : 'queta-[name].js',
		filename: PRODUCTION ? '[name].min.js' : '[name].js',
		library: 'queta',
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
			]
			: [],
		new PluginExtractCSS({
			attributes: {
				id: 'queta-styles',
			},
			chunkFilename: 'queta.[name].css',
			filename: 'queta.css',
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
