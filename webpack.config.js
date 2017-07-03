var webpack = require('webpack')

var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = [{
	devtool: 'inline-source-map',
	entry: {
		index: ['./src/index.ts'],
		todo: ['./src/todo.tsx'],
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
			chunks: ['index'],
			hash: true,
			inject: 'head'
		}),
		new HtmlWebpackPlugin({
			filename: 'todo.html',
			chunks: ['todo'],
			hash: true,
			inject: 'head'
		})
	]
}]
