var webpack = require('webpack')

var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = [{
	devtool: 'inline-source-map',
	entry: {
		main: ['./src/tsmain.tsx'],
		redux: ['./src/redux.tsx'],
	},
	output: {
		path: __dirname + '/dist/',
		filename: 'js/[name].js',
		chunkFilename: '[name].chunk.js'
	},
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
		// modules: [path.resolve(__dirname, 'node_modules/')],
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader',
			exclude: /node_modules/,
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			chunks: ['main'],
			hash: true,
			inject: 'head'
		}),
		new HtmlWebpackPlugin({
			filename: 'redux.html',
			chunks: ['redux'],
			hash: true,
			inject: 'head'
		})
	]
}]
