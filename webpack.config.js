const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackMerge = require('webpack-merge');

const config = require('./config');

const isDev = config.isDev;

const jsfilename = `[name]${isDev ? '' : '-[chunkhash]'}.bundle.js`;
const cssfilename = `[name]${isDev ? '' : '-[contenthash]'}.bundle.css`;
const bundlename = `[path][name]${isDev ? '' : '-[hash]'}.[ext]`;

const extractCss = new ExtractTextPlugin(cssfilename);

const htmlConfig = name => new HtmlWebpackPlugin({
  filename: `${name}.html`,
  chunks: [name],
  template: `src/${name}/template.ejs`,
});

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['es2015', 'react'],
    plugins: [
      // 'add-module-exports',
      // 'transform-class-properties',
      // 'transform-object-rest-spread',
      // 'transform-async-to-generator',
      // 'transform-es2015-modules-commonjs',
    ],
  },
};

const plugins = [
  htmlConfig('app'),
  extractCss,
];

const baseConfig = {
  entry: {
    app: './src/app/client.js',
  },
  output: {
    filename: jsfilename,
    chunkFilename: jsfilename,
    path: config.outputdir,
    pathinfo: true,
    publicPath: config.rootdir,
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: babelLoader,
    }, {
      test: /\.css/,
      use: extractCss.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
        }],
      }),
    }, {
      test: /\.json$/,
      use: 'json-loader',
    }, {
      test: /\.(icon|jpg|png|gif|webp|svg)(\?.*)?$/,
      use: `file-loader?name=${bundlename}`,
    }],
  },
  plugins,
};

const devConfig = {};

const prodConfig = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      test: /\.bundle\.js$/,
    }),
  ],
};

module.exports = webpackMerge(baseConfig, isDev ? devConfig : prodConfig);

if (require.main === module) {
  console.info(module.exports); // eslint-disable-line
}
