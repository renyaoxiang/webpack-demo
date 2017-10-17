var webpack = require('webpack')

var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = [{
	devtool: 'inline-source-map',
	entry: {
		index: ['./src/boot/index.ts'],
		astar: ['./src/usr/local/astar/astar.tsx'],
		todo: ['./src/usr/local/todo/todo.tsx'],
		redux: ['./src/usr/local/redux/redux.tsx'],
		'react-redux': ['./src/usr/local/react-redux/react-redux.tsx'],
		reduxTodo: ['./src/usr/local/redux-todo/reduxTodo.tsx'],
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
		}),
		new HtmlWebpackPlugin({
			filename: 'redux.html',
			chunks: ['redux'],
			hash: true,
			inject: 'head'
		}),
		new HtmlWebpackPlugin({
			filename: 'reduxTodo.html',
			chunks: ['reduxTodo'],
			hash: true,
			inject: 'head'
		}),
		new HtmlWebpackPlugin({
			filename: 'react-redux.html',
			chunks: ['react-redux'],
			hash: true,
			inject: 'head'
		}),
		new HtmlWebpackPlugin({
			filename: 'astar.html',
			chunks: ['astar'],
			hash: true,
			inject: 'head'
		})
	]
}]
