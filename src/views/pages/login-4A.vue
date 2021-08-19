<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="login-header">
          <h2 class="login-brand">集中化测试平台</h2>
        </div>
        <div class="login-body">
          <h3 class="login-title">请使用4A平台用户登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" status-icon>
            <el-form-item prop="mainAcct">
              <el-input v-model="dataForm.mainAcct" placeholder="用户账号">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true">
                    <use xlink:href="#icon-user"></use>
                  </svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="loginPwd">
              <el-input v-model="dataForm.loginPwd" type="password" placeholder="用户密码">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true">
                    <use xlink:href="#icon-lock"></use>
                  </svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" :placeholder="$t('login.captcha')">
                    <span slot="prefix" class="el-input__icon">
                      <svg class="icon-svg" aria-hidden="true">
                        <use xlink:href="#icon-safetycertificate"></use>
                      </svg>
                    </span>
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dataFormSubmitHandle()" class="w-percent-100">{{ $t('login.title') }}</el-button>
            </el-form-item>
            <div style="height: 40px;margin-top: -17px;">
              <el-dropdown @command="handleCommand" style="float:left">
                <el-button type="text">
                  工单申请<i class="el-icon-circle-plus el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <!--                  <el-dropdown-item :command="{type:'3',name:'4A主从账号申请-旧'}">4A主从账号申请-旧</el-dropdown-item>-->
                  <el-dropdown-item :command="{type:'2',name:'4A主从账号申请'}">4A主从账号申请</el-dropdown-item>
                  <el-dropdown-item :command="{type:'1',name:'通用工单申请'}">通用工单</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
<!--              <ctc-download-table id="1318837550820909057" is4A></ctc-download-table>-->
              <el-button type="text" style="float:right" @click="operation(2)" class="">忘记密码?</el-button>
            </div>
          </el-form>
        </div>
        <div class="login-footer">
          <p>{{ $t('login.copyright') }}2020 © </p>
          <p>【平台热线：13613116196/jzhcspt@139.com，服务时间：工作日9:00-18:00】</p>
        </div>
        <!--满天星特效-->
        <div class="stars">
          <div class="star" v-for="n in 10" :key="n" :style="{'--star-color':colorData[n%5]}"></div>
        </div>
        <div class='starIcon' v-for="n in 10" :key="n" :style="getStartStyle(n)"></div>
      </main>
    </div>
    <add-or-updata v-if="addOrUpdataVisible" ref="addOrUpdata" @init="addOrUpdataVisible = false"></add-or-updata>
    <add-or-updatas v-if="addOrUpdatasVisible" ref="addOrUpdatas" @init="addOrUpdatasVisible = false"></add-or-updatas>
    <!--从账号列表选择-->
    <el-drawer title="从账号选择" :visible.sync="drawerVisible" size="15%">
      <el-row v-for="(item, index) in loginBy4AData.subAccts" :key="index" style="margin-top:10px;padding-left:15px;">
        <el-col :span="24">
          <el-button type="primary" plain @click="doChooseSubAccts(item)">{{item}}</el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import { messages } from '@/i18n'
