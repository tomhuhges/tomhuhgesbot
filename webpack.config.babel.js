import webpack from 'webpack'
import path from 'path'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

export default {
  entry: {
    'background': path.resolve(__dirname, "src/background.js"),
    'auth': path.resolve(__dirname, "src/auth.js")
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }],
      },
    ],
  },
  plugins: [
      new CleanWebpackPlugin([path.resolve(__dirname, "build")], {
        root: process.cwd(),
      }),
      new CopyWebpackPlugin(
        [
          { from: 'src/manifest.json' },
          { from: 'src/*.html', flatten: true }
        ],
        { ignore: ['*.DS_Store',] }
      )
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  devtool: "source-map",
  resolve: {
    modules: ['node_modules']
  }
}
