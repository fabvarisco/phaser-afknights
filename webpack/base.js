const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [ 
        { 
           test: /\.js$/, // checks for files with .js extension in // the path specified below
           include: path.resolve(__dirname, "src/"), // checks in // this path
           exclude: /node_modules/, // exclude node_modules folder
           use: { 
              loader: "babel-loader",
              options: { 
                 presets: ["env"],
              }, // uses babel-loader to transpile your ES6 code
           },
        },
        { 
           test: [/\.vert$/, /\.frag$/],
           use: "raw-loader",
        }, // in case you need to use Vertex and Fragment shaders, // this loader will bundle them for you.
        { 
           test: /\.(gif|png|jpe?g|svg|xml)$/i,
           use: "file-loader",
        }, // in case you need to use images, this loader will    // bundle them for you
     ],
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ],
};