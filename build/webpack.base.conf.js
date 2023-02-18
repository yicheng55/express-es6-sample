const resolve = require('path').resolve


module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: [ './server/index.js' ],
  output: {
    filename: "index.js",
    path: resolve(__dirname, './../dist')
  }
}
