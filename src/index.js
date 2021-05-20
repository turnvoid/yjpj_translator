const { Compiler, Compilation } = require("webpack");
const { getTranslatedResult } = require('./translator')
const fs = require('fs');
const path = require("path");
const { writeFileRecursive } = require("./util");

let result

class Translator {
  constructor(optings) {
    this.optings = optings
    if (optings.source) {
      // console.log(optings)
      result = getTranslatedResult(optings.source)
    }
  }

  /**
   * 
   * @param {Compiler} compiler 
   */
  apply(compiler) {
    compiler.hooks.emit.tapPromise('MyTranslator', (compilation, callback) => {
      console.log(compiler.context);
      // directory to check if exists
      // const dir = path.resolve(compiler.context, this.optings.target)
      // // check if directory exists
      // console.log(dir);
      // fs.access(dir, (err) => {
      //   if(err) {
      //     fs.appendFileSync(dir, '{"data":[],"total":0}', 'utf-8', (err) => {
      //       if (err) {
      //         return console.log('该文件不存在，重新创建失败！')
      //       }
      //       console.log("文件不存在，已新创建");
      //     })
      //   }
      // })
      
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
        })


        callback && callback()

        result.then(res => {
          compilation.assets[`${this.optings.target}/main.js`] = {
            source() {
              return `module.exports = ${JSON.stringify(res)}`
            },
            size() {
              return source().length
            }
          }
          
          const dir = path.resolve(compiler.context, this.optings.target, './main.js')
          writeFileRecursive(dir, `module.exports = ${JSON.stringify(res)}`, (err) => {
            if (err) {
              return console.log('该文件不存在，重新创建失败！')
            }
            console.log("翻译结果已导入")
          })

          // fs.writeFileSync(dir, `module.exports = ${JSON.stringify(res)}`, (err) => {
          //   if (err) {
          //     return console.log('该文件不存在，重新创建失败！')
          //   }
          // })

          resolve()
        })
      })
    })
  }
}

module.exports = Translator
