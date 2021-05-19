const translate = require('./translate')

const arr = []
const reg = /^@translate_([^@]*): /g // /@[^@]*:/g

const taskList = []

/**
 * 
 * @param {Object} source 遍历源对象
 * @param {String} origin 源语言
 * @param {String} target 目标语言
 * @param {WeakMap} map 避免回环的map
 * @returns 
 */
function walk(source, origin, target, map = new WeakMap()) {
  if (source === null) return null
  if (typeof source === 'string') return translate(source)

  if (map.has(source)) {
    console.log('cicle ------------------', map.get(source))
    return map.get(source)
  }

  let tar = new source.constructor
  map.set(source, tar)
  let isString = false
  let arr = []

  for (let key in source) {
    if (typeof source[key] === 'string') {
      // tar[key] = 'translated' // translate(source[key])
      arr.push(`@translate_${key}: ${source[key]}`)
      isString = true
    }
    else if (typeof source[key] === 'object') {
      tar[key] = walk(source[key], origin, target, map)
    }
  }
  isString && taskList.push(
    async () => {
      return new Promise((resolve, reject) => {
        translate(arr.join(''), 'zh', 'cht').then(res => {
          resolve({lang: res.trans_result[0].dst, source })
        }).catch(err => reject(err))
      })
    }
  )

  return tar
}

/**
 * 
 * @param {Object} sorce 源对象
 * @param {string} origin 源语言
 * @param {string} target 目标语言
 * @returns {Promise}
 */
function getTranslatedResult(source, origin, target) {
  let ret = walk(source, origin, target)
  let p = new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      extecue(taskList).then(res => {
        // console.log(res);
        res.forEach((item, index) => {
          // let rarr = item.lang.split(/ ?@ ?translate_([^@]*): ?/g).filter(item => item)
          let rarr = item.lang.split(/ ?@ ?translate_([^@]*): ?/g).filter(item => item)
          for(let i = 0; i < rarr.length - 1; i+=2) {
            item.source[rarr[i]] = rarr[i+1]
          }
          console.log(item.source);
        })
        resolve()
      })
    }).then(() => {
      resolve(source)
    }).catch(err => {
      reject(err)
    })
  })

  new Promise((resolve, reject) => {
    extecue(taskList).then(res => {
      // console.log(res);
      res.forEach((item, index) => {
        // let rarr = item.lang.split(/ ?@ ?translate_([^@]*): ?/g).filter(item => item)
        let rarr = item.lang.split(/ ?@ ?translate_([^@]*): ?/g).filter(item => item)
        for(let i = 0; i < rarr.length - 1; i+=2) {
          item.source[rarr[i]] = rarr[i+1]
        }
        console.log(item.source);
      })
      resolve()
    })
  })

  return p
}

const extecue = async (taskList = []) => {
  const resultList = []

  let task
  for (task of taskList) {
    try {
      resultList.push(await task())
    } catch (err) {
      console.error(err)
      resultList.push(null)
    }
  }

  return resultList
}

module.exports = {
  getTranslatedResult
}
