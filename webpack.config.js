var webpack = require("webpack");
var _ = require("lodash");
var path = require("path");
const moduleConfig = require("./webpack-config/module-config");
const entries = require("./webpack-config/entries");
const configs = {
	devtool: "inline-source-map",
	entry: entries.entry,
	output: {
		path: __dirname + "/public/",
		filename: "public/js/[name].js",
		chunkFilename: "public/js/[name].chunk.js"
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		alias: {}
	},
	module: {
		rules: moduleConfig.rules
	},
	target: "web",
	plugins: [
		...entries.plugins,
		...moduleConfig.plugins
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	},
		// 	sourceMap: true,
		// 	comments: false
		// })
	],
	devServer: require("./webpack-config/devServer")
};

module.exports = configs;
