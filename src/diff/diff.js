const { ADD, UPDATE, DELETE } = require('./patchType')

const patchs = []

/**
 * 
 * @param {Object} originSource 源对象
 * @param {Object} newSource 打补丁的对象
 */
 function diff(originSource, newSource) {
  walk(originSource, newSource)
  return patchs
}

/**
 * 
 * @param {Object} originSource 源对象
 * @param {Object} newSource 打补丁的对象
 * @param {Array} track 属性轨迹
 */
function walk(originSource, newSource, track = []) {

  const keys = Object.keys(originSource)
  const nKeys = Object.keys(newSource)
  for(let key of nKeys) {
    if(!keys.includes(key)) keys.push(key)
  }
  // console.log(keys);

  for(let key of keys) {
    const originSrc = originSource[key],
          newSrc = newSource[key],
          newTrack = [...track, key]
    // console.log(originSrc, newSrc, key);

    // 源不存在该属性
    if(originSrc === undefined) {
      patchs.push({
        source: newSrc,
        type: ADD,
        track: newTrack
      })
    }
    // 新对象不存在该属性
    else if(newSrc === undefined) {
      patchs.push({
        type: DELETE,
        track: newTrack
      })
    }
    // 若存在该对象，继续diff
    else if (typeof originSrc === 'object' && typeof newSrc === 'object') {
      walk(originSrc, newSrc, newTrack)
    }
    // 若新旧对象属性不同，则替换
    else if(typeof originSrc !== typeof newSrc) {
      // console.log('originSrc', originSrc, 'newSrc', newSrc);
      patchs.push({
        source: newSrc,
        type: UPDATE,
        track: newTrack
      })
    }
  }
}

module.exports = diff

// const obj1 = {
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

// const obj2 = {
//   a: '12',
//   b: {
//     h: '33'
//   },
//   c: {
//     d: '112',
//     e: {
//       g: '33',
//       i: '44'
//     }
//   }
// }

// walk(obj1, obj2)

// console.log(patchs);
