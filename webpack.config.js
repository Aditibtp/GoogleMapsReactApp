const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); //webpack has properties on it that allows to do 1 and 2
//const json = require('apikeys.json');

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
          loader: 'json-loader'
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
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV) //this line sets the node environment insode of code that is compiles for production after checking on package.json
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  )
}


module.exports = config;




//babel has presets array which has env and react
//env is responsible for transpiling to correct and latest version of js anytime--code always support latest version of js

//css loader -> whenever it sees any import like image or 'url' it changes them to require statements
//style loader --> takes the css and inserts it on the page
//--dirname ---> gives current directory

//whenver