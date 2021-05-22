const fs = require('fs')

const arrayFlatten = require('./array-flatten')

/**
 *  递归创建文件
 * @param {String} path 
 * @param {Object} buffer 
 * @param {Function} callback 
 */
function writeFileRecursive(path, buffer, callback) {
  const lastPath = path.substring(0, path.lastIndexOf('\\'))


  fs.mkdir(lastPath, { recursive: true }, err => {
    if(err) return callback(err)

    fs.writeFile(path, buffer, err => {
      if(err) callback(err)  
      return callback(null)
    })
  })
}

module.exports = {
  writeFileRecursive,
  arrayFlatten
}
