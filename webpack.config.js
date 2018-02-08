var webpack = require("webpack");
var _ = require("lodash");
var path = require("path");
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
function addConfig(config, moduleConfig) {
	_.assign(config.entry, {
		[moduleConfig.name]: moduleConfig.entry
	});
	config.plugins.concat(moduleConfig.plugins);
}
const moduleConfigs = [
	{
		name: "ai",
		entry: ["./src/page/ai/ai.tsx"],
		plugins: [
			new HtmlWebpackPlugin({
				filename: "ai2.html",
				title: "ai",
				template: "index.html",
				chunks: ["ai"],
				hash: true,
				inject: "head"
			})
		]
	}
];
const configs = {
	devtool: "inline-source-map",
	entry: entry,
	output: {
		path: __dirname + "/public/",
		filename: "js/[name].js",
		chunkFilename: "[name].chunk.js"
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		// modules: [path.resolve(__dirname, 'node_modules/')],
		alias: {}
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
						exclude: /node_modules/,
						options: {
							modules: true,
							localIdentName: "[name]__[local]__[hash:base64:5]"
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
							importLoaders: 2,
							localIdentName: "[name]__[local]__[hash:base64:5]"
						}
					},
					"sass-loader"
				]
			},
			{
				test: /\.less$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							// modules: true,
							importLoaders: 2,
							localIdentName: "[name]__[local]__[hash:base64:5]"
						}
					},
					"less-loader"
				]
			}
		]
	},
	target: "web",
	plugins: [
		new webpack.DllReferencePlugin({
			context: __dirname,
			name: "vendor",
			manifest: require("./public/common-dist/vendor-manifest.json")
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new HtmlWebpackPlugin({
			filename: "index.html",
			title: "index",
			template: "index.html",
			chunks: ["index"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			filename: "todo.html",
			title: "todo",
			template: "index.html",
			chunks: ["todo"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			title: "redux",
			template: "index.html",
			filename: "redux.html",
			chunks: ["redux"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			title: "reduxTodo",
			template: "index.html",
			filename: "reduxTodo.html",
			chunks: ["reduxTodo"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			title: "reactRedux",
			template: "index.html",
			filename: "reactRedux.html",
			chunks: ["reactRedux"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			title: "astar",
			template: "index.html",
			filename: "astar.html",
			chunks: ["astar"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			title: "dumplicateSubStr",
			template: "index.html",
			filename: "dumplicateSubStr.html",
			chunks: ["dumplicateSubStr"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			title: "astar2",
			template: "index.html",
			filename: "astar2.html",
			chunks: ["astar2"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			title: "ai",
			template: "index.html",
			filename: "ai.html",
			chunks: ["ai"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			title: "kmp",
			template: "index.html",
			filename: "kmp.html",
			chunks: ["kmp", "vendor"],
			hash: true,
			inject: "head"
		}),
		new HtmlWebpackPlugin({
			title: "styles",
			template: "index.html",
			filename: "styles.html",
			chunks: ["styles"],
			hash: true,
			inject: "head"
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		contentBase: "./public",
		hot: true,
		historyApiFallback: false,
		noInfo: false,
		quiet: false,
		lazy: false,
		publicPath: "/",
		https: false,
		host: "localhost",
		headers: { "Access-Control-Allow-Origin": "*" },
		stats: "errors-only"
	}
};
moduleConfigs.forEach(it => addConfig(configs, it));
// _.keys(entry).forEach(key => entry[key].push("font-awesome-webpack"));
module.exports = configs;
