const axios = require('axios')
const md5 = require('js-md5')

const APPID = '20200501000435478'
const SECRET = 'iDeIATqrShmD0oTRy2Va'
axios.interceptors.response.use(res => res.data)

function getRandomNum (Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}


function mergeParams (params) {
  if (typeof params === 'object') {
    // 使用时请替换成自己的百度翻译APP ID
    params.appid = APPID
  }
}

function getSign (appid, secret, rand, query) {
  let str = `${appid}${query}${rand}${secret}`
  console.log(str)
  return md5(str)
}


function requestTranslatedResult (params) {
  console.log(params)
  with (params) {
    return axios.get(`http://api.fanyi.baidu.com/api/trans/vip/translate?q=${q}&from=zh&to=en&appid=${APPID}&salt=1435660288&sign=${sign}`)
  }
}

/**
 * 
 * @param {String} query,  要翻译的文本
 * @param {String} from 源语言
 * @param {String} to 目标语言
 * @returns {String}
 */
async function translate (query, from, to) {
  const rand = 1435660288
  const sign = getSign(APPID, SECRET, rand, query)
  const appid = APPID
  let ret = await requestTranslatedResult({ q: encodeURIComponent(query), from, to, sign, appid, salt: rand })
  return ret
}

let ret = translate('测试', 'zh', 'en').then(res => {
  console.log(res);
}).catch(err => console.log(err))
console.log(ret)

module.exports = translate

// http://api.fanyi.baidu.com/api/trans/vip/translate?q=%E6%B5%8B%E8%AF%95&from=zh&to=en&appid=20200501000435478&salt=1435660288&sign=486d729182421da67dc2cb61d9159f55
