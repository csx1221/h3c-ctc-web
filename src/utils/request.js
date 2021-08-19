import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import qs from 'qs'
import md5 from 'js-md5'
import {
  clearLoginInfo
} from '@/utils'
import isPlainObject from 'lodash/isPlainObject'
import ctcUtils from '@/utils/ctc-utils.js'

// 默认是内网标识
window.SITE_CONFIG['networkFlag'] = 'default'
if (window.location.host === '117.134.46.6') {
  window.SITE_CONFIG['apiURL'] = window.SITE_CONFIG['ysapi']
  // 设置外网标识
  window.SITE_CONFIG['networkFlag'] = 'outer'
}

const http = axios.create({
  baseURL: window.SITE_CONFIG['apiURL'],
  timeout: 1000 * 300,
  withCredentials: true
})
/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  document.getElementById('ctc-spin-spinning').style.display = 'inline-block'
  // 将本次的url添加到pending中，因此对于某个url第一次发起的请求不会被取消，因为还没有配置取消函数
  config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
  config.headers['token'] = Cookies.get('token') || ''
  config.headers['tenant_code'] = Cookies.get('tenant_code') || ''
  if (isPlainObject(config.params)) {} else {
    config.params = {}
  }
  // 牌位加密============【开始】======
  let convData = ''
  if (config.method === 'get') {
    config.cacheParams = config.params
    config.params = {
      ...config.params,
      ...handUrlParams(config.url)
    }
    if (config.url.lastIndexOf('?') !== -1) {
      config.url = config.url.substring(0, config.url.lastIndexOf('?'))
    }
    filterRequestNullParams(config)
    convData = qs.stringify(config.params, {
      arrayFormat: 'repeat'
    })
    // 参数转义:逗号[%2C]==[,]
    convData = ctcUtils.strReplace(convData, '%2C', ',')
  } else {
    config.cacheData = config.data
    config.data = config.data || {}
    convData = (Object.keys(config.data).length === 0) ? '{}' : JSON.stringify(config.data)
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      convData = ''
    }
  }
  // 进行md5秘钥加密(token+url+param)
  if (!config.url.startsWith('/')) {
    config.url = '/' + config.url
  }
  let url = config.url
  let token = Cookies.get('token') || ''
  let secretKey = token + '|' + url + '|' + convData
  // console.info('secretKey=====' + url + ';######;' + secretKey)
  config.headers.panWei = md5(secretKey)
  // 牌位加密============【结束】======
  if (isPlainObject(config.data)) {
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data, {
        arrayFormat: 'repeat'
      })
    }
  }
  return config
}, error => {
  document.getElementById('ctc-spin-spinning').style.display = 'none'
  return Promise.reject(error)
})

// 过滤请求控制的参数
function filterRequestNullParams (config) {
  if (isPlainObject(config.params)) {
    let params = config.params
    for (let key in params) {
      if ({}.hasOwnProperty.call(params, key)) {
        if (params[key] === '' || params[key] === undefined || params[key] === null) {
          delete params[key]
        } else {
          // 如果是get请求，查询条件去空格
          if (config.method === 'get' && typeof (params[key]) === 'string') {
            params[key] = params[key].trim()
          }
        }
      }
    }
    config.params = params
  }
  if (isPlainObject(config.data)) {
    let data = config.data
    for (let key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        if (data[key] === '' || data[key] === undefined) {
          delete data[key]
        }
      }
    }
    config.data = data
  }
}

// 手动提取url后面参数
function handUrlParams (url) {
  let paramsMap = {}
  if (url.indexOf('?') !== -1) {
    let str = url.substr(url.indexOf('?') + 1)
    let strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      let st = strs[i].split('=')
      if (st.length > 1) {
        paramsMap[st[0]] = st[1]
      }
    }
  }
  return paramsMap
}
// 接受金库消息
function receiveMsg (e) {
  let data = e.data || ''
  if (data) {
    if (typeof (data) === 'object') {
      // console.info('receiveMsg===object=' + JSON.stringify(data))
    } else if (typeof (data) === 'string' && data.includes('#')) {
      // console.info('receiveMsg===string=' + data)
      localStorage.setItem('jinkuSecretKey', data)
    }
  }
}

