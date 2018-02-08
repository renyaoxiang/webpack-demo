const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCss = new ExtractTextPlugin({
	filename: "public/css/app-all.css",
	allChunks: true
});

function cssLoader(importLoaders, modules = true) {
	return {
		loader: "css-loader",
		options: {
			root: ".",
			importLoaders: importLoaders,
			modules: true,
			localIdentName: "[name]"
		}
	};
}

module.exports = {
	plugins: [],
	rules: [
		{
			test: /\.ts(x)?$/,
			loader: "ts-loader",
			exclude: /node_modules/
		},
		// the url-loader uses DataUrls.
		// the file-loader emits files.
		{
			test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			// Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
			// loader: "url?limit=10000"
			use: {
				loader: "url-loader",
				options: {
					limit: 10000
				}
			}
		},
		{
			test: /\.(png|ttf|eot|svg)(\?[\s\S]+)?$/,
			loader: "file-loader"
		},
		{
			test: /\.css$/,
			use: ["style-loader", cssLoader(1)]
		},
		{
			test: /\.scss$/,
			use: [
				"style-loader",
				cssLoader(2, false),
				{
					loader: "sass-loader",
					options: { sourceMap: true }
				}
			]
		},
		{
			test: /\.less$/,
			use: [
				"style-loader",
				cssLoader(2, false),
				{
					loader: "less-loader",
					options: { sourceMap: true }
				}
			]
		}
	]
};
