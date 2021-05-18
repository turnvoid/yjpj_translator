const translate = require('./translate')

const arr = []

/**
 * 
 * @param {Object} source 遍历源对象
 * @param {String} origin 源语言
 * @param {String} target 目标语言
 * @param {WeakMap} map 避免回环的map
 * @returns 
 */
function walk (source, origin, target, map = new WeakMap()) {
  if (source === null) return null
  if(typeof source === 'string') return translate(source)

  if (map.has(source)) {
    console.log('cicle ------------------', map.get(source))
    return map.get(source)
  }

  let tar = new source.constructor
  map.set(source, tar)

  for (let key in source) {
    if (typeof source[key] === 'string') {
      // tar[key] = 'translated' // translate(source[key])
      arr.push(source[key])
    }
    else if (typeof source[key] === 'object') {
      tar[key] = walk(source[key], origin, target, map)
    }
  }

  return tar
}

/**
 * 
 * @param {Object} sorce 源对象
 * @param {string} origin 源语言
 * @param {string} target 目标语言
 * @returns {Promise}
 */
function getTranslatedResult (sorce, origin, target) {
  let ret = walk(sorce, origin, target)

  // console.log('--------------------------');
  // console.log(arr)
  // console.log();
  let p = new Promise((resolve, reject) => {
    translate(arr.join('T'), 'zh', 'en').then(res => {
      ret['test'] = res
      resolve(ret)
    })
  })


  // let flag = false
  // let w1 = Date.now()
  // while(!flag) {
  //   if(Date.now() - w1 >= 2000) {
  //     console.log('ooo')
  //     flag = true
  //   }
  // } 

  return p
}

module.exports = {
  getTranslatedResult
}
