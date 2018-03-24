const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); //webpack has properties on it that allows to do 1 and 2

// 1)set up plugin to set NODE_ENV variable to production
// 2)also uglify or minify all of the code

var config = {
  entry : './app/script.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: ''
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader'}, //when this runs webpack goes and looks into package.json for babel property
      {test: /\.css$/, use: ['style-loader', 'css-loader' ]}
    ],
    loaders: [
        {
          test: /\.json$/,
          loader: 'json-loader',
          query: {
            presets: ['react', 'es2015', 'stage-0']
          }
        }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'app/index.html'
  })]
};

if(process.env.NODE_ENV === 'production'){
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV) //this line sets the node environment inside of code that is compiles for production after checking on package.json
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  )
}

// watch: true  equivalent to weback --w
module.exports = config;




//babel has presets array which has env and react
//env is responsible for transpiling to correct and latest version of js anytime--code always support latest version of js

//css loader -> whenever it sees any import like image or 'url' it changes them to require statements
//style loader --> takes the css and inserts it on the page
//--dirname ---> gives current directory

//whenver
 // In Babel, a preset is a set of plugins used to support particular language features. The two presets Babel uses by default:
  // es2015: Adds support for ES2015 (or ES6) JavaScript
  // react: Adds support for JSX
  // stage-0 - Strawman: just an idea, possible Babel plugin.
  // stage-1 - Proposal: this is worth working on.
  // stage-2 - Draft: initial spec.
  // stage-3 - Candidate: complete spec and initial browser implementations.
  // stage-4 - Finished: will be added to the next yearly release.