import webpack from 'webpack'
import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'

export default {
  entry: path.resolve(__dirname, "src/background.js"),
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "background.js"
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
      new CopyWebpackPlugin(
        [
          { from: 'src/manifest.json' },
          { from: 'src/*.html', flatten: true}
        ],
        { ignore: ['*.DS_Store',] }
      )
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  resolve: {
    modules: ['node_modules']
  }
}
