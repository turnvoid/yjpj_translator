const { ADD, UPDATE, INSERT, DELETE } = require('./patchType')

/**
 * 
 * @param {Object} origin 源对象
 * @param {Object} target 打补丁的对象
 */

const patchs = []

function diffObject(origin, target) {

  for(key in origin) {
    if(!origin.hasOwnProperty(key)) continue

    // 不存在该对象
    if(!target[key]) {
      patchs.push({
        target,
        type: ADD,
        source: origin[key]
      })
    }

    // 更新对象
    // if()
  }
}