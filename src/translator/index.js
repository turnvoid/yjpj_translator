const { arrayFlatten } = require('../utils')
const translate = require('./translate')

// const reg = /^@translate_([^@]*): /g // /@[^@]*:/g

const taskList = []

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
  let sourceArr = arrayFlatten(walkSource(source))
  let sourceStr = sourceArr.join(',')
  let len = sourceStr.length
  let translateArr = sourceStr.match(new RegExp(`.{${len < 2000 ? len : 2000}}`, 'g'))
  translateArr.forEach(tItem => {
    taskList.push(
      async () => {
        return new Promise((resolve, reject) => {
          translate(tItem.replace(/,/g, '\n'), 'zh', 'cht').then(res => {
            if (!res || !res.trans_result) return []
            resolve(res.trans_result.map(item => item.dst))
          }).catch(err => reject(err))
        })
      }
    )
  })

  let p = new Promise((resolve, reject) => {
    new Promise((resolve, reject) => {
      extecue(taskList).then(res => {
        mappingSource(source, res[0])
        resolve()
      }).catch(err => reject(err))
    }).then(() => {
      // throw new Error('1')
      resolve(source)
    }).catch(err => {
      reject(err)
    })
  })

  return p
}

function mappingSource (source, arr, index = 0) {
  let keys = Object.keys(source)

  for (let key of keys) {
    if (typeof source[key] === 'object') {
      index = mappingSource(source[key], arr, index)
    }
    else {
      source[key] = arr[index++]
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
  getTranslatedSource
}
