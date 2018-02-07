var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const pageRoot = "./src/page";

const entry = {
	index: ["./src/page/index.ts"],
	ai: ["./src/page/ai/ai.tsx"],
	kmp: ["./src/page/kmp/kmp.tsx"],
	astar: ["./src/page/astar/astar.tsx"],
	astar2: ["./src/page/astar/astar2.tsx"],
	todo: ["./src/page/todo/todo.tsx"],
	redux: ["./src/page/redux/redux.tsx"],
	reduxTodo: ["./src/page/redux-todo/reduxTodo.tsx"],
	reactRedux: ["./src/page/react-redux/reactRedux.tsx"],
	styles: ["./src/page/styles/styles.ts"],
	dumplicateSubStr: ["./src/page/dumplicateSubStr/dumplicateSubStr.tsx"]
};
module.exports = [
	{
		devtool: "inline-source-map",
		entry: entry,
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
					test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
					loader: "url-loader",
					options: {
						limit: 10000
					}
				},
				{
					test: /\.css$/,
					use: [
						"style-loader",
						{
							loader: "css-loader",
							options: {
								modules: true,
								localIdentName:
									"[name]__[local]__[hash:base64:5]"
							}
						}
					]
				},
				{
					test: /\.scss$/,
					use: [
						"style-loader",
						{
							loader: "css-loader",
							options: {
								modules: true,
								importLoaders: 1,
								localIdentName:
									"[name]__[local]__[hash:base64:5]"
							}
						},
						"sass-loader"
					]
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
				filename: "reactRedux.html",
				chunks: ["reactRedux"],
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
			}),
			new HtmlWebpackPlugin({
				filename: "styles.html",
				chunks: ["styles"],
				hash: true,
				inject: "head"
			})
		]
	}
];
