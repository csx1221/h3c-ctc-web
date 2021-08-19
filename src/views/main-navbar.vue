<template>
  <nav class="aui-navbar" :class="`aui-navbar--${$store.state.navbarLayoutType}`">
    <div class="aui-navbar__header">
      <h1 class="aui-navbar__brand" @click="$router.push({ name: 'home' })" style="background:#4190f7;">
        <a class="aui-navbar__brand-lg" style="color: #fff" href="javascript:;">
          <img src="../../public/logo.png" style="width:30px;height:30px;margin-right:5px;" title="欢迎访问集中化测试平台" />{{ $t('brand.lg') }}
        </a>
        <a class="aui-navbar__brand-mini" style="color:#fff" href="javascript:;">
          <img src="../../public/logo.png" style="width:30px;height:30px;" title="欢迎访问集中化测试平台" />
        </a>
      </h1>
    </div>
    <div class="aui-navbar__body">
      <el-menu class="aui-navbar__menu mr-auto" mode="horizontal">
        <el-menu-item index="1" @click="$store.state.sidebarFold = !$store.state.sidebarFold">
          <svg class="icon-svg aui-navbar__icon-menu aui-navbar__icon-menu--switch" aria-hidden="true">
            <use xlink:href="#icon-outdent"></use>
          </svg>
        </el-menu-item>
        <el-menu-item index="2" @click="refresh()">
          <svg class="icon-svg aui-navbar__icon-menu aui-navbar__icon-menu--refresh" aria-hidden="true">
            <use xlink:href="#icon-sync"></use>
          </svg>
        </el-menu-item>
      </el-menu>
      <el-menu class="aui-navbar__menu" mode="horizontal">
        <el-menu-item index="4" v-if="$hasPermission('sys:notice:all')">
          <el-badge :is-dot="messageTip">
            <a href="#" @click="myNoticeRouter()"><i class="el-icon-bell"></i></a>
          </el-badge>
        </el-menu-item>
        <el-menu-item v-if="false" index="8">
          【平台热线：13613116196/jzhcspt@139.com，服务时间：工作日9:00-18:00】
        </el-menu-item>
        <el-menu-item index="7" v-if="false">
          <el-popover placement="top" v-model="qrCodevisible" style="width:420px;height:220px;">
            <el-image :src="qrCodeDefaultImg" @click.native="qrCodevisible = false" style="cursor:pointer;margin:0px;width:384px;height:170px;"></el-image>
            <el-button slot="reference" type="primary" icon="el-icon-s-finance">问卷调查</el-button>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="5" @click="fullscreenHandle()">
          <svg class="icon-svg aui-navbar__icon-menu" aria-hidden="true">
            <use xlink:href="#icon-fullscreen"></use>
          </svg>
        </el-menu-item>
        <el-menu-item index="6" class="aui-navbar__avatar">
          <el-dropdown placement="bottom" :show-timeout="0">
            <span class="el-dropdown-link">
              <span class="userSpan" @click="$router.push({path:'/personalsettings'})">
                <el-avatar class="img" :size="36" :src="$store.state.user.headUrl"></el-avatar>
              </span>
              <span>{{realName}}</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
<!--              <el-dropdown-item @click.native="updatePasswordHandle()">{{ $t('updatePassword.title') }}</el-dropdown-item>-->
              <el-dropdown-item @click.native="logoutHandle()">{{ $t('logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
    <!-- 弹窗, 切换租户 -->
    <switch-tenant v-if="switchTenantVisible" ref="switchTenant"></switch-tenant>
  </nav>
</template>

<script>
import Cookies from 'js-cookie'
import { messages } from '@/i18n'
import screenfull from 'screenfull'
import UpdatePassword from './main-navbar-update-password'
import SwitchTenant from './main-navbar-switch-tenant'
import { clearLoginInfo } from '@/utils'
export default {
  inject: ['refresh'],
  data () {
    return {
      i18nMessages: messages,
      updatePasswordVisible: false,
      switchTenantVisible: false,
      messageTip: false,
      qrCodevisible: false,
      qrCodeDefaultImg: require('../assets/img/qrCode.png'),
      realName: Cookies.get('realName')
    }
  },
  components: {
    UpdatePassword,
    SwitchTenant
  },
  created () {
    // 未读通知数
    this.getUnReadCount()
  },
  mounted () {
    this.qrCodevisible = true
  },
  methods: {
    myNoticeRouter () {
      this.$router.replace('sys-notice-user')
    },
    getUnReadCount () {
      this.$http.get(`/sys/notice/mynotice/unread`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        if (res.data > 0) {
          this.messageTip = true
        }
      }).catch(() => { })
    },
    // 全屏
    fullscreenHandle () {
      if (!screenfull.enabled) {
        return this.$message({
          message: this.$t('fullscreen.prompt'),
          type: 'warning',
          duration: 500
        })
      }
      screenfull.toggle()
    },
    // 切换租户
    tenantHandle () {
      this.switchTenantVisible = true
      this.$nextTick(() => {
        this.$refs.switchTenant.init()
      })
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePasswordVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    },
    // 退出
    logoutHandle () {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('logout') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.get('/auth/logout', {}).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          clearLoginInfo()
          this.$router.push({ name: 'login' })
        }).catch(() => { })
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss">
.aui-navbar__avatar .el-dropdown-link > .userSpan .img {
  vertical-align: middle;
  margin-right: 10px;
}
</style>
