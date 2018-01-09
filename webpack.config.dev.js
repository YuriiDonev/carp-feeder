const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VersionFile = require('webpack-version-file');

const port = process.env.PORT || 8081;
const publicPath = `http://localhost:${port}/`;
const build_number = process.env.BUILD_NUMBER !== undefined ? process.env.BUILD_NUMBER : 'local';
const app_version = process.env.npm_package_version + '_' + build_number + '_' + 'dev';

module.exports = {
  devtool: 'inline-source-map',

  entry: [
    'babel-polyfill',
    path.join(__dirname, 'src/index.js'),
  ],

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath,
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
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      'index.html',
      'style/fonts/**/*',
      'style/imgs/**/*',
      { from: 'style/application.css', to: 'style/application.css' },
    ]),
    new webpack.DefinePlugin({
			'process.env': { 'NODE_ENV': JSON.stringify('development') },
      'APP_VERSION': JSON.stringify(app_version),
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  /* Setup dev-server */
  devServer: {
    port,
    publicPath,
    compress: true,
    // noInfo: true,
    stats: { chunks: false },
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.resolve(__dirname, 'dist'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
        verbose: true,
        disableDotRule: true,
    },
    proxy: [{
      context: '/admin',
      target: publicPath,
      pathRewrite: {
        '^/admin' : '/'
      }
    }]
  },
};