// 自动触发金库校验
function autoTriggerJinkuValid (response) {
  return new Promise((resolve, reject) => {
    let data = response.data.data
    // 清空金库秘钥数据
    localStorage.setItem('jinkuSecretKey', '')
    // 存储金库校验参数
    localStorage.setItem('jinKuValid', JSON.stringify(data))
    let iframe = document.createElement('iframe')
    iframe.id = 'jinkuIframe'
    iframe.src = location.origin + '/jinku/jinkuValidate.html'
    iframe.style.cssText = 'width:80%;height:80%;z-index:999991;position:absolute;top:10%;left:10%;background:#ebeef5'
    document.body.appendChild(iframe)
    document.getElementById('ctc-spin-spinning').style.display = 'inline-block'
    let jinkuIframe = document.getElementById('jinkuIframe').contentWindow
    // 开启window消息事件监听
    if (window.addEventListener) {
      jinkuIframe.addEventListener('message', receiveMsg, false)
    } else {
      jinkuIframe.attachEvent('message', receiveMsg)
    }
    let index = 1
    let jinkuInterval = localStorage.getItem('jinkuInterval') || ''
    clearInterval(jinkuInterval)
    jinkuInterval = setInterval(() => {
      let jinkuSecretKey = localStorage.getItem('jinkuSecretKey') || ''
      if (index === 100 || jinkuSecretKey) {
        clearInterval(jinkuInterval)
        if (document.getElementById('jinkuIframe')) {
          if (!!window.ActiveXObject || 'ActiveXObject' in window || (/Trident\/7\./).test(navigator.userAgent)) {
            document.getElementById('jinkuIframe').removeNode(true)
          } else {
            document.getElementById('jinkuIframe').remove()
          }
        }
        document.getElementById('ctc-spin-spinning').style.display = 'none'
        // 判断金库秘钥值[审批结果代码+“#”+“审批业务流水”+“#”+“审批票据”]
        if (jinkuSecretKey) {
          let secretKeyArr = jinkuSecretKey.split('#')
          let code = secretKeyArr[0]
          if (['-3', '-2', '1', '2', '5'].includes(code)) {
            data = data || {}
            let headers = {
              'goldBankToken': jinkuSecretKey,
              'operCode': data.operCode || '',
              'opSubAcct': '',
              'Content-Type': 'application/json;charset=UTF-8'
            }
            response.config.headers = headers
            response.config.params = response.config.cacheParams
            response.config.data = response.config.cacheData
            resolve(http.request(response.config))
          } else if (['-999'].includes(code)) {
            // 操作人主动关闭
            response.data.data = {}
            localStorage.setItem('jinkuSecretKey', '')
            resolve(response)
          } else {
            let codeMap = {}
            codeMap['-1'] = '直接关闭窗口，未申请审批，不允许业务继续访问'
            codeMap['0'] = '审批不通过，不允许业务继续访问'
            codeMap['3'] = '超时，不允许业务继续访问'
            codeMap['4'] = '出现错误或异常（包括数据异常），不允许业务继续访问'
            codeMap['6'] = '未配置策略，不允许继续访问'
            alert(codeMap[code])
          }
        } else {
          response.data.data = {}
          resolve(response)
        }
      }
      index++
    }, 3000)
    // 防止丟失，沒有clean
    localStorage.setItem('jinkuInterval', jinkuInterval)
  })
}

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  document.getElementById('ctc-spin-spinning').style.display = 'none'
  if (response.data.code === 401) {
    clearLoginInfo()
    router.replace({
      name: 'login'
    })
    return Promise.reject(response.data.msg)
  } else if (response.data.code === 4010) {
    return autoTriggerJinkuValid(response)
  } else {
    return response
  }
}, error => {
  console.error(error)
  document.getElementById('ctc-spin-spinning').style.display = 'none'
  return Promise.reject(error)
})

export default http
