const fs = require('fs')

/**
 *  
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
      // setTimeout(() => {
      //   console.log('---------------------');
      //   console.log(path)
      //   console.log('---------------------');
      //   console.log(lastPath);
      //   console.log('---------------------');
      //   console.log(callback.toString());
      //   callback(null)
      // }, 3000)
      return callback(null)
    })
  })
}

module.exports = {
  writeFileRecursive
}
