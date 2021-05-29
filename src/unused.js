    // 初始化compilation
    // compiler.hooks.thisCompilation.tap('CopyWebpackPlugin', (compilation) => {
    //   // 添加资源的hooks
    //   compilation.hooks.additionalAssets.tapAsync('CopyWebpackPlugin', async (cb) => {

    //     // console.log(`${this.optings.path + this.optings.filename}`);
    //     let res = await result
    //     console.log(' ---', res);
    //     const content = res || '123'
    //     compilation.assets[`${this.optings.path + this.optings.filename}`] = {
    //       // 文件大小
    //       source() {
    //         return JSON.stringify(content);
    //       },
    //       // 文件内容
    //       size() {
    //         return JSON.stringify(content).length;
    //       }
    //     }
    //     compilation.emitAsset(`${this.optings.path + this.optings.filename}`, {
    //       // 文件大小
    //       source() {
    //         return JSON.stringify(content);
    //       },
    //       // 文件内容
    //       size() {
    //         return JSON.stringify(content).length;
    //       }
    //     });
    //     cb()

    //     // result.then(res => {
    //     //   compilation.assets[`${this.optings.path + this.optings.filename}`] = {
    //     //     source () {
    //     //       return `module.exports = ${JSON.stringify(res)}`
    //     //     },
    //     //     size () {
    //     //       return source().length
    //     //     }
    //     //   }

    //     //   writeFileRecursive(dir, `module.exports = ${JSON.stringify(res)}`, (err) => {
    //     //     if (err) {
    //     //       console.error('该文件不存在，重新创建失败！')
    //     //       callback && callback(err)
    //     //     }
    //     //     console.log('翻译结果已导出');
    //     //   })
    //     // })
    //   })
    // })