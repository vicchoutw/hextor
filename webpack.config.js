const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

let initProject = {
  openPage: 'app',
  pages: ['app']
};

let cleanFolderInit = {
  target: [
    'export',
    'build',
    'dist'
  ],
  options: {
    root: path.resolve('./'),
    verbose: true
    // exclude: ['*.html']
  }
}

let baseConfig = {
  mode: 'development',
  entry: {},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        //Eslint-Loader
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'eslint-loader',
        options: {
          emitError: true
        }
      },
      {
        //Babel-Loader
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { "modules": "commonjs" }], '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime',
              "add-module-exports"
            ]
          }
        }
      },
      {
        test: /\.pug$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'pug-loader',
          options: {
            self: true,
            pretty: true,
           },
        }]
      },
      {
        // Sass-loader + css-loader
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { 
            loader: 'css-loader',
            options: { 
              url: false 
            } 
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(
      cleanFolderInit.target,
      cleanFolderInit.options
    ),
    new CopyWebpackPlugin([
      {
        from: './resources/images/',
        to: './images/',
        force: true
      }
    ]),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: '[id].css'
    }),
  ],
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
    writeToDisk: false,
    open: true,
    openPage: `${initProject.openPage}.html`,
    compress: true,
    watchContentBase: true,
    contentBase: path.join(__dirname, './resources/'),
    port: 3000
  }
}

//Multiple Pages Build.
initProject.pages.map(function(proName) {

  baseConfig.entry[[`${proName}`]] = path.resolve(__dirname, `./resources/js/${proName}.js`);

  baseConfig.plugins.push(
    new HtmlWebpackPlugin({
      chunks: [`${proName}`],
      filename: `${proName}.html`,
      template: path.resolve(__dirname, `./resources/${proName}.pug`),
      // data: require(`./resources/${_projectConfig.location}/pug/json/${proName}.json`),
      inject: true
    })
  );
});

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    baseConfig.optimization = {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
    }
  }
  return baseConfig;
}