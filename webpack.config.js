"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    js: "./src/app.js",
  },

  module: {
    loaders: [
      {
        test: /\.css/,
        loaders: [
          "style",
          "css",
        ],
      },
    ],
  },

  output: {
    path: "./dist",
    filename: "bundle.js",
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "Color Changer",
    }),
  ]
};
