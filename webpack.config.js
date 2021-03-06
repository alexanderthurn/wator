var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var webpack = require('webpack');
var intlJSON = require('./src/res/en.json');
var path = require('path');
var intlJSONStringified = {};
Object.keys(intlJSON).map(function (key) {
    intlJSONStringified['INTL_' + key] = JSON.stringify(intlJSON[key]);
});
intlJSON = intlJSONStringified;

var isProduction = process.env.NODE_ENV === 'production';


console.log('Building with NODE_ENV', process.env.NODE_ENV, path.join(__dirname, "dist"));

var config = {
    /*  watch: !isProduction,
     watchOptions: {
     aggregateTimeout: 300,
     poll: 1000,
     ignored: /node_modules/
     },*/
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        port: 9000,
        host: '0.0.0.0',
        disableHostCheck: true,
        watchContentBase: true
    },
    entry: "./src/js/main.js",
    output: {
        path: __dirname + '/dist/',
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                }]
            }
        ]
    },

    plugins: [new WebpackCleanupPlugin()]
};


if (isProduction) {
    config.plugins.push(
        new UglifyJsPlugin({
            compress: {
                sequences: true,
                properties: true,
                drop_debugger: true,
                dead_code: true,
                unsafe: true,
                conditionals: true,
                comparisons: true,
                evaluate: true,
                booleans: true,
                unused: true,
                loops: true,
                cascade: true,
                keep_fargs: false,
                if_return: true,
                join_vars: true,
                drop_console: true
            },
            'mangle-props': true,
            mangle: true,
            beautify: false
        }));
}


config.plugins.push(
    new webpack.DefinePlugin(intlJSON),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: "src/index.html",
        minify: {
            minifyJS: true,
            removeEmptyAttributes: true
        },
        inlineSource: '.(js|css)$',
        cache: true
    }));

if (isProduction) {

    config.plugins.push(
        new HtmlWebpackInlineSourcePlugin()
    );
}


module.exports = config;

