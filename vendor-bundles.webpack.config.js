"use strict";
/* eslint-disable */

let webpack = require("webpack");
const path = require("path");

let config = {
	entry: {
		vendor: ["jquery", "lodash", "react", "react-dom"]
	},
	module: {},
	output: {
		filename: "[name].lib.js",
		path: path.resolve(__dirname, "public", "common-dist"),
		// The name of the global variable which the library's
		// require() function will be assigned to
		library: "[name]"
	},
	devtool: "source-map",
	plugins: [],
	devtool: "source-map"
};

config.plugins = [
	new webpack.DllPlugin({
		// The path to the manifest file which maps between
		// modules included in a bundle and the internal IDs
		// within that bundle
		path: "public/common-dist/[name]-manifest.json",
		context: __dirname,
		// The name of the global variable which the library's
		// require function has been assigned to. This must match the
		// output.library option above
		name: "[name]"
	}),
	new webpack.DefinePlugin({
		"process.env": {
			NODE_ENV: `"${process.env.NODE_ENV || "production"}"`
		}
	})
];

if (process.env.NODE_ENV !== "development") {
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap: true,
			comments: false
		})
	);
}

module.exports = config;
