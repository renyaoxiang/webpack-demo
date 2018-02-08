var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

const entries = {
	entry: {
		index: ["./src/page/index.ts"],
		ai: ["./src/page/ai/ai.tsx"],
		kmp: ["./src/page/kmp/kmp.tsx"],
		astar: ["./src/page/astar/astar.tsx"],
		astar2: ["./src/page/astar/astar2.tsx"],
		todo: ["./src/page/todo/todo.tsx"],
		redux: ["./src/page/redux/redux.tsx"],
		reduxTodo: ["./src/page/redux-todo/reduxTodo.tsx"],
		reactRedux: ["./src/page/react-redux/reactRedux.tsx"],
		dumplicateSubStr: ["./src/page/dumplicateSubStr/dumplicateSubStr.tsx"],
		styles: [
			"font-awesome-loader!./webpack-config/font-awesome.config.js",
			"./src/page/styles/styles.ts"
		]
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DllReferencePlugin({
			context: __dirname,
			name: "vendor",
			manifest: require("../public/common-dist/vendor-manifest.json")
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
			template: "src/page/styles/index.html",
			filename: "styles.html",
			chunks: ["styles"],
			hash: true,
			inject: "head"
		}),
		new webpack.HotModuleReplacementPlugin()
	]
};
module.exports = entries;