import loginFilter from '../../utils/login-filter'
import ctcUtils from '@/utils/ctc-utils.js'
import addOrUpdatas from '@/views/modules/accountManagement4A/addOrUpdata'
import addOrUpdata from '@/views/modules/accountOperationManagement4A/accountOperationManagement/addOrUpdata'
export default {
  mixins: [loginFilter],
  components: {
    addOrUpdata, addOrUpdatas
  },
  data () {
    return {
      i18nMessages: messages,
      captchaPath: '',
      dataForm: {
        mainAcct: '',
        loginPwd: '',
        uuid: '',
        captcha: ''
      },
      loginBy4AData: {
        subAccts: []
      },
      colorData: ['#FFFFFF', '#00FF00', '#FFFF00', '#00FFFF', '#C0C0C0'],
      addOrUpdataVisible: false,
      addOrUpdatasVisible: false,
      drawerVisible: false
    }
  },
  computed: {
    dataRule () {
      return {
        mainAcct: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        loginPwd: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.triggerUrlFilter()
  },
  methods: {
    // 从账号选择
    doChooseSubAccts (subAcct) {
      let mainParams = Object.assign({}, this.dataForm)
      let loginPwd = this.encryptPassword(mainParams.loginPwd)
      let params = { 'mainAcct': this.loginBy4AData.mainAcct, 'subAcct': subAcct, 'loginPwd': loginPwd }
      this.$http.post('/auth/auth4a/loginBySubAcct', params).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.loginSuccess(res)
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      let thisvm = this
      thisvm.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        let params = Object.assign({}, thisvm.dataForm)
        params.loginPwd = thisvm.encryptPassword(params.loginPwd)
        thisvm.$http.post('/auth/auth4a/loginBy4A', params).then(({ data: res }) => {
          if (res.code !== 0) {
            thisvm.getCaptcha()
            return thisvm.$message.error(res.msg)
          }
          thisvm.loginBy4AData = { ...thisvm.loginBy4AData, ...res.data }
          // 特殊处理，判断从账号列表长度是否等于1，是直接跳转;否弹出选择列表
          if (thisvm.loginBy4AData.subAccts.length > 1) {
            this.drawerVisible = true
          } else {
            if (thisvm.loginBy4AData.subAccts.length > 0) {
              let accts = thisvm.loginBy4AData.subAccts[0]
              thisvm.$message.success('系统自动匹配，从账号【' + accts + '】进行登录')
              thisvm.doChooseSubAccts(accts)
            } else {
              thisvm.$message.error('系统异常，从账号列表为空')
            }
          }
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    handleCommand (command) {
      if (command.type === '3') {
        this.operation(1)
      } else {
        // 获取字典列表, 添加并全局变量保存
        this.$ctcLoading.open()
        this.$http.get('/sys/dict/type/all').then(({ data: res }) => {
          this.$ctcLoading.close()
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          window.SITE_CONFIG['dictList'] = res.data
          this.addOrUpdataVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(command.name, command.type)
          })
        }).catch(() => {
          this.$ctcLoading.close()
        })
      }
    },
    operation (type) {
      if (type === 3) {
        ctcUtils.customExportGet(`/ctc/oss/file/download/${this.mutiFileId}`)
      } else if (type === 2) {
        // let msg = '您好！因重置密码权限4A侧不向应用开放，忘记密码请您联系4A运维邮箱 support4a@126.com进行重置，谢谢！'
        // let msg = '您好！因重置密码权限4A侧不向应用开放，忘记密码请登录集中化4a管理平台进行重置，谢谢！'
        let msg = '您好！因重置密码权限4A侧不向应用开放，忘记密码请登录集中化4a管理平台进行重置（详见《4A主从账号管理操作手册》1.3.3重置密码）'
        this.$alert(msg, '提示', {
          confirmButtonText: '确定'
        })
      } else if (type === 1) {
        // 获取字典列表, 添加并全局变量保存
        this.$ctcLoading.open()
        this.$http.get('/sys/dict/type/all').then(({ data: res }) => {
          this.$ctcLoading.close()
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          window.SITE_CONFIG['dictList'] = res.data
          this.addOrUpdatasVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdatas.init('4A账号申请', '1')
          })
        }).catch(() => {
          this.$ctcLoading.close()
        })
      }
    }
  }
}
</script>
<style lang="scss">
.aui-page__login {
  background-color: #fff;
  background: url('../../assets/img/login_bg.jpg') no-repeat center center;
  background-size: cover;
  .login-header {
    position: fixed;
    /*top: 21%;*/
    top: 17%;
    right: 13%;
    text-shadow: 5px 5px 5px rgba(13, 63, 164, 0.5);
  }
  .login-body {
    position: fixed;
    /*top: 35%;*/
    top: 30%;
    right: 10%;
    border-radius: 10px;
    background-color: rgba(17, 5, 110, 0.5);
    color: #fff;
    box-shadow: 11px 17px 3px 0px rgba(32, 101, 207, 0.44);
    z-index: 10;
  }
  .login-footer {
    position: fixed;
    width: 80%;
    bottom: 7%;
  }
  /*动态星星特效*/
  .starIcon {
    position: absolute;
    width: 32px;
    height: 32px;
    background: url(../../assets/img/star.gif) no-repeat;
  }
  .stars {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 120%;
    transform: rotate(-45deg);
  }

  .star {
    --star-color: #ffffff;
    --star-tail-length: 6em;
    --star-tail-height: 2px;
    --star-width: calc(var(--star-tail-length) / 6);
    --fall-duration: 9s;
    --tail-fade-duration: var(--fall-duration);
    position: absolute;
    top: var(--top-offset);
    left: 0;
    width: var(--star-tail-length);
    height: var(--star-tail-height);
    color: var(--star-color);
    background: linear-gradient(45deg, currentColor, transparent);
    border-radius: 50%;
    filter: drop-shadow(0 0 6px currentColor);
    transform: translate3d(104em, 0, 0);
    animation: fall var(--fall-duration) var(--fall-delay) linear infinite,
      tail-fade var(--tail-fade-duration) var(--fall-delay) ease-out infinite;
  }
  @media screen and (max-width: 750px) {
    .star {
      animation: fall var(--fall-duration) var(--fall-delay) linear infinite;
    }
  }
  .star:nth-child(1) {
    --star-tail-length: 6.07em;
    --top-offset: 18.71vh;
    --fall-duration: 6.295s;
    --fall-delay: 8.613s;
  }
  .star:nth-child(2) {
    --star-tail-length: 5.87em;
    --top-offset: 91.61vh;
    --fall-duration: 6.744s;
    --fall-delay: 5.299s;
  }
  .star:nth-child(3) {
    --star-tail-length: 7.01em;
    --top-offset: 66.77vh;
    --fall-duration: 7.356s;
    --fall-delay: 8.793s;
  }
  .star:nth-child(4) {
    --star-tail-length: 5.54em;
    --top-offset: 3.44vh;
    --fall-duration: 11.193s;
    --fall-delay: 7.602s;
  }
  .star:nth-child(5) {
    --star-tail-length: 7.37em;
    --top-offset: 30.74vh;
    --fall-duration: 7.323s;
    --fall-delay: 5.879s;
  }
  .star:nth-child(6) {
    --star-tail-length: 5.74em;
    --top-offset: 96.44vh;
    --fall-duration: 6.375s;
    --fall-delay: 6.784s;
  }
  .star:nth-child(7) {
    --star-tail-length: 6.75em;
    --top-offset: 53.58vh;
    --fall-duration: 11.154s;
    --fall-delay: 2.304s;
  }
  .star:nth-child(8) {
    --star-tail-length: 6.93em;
    --top-offset: 45.4vh;
    --fall-duration: 9.916s;
    --fall-delay: 1.499s;
  }
  .star:nth-child(9) {
    --star-tail-length: 6.79em;
    --top-offset: 4.57vh;
    --fall-duration: 6.47s;
    --fall-delay: 3.746s;
  }
  .star:nth-child(10) {
    --star-tail-length: 7.16em;
    --top-offset: 87.24vh;
    --fall-duration: 10.807s;
    --fall-delay: 3.084s;
  }
  .star::before,
  .star::after {
    position: absolute;
    content: '';
    top: 0;
    left: calc(var(--star-width) / -2);
    width: var(--star-width);
    height: 100%;
    background: linear-gradient(45deg, transparent, currentColor, transparent);
    border-radius: inherit;
    animation: blink 2s linear infinite;
  }
  .star::before {
    transform: rotate(45deg);
  }
  .star::after {
    transform: rotate(-45deg);
  }

  @keyframes fall {
    to {
      transform: translate3d(-30em, 0, 0);
    }
  }
  @keyframes tail-fade {
    0%,
    50% {
      width: var(--star-tail-length);
      opacity: 1;
    }
    70%,
    80% {
      width: 0;
      opacity: 0.6;
    }
    100% {
      width: 0;
      opacity: 0;
    }
  }
  @keyframes blink {
    50% {
      opacity: 0.6;
    }
  }
}
.choose-subaccts {
  height: 35px;
  line-height: 35px;
  vertical-align: middle;
  text-align: center;
  margin: 10px;
  padding: 0px 10px;
  border: 1px solid #4190f7;
  color: #4190f7;
  border-radius: 4px;
  cursor: pointer;
  z-index: 11;
}
</style>
