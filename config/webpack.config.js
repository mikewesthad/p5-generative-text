/* eslint-env node */

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const root = path.join(__dirname, "..");

module.exports = {
    context: path.resolve(root, "src"),
    entry: {
        "bundle": "./js/main.js"
    },
    output: {
        filename: "js/[name].js",
        path: path.resolve(root, "build")
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] }
        ]
    },
    plugins: [
        new CopyWebpackPlugin(
            [{ from: "**/*" }], { ignore: ["**/*.js", "index.html"] }
        ),
        new HtmlWebpackPlugin({
            inject: true, template: "./index.html"
        })
    ],
    devtool: "source-map",
    devServer: {
        contentBase: path.resolve(root, "build"),
        port: 8080
    }
}