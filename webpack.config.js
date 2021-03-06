const path = require('path');
// const Translator = require('./src/index')

const A = require('./build/test/main')
console.log(typeof A);

module.exports = {
  mode: 'production',
  entry: './test/main.js',
  // devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './build/test'),
  },
  target: 'node',
  // node:{fs:'empty'},
  // resolve: {
  //   fallback: {
  //     path: require.resolve("path-browserify"),
  //     util: require.resolve("util/"),
  //     crypto: require.resolve('crypto-browserify'),
  //     "buffer": require.resolve("buffer/"),
  //     "https": require.resolve("https-browserify"),
  //     "http": require.resolve("stream-http"),
  //     "vm": require.resolve("vm-browserify"),
  //     "os": require.resolve("os-browserify/browser"),
  //     "stream": require.resolve("stream-browserify"),
  //     "constants": require.resolve("constants-browserify"),
  //     "assert": require.resolve("assert/"),
  //     "fs": require.resolve("fs")
  //   }
  // }
  // plugins: [
  //   new Translator({
  //     source: require('./test/language/ch/index'),
  //     path: './test/language/tarnslated',
  //     filename: 'main.js'
  //   })
  // ]
};
