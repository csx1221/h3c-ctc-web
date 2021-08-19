import router from '@/router'
import { clearLoginInfo } from '@/utils'
// 设置超时时间: 30分钟,单位毫秒
let timeOut = 30 * 60 * 1000
window.onload = function () {
  // 默认一加载页面，就设置记录时间
  let localStorageKey = location.origin + '=recordLastTime'
  localStorage.setItem(localStorageKey, new Date().getTime())
  window.document.onmousedown = function () {
    let localStorageKey = location.origin + '=recordLastTime'
    let currentTime = new Date().getTime()
    localStorage.setItem(localStorageKey, currentTime)
  }
}
function checkTimeout () {
  let currentTime = new Date().getTime()
  let origin = location.origin
  let localStorageKey = origin + '=recordLastTime'
  let loginPageKey = origin + '=loginPage'
  let recordLastTime = Number(localStorage.getItem(localStorageKey) || '0')
  let loginPage = localStorage.getItem(loginPageKey) || 'otherPage'
  let diffValue = currentTime - recordLastTime
  // 判断是否超时，同时判断是否登录页
  if (loginPage !== 'loginPage' && (diffValue >= timeOut)) {
    clearLoginInfo()
    router.replace({ name: 'login', params: { timeOutMsg: '您好，超时30分钟未操作，系统自动退出，请重新登录！' } })
  }
}
export default function () {
  // 定时器 间隔[60秒]检测是否长时间未操作页面
  window.setInterval(checkTimeout, 60000)
}
