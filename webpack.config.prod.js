const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VersionFile = require('webpack-version-file');

const build_number = process.env.BUILD_NUMBER !== undefined ? process.env.BUILD_NUMBER : 'local';
const app_version = process.env.npm_package_version + '_' + build_number + '_' + 'prod';

module.exports = {
  devtool: false,

  entry: [
    'babel-polyfill',
    path.join(__dirname, 'src/index.js'),
  ],

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/fisherman-friend', //publicPath: '/admin',
  },

  module: {
    rules: [
      // {
      //   enforce: 'pre',
      //   test: /\.jsx?$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      //   options: {
      //     emitWarning: true,
      //   },
      // },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
        //   options: {
        //     data: '@import "var.scss";',
        //     includePaths: [
        //       path.resolve(__dirname, './app/renderer/style/scss'),
        //     ],
        //   },
        }],
      },
    ],
  },

  plugins: [
    new VersionFile({
      output: './dist/version.json',
      templateString: '{"app_version":"<%= app_version %>", "build_date":"<%= date %>"} ',
      data: {
        date: new Date(),
        app_version: app_version,
      },
    }),
    new CopyWebpackPlugin([
      'index.html',
      'style/fonts/**/*',
      'style/imgs/**/*',
      { from: 'style/application.css', to: 'style/application.css' },
    ]),
    new webpack.DefinePlugin({
			'process.env': { 'NODE_ENV': JSON.stringify('production') },
      'APP_VERSION': JSON.stringify(app_version),
		}),
   	new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      }
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
