const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './app/index.js'
  ],
  output: {
    path: './app/public/assets/',
    publicPath: '/assets/',
    filename: 'app.js'
  },
  debug: true,
  devtool: 'inline-source-map',
  devServer: {
    proxy: {
      '*': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  resolve: {
      root: [path.resolve(__dirname, 'app'), path.resolve(__dirname, 'node_modules')],
      extensions: ['', '.js', '.jsx', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'app'),
        loader: 'babel',
        query: {
          optional: ['runtime']
        }
      },
      {
        test: /\.jsx$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'app/components')
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        include: [
          path.join(__dirname, 'app/stylesheets'),
          path.join(__dirname, 'node_modules')
        ]
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};
