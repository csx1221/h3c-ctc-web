import Cookies from 'js-cookie'
import qs from 'qs'
import axios from 'axios'
import md5 from 'js-md5'

var ctcUtils = {
  // 动态获取日期
  getDynamicDate (periodType, dateFormat, addCount) {
    const tdate = new Date()
    if (periodType === 'M') {
      tdate.setMonth(tdate.getMonth() + addCount, 1)
    } else if (periodType === 'd') {
      tdate.setDate(tdate.getDate() + addCount)
    } else if (periodType === 'h') {
      tdate.setHours(tdate.getHours() + addCount)
    } else if (periodType === 'm') {
      tdate.setMinutes(tdate.getMinutes() + addCount)
    } else if (periodType === 's') {
      tdate.setSeconds(tdate.getSeconds() + addCount)
    }
    return this.date2str(tdate, dateFormat)
  },
  // 日期格式化
  date2str (x, fmt) {
    var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
    }
    var fObj = fmt.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
      return ((v.length > 1 ? '0' : '') + z[v.slice(-1)]).slice(-2)
    })
    return fObj.replace(/(y+)/g, function (v) {
      return x.getFullYear().toString().slice(-v.length)
    })
  },
  // 过滤参数
  filterParams (data) {
    for (let key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        if (data[key] === '' || data[key] === undefined || data[key] === null) {
          delete data[key]
        } else {
          // 如果是get请求，查询条件去空格
          if (typeof (data[key]) === 'string') {
            data[key] = data[key].trim()
          }
        }
      }
    }
    return data
  },
  // 字符串批量替换
  strReplace (targetStr, str1, str2) {
    var reg = new RegExp(str1, 'gm')
    return targetStr.replace(reg, str2)
  },
  // 获取加密排位
  getPaiWei (type, url, data) {
    data = data || {}
    if (!url.startsWith('/')) {
      url = '/' + url
    }
    let convData = ''
    if (type === 'get') {
      convData = qs.stringify(data, { arrayFormat: 'repeat' })
    } else {
      convData = (Object.keys(data).length === 0) ? '{}' : JSON.stringify(data)
    }
    // 进行md5秘钥加密(token+userId+param)
    let token = Cookies.get('token') || ''
    let secretKey = token + '|' + url + '|' + convData
    let paiWeiMap = { 'panWei': md5(secretKey) }
    return paiWeiMap
  },
  // 导出(方式:post) 不走网关
  customExportPostRemove (url, fileNames) {
    document.getElementById('ctc-spin-spinning').style.display = 'inline-block'
    let turl = `http://${window.location.host}/file-service${url}`
    axios({
      method: 'get',
      url: turl,
      responseType: 'blob',
      headers: {
        'token': Cookies.get('token'),
        ...this.getPaiWei('get', url, {})
      }
    }).then((res) => {
      let fileName = fileNames + '.docx'
      this.handDealWebDownFile(res.data, {}, fileName)
    }).catch(() => {
      document.getElementById('ctc-spin-spinning').style.display = 'none'
    })
  },
  // 导出(方式:post)
  customExportPost (url, data, fileName) {
    document.getElementById('ctc-spin-spinning').style.display = 'inline-block'
    let turl = window.SITE_CONFIG['apiURL'] + url
    let tdata = this.filterParams(data)
    axios({
      method: 'post',
      url: turl,
      data: tdata,
      responseType: 'blob',
      headers: {
        'token': Cookies.get('token'),
        ...this.getPaiWei('post', url, tdata)
      }
    }).then((res) => {
      this.handDealWebDownFile(res.data, data, fileName)
    }).catch(() => {
      document.getElementById('ctc-spin-spinning').style.display = 'none'
    })
  },
  // 导出(方式:get)
  customExportGet (url, data, fileName) {
    document.getElementById('ctc-spin-spinning').style.display = 'inline-block'
    let turl = window.SITE_CONFIG['apiURL'] + url
    let tdata = this.filterParams(data)
    axios({
      method: 'get',
      url: turl,
      params: tdata,
      responseType: 'blob',
      headers: {
        'token': Cookies.get('token'),
        ...this.getPaiWei('get', url, tdata)
      }
    }).then((res) => {
      this.handDealWebDownFile(res.data, data, fileName)
    }).catch(() => {
      document.getElementById('ctc-spin-spinning').style.display = 'none'
    })
  },
  // 导出(方式:本地导出下载)
  customExportLocalGet (url, data, fileName) {
    document.getElementById('ctc-spin-spinning').style.display = 'inline-block'
    let turl = url
    let tdata = this.filterParams(data)
    axios({
      method: 'get',
      url: turl,
      params: tdata,
      responseType: 'blob',
      headers: {
        'token': Cookies.get('token'),
        ...this.getPaiWei('get', url, tdata)
      }
    }).then((res) => {
      this.handDealWebDownFile(res.data, data, fileName)
    }).catch(() => {
      document.getElementById('ctc-spin-spinning').style.display = 'none'
    })
  },
  handDealWebDownFile (fileData, data, fileName) {
    document.getElementById('ctc-spin-spinning').style.display = 'none'
    // 组装文件下载名
    let dataDate = ctcUtils.getDynamicDate('s', 'yyyyMMddhhmmss', 0)
    let downfileName = (data.fileName || '文件下载') + '-' + dataDate + '.xlsx'
    if (fileName) {
      downfileName = fileName
    }
    // 兼容IE浏览器下载
    if ('msSaveOrOpenBlob' in navigator) {
      var blob = new Blob([fileData])
      window.navigator.msSaveOrOpenBlob(blob, downfileName)
    } else {
      let blob = new Blob([fileData])
      let objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.download = downfileName
      link.href = objectUrl
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href) // 释放内存
      document.body.removeChild(link)
    }
  }
}
export default ctcUtils
