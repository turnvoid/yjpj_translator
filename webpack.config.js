const path = require('path');
const Translator = require('./src/index')

module.exports = {
  mode: 'development',
  entry: './test/main.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       use: ['babel-loader'],
  //       exclude: /node_modules/,
  //     },
  //   ]
  // },
  plugins: [
    new Translator({
      source: require('./test/language/ch/index'),
      target: './test/language/tarnslated'
    })
  ]
};