const { Compiler, Compilation } = require("webpack");
const { getTranslatedSource } = require('./translator')
const fs = require('fs');
const path = require("path");
const { writeFileRecursive } = require("./utils/index");
const diff = require("./diff");
const doPatch = require("./diff/patch");

let result

class Translator {
  constructor(optings) {
    if(optings || (optings = {})) {
      optings.path = optings.path || 'translated'
      optings.filename = './' + (optings.filename || 'main.js')
    }
    this.optings = optings
  }

  /**
   * 
   * @param {Compiler} compiler 
   */
  apply(compiler) {
    // 待解决：读取大文件，流
    // 读取已有的文件，进而增量更新
    const dir = path.resolve(compiler.context, this.optings.path, this.optings.filename)
    let originSource = null
    try {
      if(fs.existsSync(dir)) {
        let data = fs.readFileSync(dir, 'utf-8')
        data = data.replace(/ /g, '').replace(/^module\.exports=/, '')
        originSource = JSON.parse(data)
      }
    } catch(err) {
      console.error(err);
    }

    // 获取新对象
    const newSource = this.optings.source
    // 如果存在源对象，则进行增量更新
    if(originSource) {
      if(!newSource || typeof newSource !== 'object') {
        console.error('未指定翻译的对象');
        return
      }
      const patchs = diff(originSource, this.optings.source)
      result = doPatch(originSource, patchs)
      console.log('result', result);
    } else if (this.optings.source) { // 否则，只更新新对象
      result = getTranslatedSource(this.optings.source)
    } else {
      throw new Error('未指定翻译的对象')
    }

    compiler.hooks.emit.tapPromise('MyTranslator', (compilation) => {
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

        result.then(res => {
          console.log('res', res.dashboard.workspace.card_title);
          compilation.assets[`${this.optings.path + this.optings.filename}`] = {
            source() {
              return `module.exports = ${JSON.stringify(res)}`
            },
            size() {
              return source().length
            }
          }
          
          writeFileRecursive(dir, `module.exports = ${JSON.stringify(res)}`, (err) => {
            if (err) {
              return console.log('该文件不存在，重新创建失败！')
            }
            console.log("翻译结果已导入")
          })

          resolve()
        })
      })
    })
  }
}

module.exports = Translator
