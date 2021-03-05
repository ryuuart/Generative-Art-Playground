const copyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const glob = require('glob');
const { parse } = require('path');

module.exports = {
    mode: 'development',
    entry: glob.sync('./src/**/*.js'),
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: 9000,
        writeToDisk: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new copyWebpackPlugin({
            patterns: [
                { from: "./src/Art Scripts/", to: "./Art Scripts" },
                { from: "./styles/", to: "./styles"},
            ]
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    }
}