var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: path.join(__dirname, "app"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/Feedback.js",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }, {
        test: /\.css$/,
        loader: 'style!css'
      }, {
        test: /\.scss$/,
        loader: debug ? ExtractTextPlugin.extract('style','css?sourceMap!autoprefixer?browsers=last 5 versions!sass?sourceMap') : ExtractTextPlugin.extract('style','css!autoprefixer?browsers=last 5 versions!sass')
      }, {
        test: /\.(png|jpg|svg|ttf|woff|woff2|eot)$/,
        loader: 'file?name=[path][name].[ext]'
      }
    ]
  },
  output: {
    path: __dirname + "/public/",
    filename: "scripts.min.js"
  },
  plugins: debug ? [
    new ExtractTextPlugin("styles.css"),
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false, warnings: false, }),
    new webpack.DefinePlugin({ 'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin("styles.css"),
  ],
};
