const { arrayFlatten } = require('../utils')
const translate = require('./translate')

const arr = []
// const reg = /^@translate_([^@]*): /g // /@[^@]*:/g

const taskList = []

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
      // arr.push(`@translate_${key}: ${source[key]}`)
      arr.push(source[key])
      isString = true
    }
    else if (typeof source[key] === 'object') {
      tar[key] = walk(source[key], origin, target, map)
    }
  }
  isString && taskList.push(
    async () => {
      return new Promise((resolve, reject) => {
        translate(arr.join('\n'), 'zh', 'cht').then(res => {
          console.log(res, 'res Fucker');
          // console.log({lang: res.trans_result[0].dst, source });
          resolve({ lang: res.trans_result[0].dst, source })
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
function getTranslatedResult (source, origin, target) {
  let ret = walk(source, origin, target)
  let p = new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      extecue(taskList).then(res => {
        res.forEach((item, index) => {
          // let rarr = item.lang.split(/ ?@ ?translate_([^@]*): ?/g).filter(item => item)
          let rarr = item.lang.split(/\n/g).filter(item => item)
          console.log(rarr);
          for (let i = 0; i < rarr.length - 1; i += 2) {
            item.source[rarr[i]] = rarr[i + 1]
          }
          // console.log(item.source);
        })
        resolve()
      })
    }).then(() => {
      console.log(source, '------------------');
      resolve(source)
    }).catch(err => {
      reject(err)
    })
  })

  return p
}

/**
 * 将待翻译的对象转为数组
 * @param {Objecy} source 
 * @returns Array
 */
function walkSource (source) {
  let ts = []
  for (let key in source) {
    if (typeof source[key] === 'object') {
      ts.push(walkSource(source[key]))
    }
    else if (typeof source[key] === 'string') {
      ts.push(source[key])
    }
  }

  return ts
}

/**
 * 
 * @param {Object} source 
 * @returns Array
 */
function getTranslatedSource (source) {
  let retArr = []
  let sourceArr = arrayFlatten(walkSource(source))
  let sourceStr = sourceArr.join(',')
  let len = sourceStr.length
  let translateArr = sourceStr.match(new RegExp(`.{${len < 2000 ? len : 2000}}`, 'g'))
  // return console.log(translateArr, '111', new RegExp(`.{${len < 2000 ? len : 2000}}`, 'g'));
  translateArr.forEach(tItem => {
    taskList.push(
      async () => {
        return new Promise((resolve, reject) => {
          translate(tItem.replace(/,/g, '\n'), 'zh', 'cht').then(res => {
            console.log(res, '--- res ---');
            // console.log({lang: res.trans_result[0].dst, source });
            resolve(res.trans_result.map(item => item.dst))
          }).catch(err => reject(err))
        })
      }
    )
  })

  let p = new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      extecue(taskList).then(res => {
        // res.forEach((item, index) => {
        //   // let rarr = item.lang.split(/ ?@ ?translate_([^@]*): ?/g).filter(item => item)
        //   let rarr = item.lang.split(/\n/g).filter(item => item)
        //   console.log(rarr);
        //   for (let i = 0; i < rarr.length - 1; i += 2) {
        //     item.source[rarr[i]] = rarr[i + 1]
        //   }
        //   // console.log(item.source);
        // })
        console.log(res, 'r --- e --- s', source);
        resolve()
      })
    }).then(() => {
      throw new Error('1')
      // console.log(source, '------------------');
      resolve(source)
    }).catch(err => {
      reject(err)
    })
  })

  return p
}

let index = 0;
function mappingSource(source, arr, index) {
  let keys = Object.keys(source)

  for(let key in keys) {
    if(typeof source[key] === 'object') {
      index = mappingSource(source[key], arr, index)
    }
    else {
      source[key] = arr[index]
    }
  }

  return index
}

  /**
   * 执行异步事件队列
   * @param {Array} taskList 
   * @returns Array
   */
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
    getTranslatedResult,
    getTranslatedSource
  }
