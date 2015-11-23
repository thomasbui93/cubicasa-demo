/**
 * Created by thoma on 11/15/2015.
 */
'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    target: 'web',
    cache: true,
    entry: {
        module: path.join(srcPath, 'module.js'),
        common: ['react', 'react-router', 'alt']
    },
    resolve: {
        root: srcPath,
        extensions: ['', '.js', '.scss', '.jsx'],
        modulesDirectories: ['node_modules', 'src']
    },
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '',
        filename: '[name].js',
        library: ['Example', '[name]'],
        pathInfo: true
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, "./src/sass")]
    },
    module: {
        loaders:[
            { test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel?presets[]=react,presets[]=es2015' },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("style.css", {
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'src/index.html'
        }),
        new webpack.NoErrorsPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ],

    debug: true,
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: './public',
        historyApiFallback: true,

    }
};