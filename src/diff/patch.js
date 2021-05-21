const { getTranslatedResult } = require('../translator')
const { ADD, DELETE, UPDATE } = require('./patchType')

/**
 * 
 * @param {Object} source 
 * @param {Array} patchs 
 */
function doPatch(origin, patchs) {
  let obj, prop, translate = {}
  for(let i = 0; i < patchs.length; i++ ) {
    if(patchs[i].source) {
      translate[i] = patchs[i].source
    }
  }
  getTranslatedResult(translate, 'ch', 'cht')

  for(let i in patchs) {
    const {source, type, track} = patchs[i]

    obj = origin
    for(let i = 0; i < track.length - 1; i++) {
      obj = obj[track[i]]
    }
    prop = track[track.length - 1]

    switch(type) {
      case DELETE:
        try {
          delete obj[prop]
        } catch(err) {
          console.error(err);
        } finally {
          break
        }
      case UPDATE:
        obj[prop] = translate[i]
        break
      case ADD:
        obj[prop] = translate[i]
        break
    }
  }

  return Promise.resolve(origin)
}

module.exports = doPatch

// const patchs = [
//   { source: '你话啥呀', type: 'update', track: [ 'a' ] },
//   { source: { h: '饮茶啦' }, type: 'update', track: [ 'b' ] },
//   { source: '112', type: 'update', track: [ 'c', 'd' ] },
//   { type: 'delete', track: [ 'c', 'e', 'f' ] },
//   { source: '33', type: 'update', track: [ 'c', 'e', 'g' ] },
//   { source: '44', type: 'add', track: [ 'c', 'e', 'i' ] }
// ]

// const origin = {
//   a: '1',
//   b: '2',
//   c: {
//     d: '11',
//     e: {
//       f: '22',
//       g: '33'
//     }
//   }
// }

// doPatch(origin, patchs)

// setTimeout(() => {
//   console.log(origin)
// }, 5000)
