import { getUUID } from '@/utils'
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie'
import { addDynamicRoute } from '@/router'
export default {
  methods: {
    // 登录页面，默认先触发地址拦截判断
    triggerUrlFilter () {
      let thisvm = this
      // 判断登录方式(0:云测试平台门户登录;1:4A登录)
      this.$http.get('/auth/getLoginConfig', { 'params': { 'random': Math.random() } }).then(({ data: res }) => {
        // 获取路由参数
        let isClearUrl = thisvm.$route.params.isClearUrl || '1'
        // 获取路由名称
        let routerName = thisvm.$route.name
        // 临时存储url参数数据
        let url = ''
        if (window.location.hash.indexOf('?') !== -1) {
          let decoding = window.location.hash.replace(/%2F/g, '/').replace(/%3A/g, ':')
          url = decoding.split('?')[1]
        }
        if (isClearUrl === '1') {
          sessionStorage.setItem('session-storage-url', url)
        }
        // 根据appAcctId是否有值，判断是单点跳转过来,默认先清空数据
        sessionStorage.setItem('session-appAcctId', '')
        let loginSw = res.data.sw
        if (loginSw === 1) {
          if (routerName === 'login4A') {
            // 特殊处理[acceptSystem]外部系统单点过来
            let urParamsMap = this.handSessionStorageUrlParams(url)
            if (urParamsMap['acceptSystem']) {
              this.exteriorSystemAccept(urParamsMap)
            } else {
              this.loadPageData(loginSw)
            }
          } else {
            this.$router.push({ name: 'login4A', params: { 'isClearUrl': '0' } })
          }
        } else {
          if (routerName === 'login') {
            this.loadPageData(loginSw)
          } else {
            this.$router.push({ name: 'login', params: { 'isClearUrl': '0' } })
          }
        }
      }).catch(() => { })
    },
    exteriorSystemAccept (urParamsMap) {
      console.info('exteriorSystemAccept：' + JSON.stringify(urParamsMap))
      let thisvm = this
      let params = {}
      params.mainAcct = urParamsMap.mainAcct
      params.subAcct = urParamsMap.subAcct
      params.ossToken = decodeURIComponent(urParamsMap.ossToken)
      thisvm.$http.post('/auth/authintegration/loginByIntegration', params).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          Cookies.set('token', res.data.token)
          Cookies.set('id', res.data.user.id)
          Cookies.set('loginSw', res.data.user.loginSw || 0)
          Cookies.set('audit4ASw', res.data.user.audit4ASw || 0)
          Cookies.set('realName', res.data.user.realName)
          Cookies.set('mainAcct', res.data.user.mainAcct)
          Cookies.set('subAcct', res.data.user.username)
          let routeRule = {}
          routeRule['1'] = '项目管理=projects/project-new-mgr/project-mgr-page'
          routeRule['2'] = '用例设计管理=casecenter-new/casedesignmgr/case-design-mgr'
          routeRule['3'] = '执行用例管理=projects/project-new-mgr/project-mgr-page'
          routeRule['4'] = '缺陷管理=defectcenter/defect-mgr/defect-mgr'
          routeRule['5'] = '构件管理=unify/construct/construct-page'
          let routeItem = routeRule[urParamsMap.routeKey].split('=')
          let title = routeItem[0]
          let path = routeItem[1]
          let params = {}
          this.customAddDynamicRoute(path, title, params)
        }
      }).catch(() => { })
    },
    loadPageData (loginSw) {
      // 判断是否是4A单点登录过来(0:否;1:是)
      let url = sessionStorage.getItem('session-storage-url')
      // 手动处理sessionStorage存储URL参数
      let paramsMap = this.handSessionStorageUrlParams(url)
      let appAcctId = paramsMap.appAcctId || ''
      if (appAcctId && loginSw === 1) {
        let params = {}
        params.token = paramsMap.token
        params.appAcctId = paramsMap.appAcctId
        params.mainAcctName = paramsMap.mainAcctName
        this.$http.post('/auth/auth4a/auth4AToken', params).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          // 根据appAcctId是否有值，判断是单点跳转过来
          sessionStorage.setItem('session-appAcctId', appAcctId)
          this.loginSuccess(res)
        }).catch(() => { })
      } else {
        this.hovorToken(loginSw)
        this.getCaptcha()
      }
    },
    encryptPassword (password) {
      let key = CryptoJS.enc.Latin1.parse('dufy20200904java')
      let iv = CryptoJS.enc.Latin1.parse('dufy20200904java')
      let encryptPwd = CryptoJS.AES.encrypt(password, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString()
      return encodeURIComponent(encryptPwd)
    },
    // 获取验证码
    getCaptcha () {
      this.dataForm.uuid = getUUID()
      this.$http.get('/auth/captcha', { 'params': { 'uuid': this.dataForm.uuid } }).then(({ data: res }) => {
        this.captchaPath = res.data
      }).catch(() => { })
    },
    getStartStyle (n) {
      let style = {}
      style.top = this.randomNumBoth(15, window.screen.height - 15) + 'px'
      style.left = this.randomNumBoth(15, window.screen.width - 15) + 'px'
      return style
    },
    // 获取随机数区间
    randomNumBoth (Min, Max) {
      var range = Max - Min
      var rand = Math.random()
      var num = Min + Math.round(rand * range)
      return num
    },
    // 动态追加url参数
    addParamsToUrl (url, key, val) {
      let turl = ''
      if (!val) {
        turl = url
      }
      var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
      var separator = url.indexOf('?') !== -1 ? '&' : '?'
      if (url.match(re)) {
        turl = url.replace(re, '$1' + key + '=' + val + '$2')
      } else {
        turl = url + separator + key + '=' + val
      }
      turl = turl.replace('?&', '?')
      return turl
    },
    handSessionStorageUrlParams (url) {
      let paramsMap = {}
      if (url) {
        let values = url.split('&')
        if (values.length === 0) {
          return
        }
        for (let i = 0; i < values.length; i++) {
          let pos = values[i].indexOf('=')
          if (values[i] === '') {
            continue
          }
          if (pos === -1) {
            continue
          }
          values[i] = values[i].replace(/%3F/g, '?').replace(/%3D/g, '=')
          let paramname = values[i].substring(0, pos)
          let paramvalue = values[i].substring(pos + 1)
          sessionStorage.setItem(paramname, paramvalue)
          paramsMap[paramname] = paramvalue
        }
      }
      return paramsMap
    },
    // 外联程序token失效
    hovorToken (loginSw) {
      let url = sessionStorage.getItem('session-storage-url')
      if (url) {
        // 手动处理sessionStorage存储URL参数
        this.handSessionStorageUrlParams(url)
        if (sessionStorage.getItem('applicationToken').indexOf('#') !== -1) {
          var appli = ''
          appli = sessionStorage.getItem('applicationToken').split('#')[0]
          sessionStorage.setItem('applicationToken', appli)
        }
        if (sessionStorage.getItem('url')) {
          let name = (loginSw === 1) ? 'login4A' : 'login'
          this.$router.push({ 'name': name })
        }
      }
    },
    // 根据应用凭证认证
    getApplocation (validation) {
      this.$http.get(`/ctc/subadmin/application/auth/authByAccessToken`, { 'params': validation }).then(({ data: res }) => {
        if (res.code !== 0) {
          sessionStorage.removeItem('url')
          sessionStorage.removeItem('applicationToken')
          return this.$message.error(res.msg)
        }
        var url = sessionStorage.getItem('url')
        url = this.addParamsToUrl(url, 'token', Cookies.get('token'))
        url = this.addParamsToUrl(url, 'applicationToken', sessionStorage.getItem('applicationToken'))
        sessionStorage.removeItem('url')
        sessionStorage.removeItem('applicationToken')
        window.open(url, '_blank')
      }).catch(() => { })
    },
    loginSuccess (res) {
      Cookies.set('token', res.data.token)
      Cookies.set('id', res.data.user.id)
      Cookies.set('loginSw', res.data.user.loginSw || 0)
      Cookies.set('audit4ASw', res.data.user.audit4ASw || 0)
      Cookies.set('realName', res.data.user.realName)
      Cookies.set('mainAcct', res.data.user.mainAcct)
      Cookies.set('subAcct', res.data.user.username)
      if (sessionStorage.getItem('url') && sessionStorage.getItem('applicationToken') !== null) {
        let validation = { accessToken: sessionStorage.getItem('applicationToken') }
        this.getApplocation(validation)
      }
      this.$router.replace({ name: 'home' })
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
    }
  }
}
