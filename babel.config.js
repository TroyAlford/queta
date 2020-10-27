module.exports = {
	plugins: [
		'@babel/plugin-transform-runtime',
		['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-numeric-separator',
		'@babel/plugin-syntax-dynamic-import',
	],
	presets: [
		['@babel/preset-env', { corejs: '3.6.5', modules: 'auto', useBuiltIns: 'entry' }],
		'@babel/preset-react',
		['@babel/preset-typescript', { allowDeclareFields: true }],
	],
}
