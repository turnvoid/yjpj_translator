const { getTranslatedSource } = require('../translator')
const { ADD, DELETE, UPDATE } = require('./patchType')

/**
 * 
 * @param {Object} source 
 * @param {Array} patchs 
 */
function doPatch(origin, patchs) {
  let obj, prop, translate = {}

  // 创建一个Promise并获取其权限
  let resolvePromise, rejectPromise
  let p = new Promise((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })

  for(let i = 0; i < patchs.length; i++ ) {
    if(patchs[i].source) {
      translate[i] = patchs[i].source
    }
  }
  
  getTranslatedSource(translate).then(source => {
    // console.log('source', source, '------', 'translate', translate);
    for(let i in patchs) {
      const {source, type, track} = patchs[i]
  
      obj = origin
      for(let i = 0; i < track.length - 1; i++) {
        obj = obj[track[i]]
      }
      prop = track[track.length - 1]
  
      switch(type) {
        case DELETE:
          delete obj[prop]
        case UPDATE:
          obj[prop] = translate[i]
          break
        case ADD:
          obj[prop] = translate[i]
          break
      }
    }
    resolvePromise(origin)
    // console.log('origin', origin['dashboard']['workspace']['card_title'])
  })

  return p
}

module.exports = doPatch
