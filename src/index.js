const { Compiler, Compilation } = require("webpack");
const { getTranslatedResult } = require('./translator')

let result

class Translator {
  constructor(optings) {
    this.optings = optings
    if (optings.source) {
      console.log(optings.source)
      result = getTranslatedResult(optings.source)
    }
  }

  /**
   * 
   * @param {Compiler} compiler 
   */
  apply (compiler) {
    compiler.hooks.emit.tapPromise('MyTranslator', (compilation, callback) => {

      return new Promise((resolve, reject) => {
        let outputfile = compilation.options.output.filename
        let assets = compilation.assets
        let keys = Object.keys(assets)
        let content = ''

        keys.forEach(key => {
          if (outputfile !== key || outputfile.substr(outputfile.lastIndexOf('.')) !== ".js") {
            return
          }
          let asset = assets[key]
          content = asset.source()
          console.log(content)
          content = content.replace("typeof define === 'function' && define.amd", "typeof define === 'function' && define.amd && define.cmd")
            .replace('"function"==typeof define&&define.amd', '"function"==typeof define&&define.amd&&define.cmd')
        })


        callback && callback()

        result.then(res => {
          compilation.assets['translated/main.js'] = {
            source () {
              return `module.exports = ${JSON.stringify(res)}`
            },
            size () {
              return source().length
            }
          }

          resolve()
        })
      })
    })
  }
}

module.exports = Translator