'use strict';

var path = require('path');
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "commons.js",
      minChunks: 2,
    }),
  ],
  entry: {
    site: "./src/js/site.js",
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.js',
  }
};