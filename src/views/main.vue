<template>
  <div v-loading.fullscreen.lock="loading" :element-loading-text="$t('loading')" :class="['aui-wrapper', { 'aui-sidebar--fold': $store.state.sidebarFold }]">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="aui-content__wrapper">
        <main-content v-if="!$store.state.contentIsNeedRefresh" />
      </div>
      <!--<main-theme-tools />-->
      <!--      &lt;!&ndash;加载进度条效果&ndash;&gt;-->
      <!--      <div id="ctc-spin-spinning" class="ctc-spin-spinning">-->
      <!--        <span class="ctc-spin-dot ctc-spin-dot-spin"><i></i><i></i><i></i><i></i></span>-->
      <!--      </div>-->
    </template>
  </div>
</template>

<script>
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainContent from './main-content'
import MainThemeTools from './main-theme-tools'
import debounce from 'lodash/debounce'
import { polishingOssHost } from '@/utils/validate'
export default {
  provide () {
    return {
      // 刷新
      refresh () {
        this.$store.state.contentIsNeedRefresh = true
        this.$nextTick(() => {
          this.$store.state.contentIsNeedRefresh = false
        })
      }
    }
  },
  data () {
    return {
      loading: true
    }
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent,
    MainThemeTools
  },
  watch: {
    $route: 'routeHandle'
  },
  created () {
    this.windowResizeHandle()
    this.routeHandle(this.$route)
    Promise.all([
      this.getUserInfo(),
      this.getPermissions()
    ]).then(() => {
      this.loading = false
    })
  },
  methods: {
    // 窗口改变大小
    windowResizeHandle () {
      this.$store.state.sidebarFold = document.documentElement['clientWidth'] <= 992 || false
      window.addEventListener('resize', debounce(() => {
        this.$store.state.sidebarFold = document.documentElement['clientWidth'] <= 992 || false
      }, 150))
    },
    // 路由, 监听
    routeHandle (route) {
      if (!route.meta.isTab) {
        return false
      }
      var tab = this.$store.state.contentTabs.filter(item => item.name === route.name)[0]
      if (!tab) {
        tab = {
          ...window.SITE_CONFIG['contentTabDefault'],
          ...route.meta,
          'name': route.name,
          'params': { ...route.params },
          'query': { ...route.query }
        }
        this.$store.state.contentTabs = this.$store.state.contentTabs.concat(tab)
      }
      this.$store.state.sidebarMenuActiveName = tab.menuId
      this.$store.state.contentTabsActiveName = tab.name
    },
    // 获取当前管理员信息
    getUserInfo () {
      let thisvm = this
      return thisvm.$http.get('/sys/user/info').then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        thisvm.$store.state.user.id = res.data.id
        thisvm.$store.state.user.name = res.data.username
        thisvm.$store.state.user.realName = res.data.realName
        thisvm.$store.state.user.superAdmin = res.data.superAdmin
        thisvm.$store.state.user.superTenant = res.data.superTenant
        thisvm.$store.state.user.tenantName = res.data.tenantName
        thisvm.$store.state.user.userRoleNames = res.data.userRoleNames
        thisvm.$store.state.user.organizeId = res.data.organizeId
        thisvm.$store.state.user.roleType = res.data.maxRoleCode === null ? 0 : res.data.maxRoleCode
        thisvm.$store.state.user.subName = res.data.organizeName === null ? res.data.userRoleNames.replace('，', '、') : res.data.organizeName + '&nbsp&nbsp' + res.data.userRoleNames.replace('，', '、')
        // 获取预览图片
        thisvm.previewUploadPic(res.data.headUrl, function (picUrl) {
          thisvm.$store.state.user.headUrl = picUrl || ''
        })
      }).catch(() => { })
    },
    previewUploadPic (attachementId, callback) {
      let picUrl = require('../assets/img/avatar.png')
      if (attachementId && attachementId.indexOf('http') === -1) {
        this.$http.get('/ctc/oss/file/photo/path/' + attachementId).then(({ data: res }) => {
          picUrl = polishingOssHost(res.data)
          callback && callback(picUrl)
        }).catch((res) => {
          callback && callback(picUrl)
        })
      } else {
        callback && callback(picUrl)
      }
    },
    // 获取权限
    getPermissions () {
      return this.$http.get('/sys/menu/permissions').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        window.SITE_CONFIG['permissions'] = res.data
      }).catch(() => { })
    }
  }
}
</script>
