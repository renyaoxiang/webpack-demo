var webpack = require("webpack");

var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = [
	{
		devtool: "inline-source-map",
		entry: {
			index: ["./src/boot/index.ts"],
			ai: ["./src/usr/local/ai/ai.tsx"],
			kmp: ["./src/usr/local/kmp/kmp.tsx"],
			astar: ["./src/usr/local/astar/astar.tsx"],
			astar2: ["./src/usr/local/astar/astar2.tsx"],
			todo: ["./src/usr/local/todo/todo.tsx"],
			redux: ["./src/usr/local/redux/redux.tsx"],
			"react-redux": ["./src/usr/local/react-redux/react-redux.tsx"],
			reduxTodo: ["./src/usr/local/redux-todo/reduxTodo.tsx"],
			dumplicateSubStr: ["./src/usr/local/dumplicateSubStr/dumplicateSubStr.tsx"]
		},
		output: {
			path: __dirname + "/dist/",
			filename: "js/[name].js",
			chunkFilename: "[name].chunk.js"
		},
		resolve: {
			extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
			// modules: [path.resolve(__dirname, 'node_modules/')],
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader"]
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: "index.html",
				chunks: ["index"],
				hash: true,
				inject: "head"
			}),
			new HtmlWebpackPlugin({
				filename: "todo.html",
				chunks: ["todo"],
				hash: true,
				inject: "head"
			}),
			new HtmlWebpackPlugin({
				filename: "redux.html",
				chunks: ["redux"],
				hash: true,
				inject: "head"
			}),
			new HtmlWebpackPlugin({
				filename: "reduxTodo.html",
				chunks: ["reduxTodo"],
				hash: true,
				inject: "head"
			}),
			new HtmlWebpackPlugin({
				filename: "react-redux.html",
				chunks: ["react-redux"],
				hash: true,
				inject: "head"
			}),
			new HtmlWebpackPlugin({
				filename: "astar.html",
				chunks: ["astar"],
				hash: true,
				inject: "head"
			}),
			new HtmlWebpackPlugin({
				filename: "dumplicateSubStr.html",
				chunks: ["dumplicateSubStr"],
				hash: true,
				inject: "head"
			}),
			new HtmlWebpackPlugin({
				filename: "astar2.html",
				chunks: ["astar2"],
				hash: true,
				inject: "head"
			}),
			new HtmlWebpackPlugin({
				filename: "ai.html",
				chunks: ["ai"],
				hash: true,
				inject: "head"
			}),
			new HtmlWebpackPlugin({
				filename: "kmp.html",
				chunks: ["kmp"],
				hash: true,
				inject: "head"
			})
		]
	}
];
