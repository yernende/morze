const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProductionModeEnabled = process.argv.includes("-p");

module.exports = {
  mode: isProductionModeEnabled ? "production" : "development",
  target: "web",
  watchOptions: {
    poll: true
  },
  plugins: [
    new MiniCssExtractPlugin("[name].css")
  ],
  module: {
    rules: [{
      test: /\.svelte$/,
      use: [{
        loader: "svelte-loader",
        options: {
          generate: "dom",
          hydratable: true
        }
      }]
    }, {
      test: /\.scss$/,
      use: [
        isProductionModeEnabled ? MiniCssExtractPlugin.loader : "style-loader",
        "css-loader",
        "postcss-loader",
        "resolve-url-loader",
        "sass-loader?sourceMap"
      ]
    }, {
      test: /\.css$/,
      use: [
        isProductionModeEnabled ? MiniCssExtractPlugin.loader : "style-loader",
        "css-loader"
      ]
    }]
  },
  entry: ["./sources-frontend/script", "./sources-frontend/design"],
  output: {
    path: path.join(__dirname, "./www/builds"),
    publicPath: "/builds/",
    filename: "[name].js"
  },
  resolve: {
    alias: {
      "svelte": path.resolve('node_modules', 'svelte')
    },
    extensions: [".mjs", ".js", ".scss", ".svelte"]
  }
}
