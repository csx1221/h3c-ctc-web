<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-wrapper-mask"></div>
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <!-- <div class="login-header">
          <h2 class="login-brand">H3C云测试平台</h2>
        </div> -->
        <div class="login-body">
          <h3 class="login-title">H3C云测试平台</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" status-icon>
            <!-- <el-form-item>
              <el-select v-model="$i18n.locale" class="w-percent-100">
                <el-option v-for="(val, key) in i18nMessages" :key="key" :label="val._lang" :value="key"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item prop="username">
              <el-input v-model="dataForm.username" :placeholder="$t('login.username')">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true">
                    <use xlink:href="#icon-user"></use>
                  </svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')">
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
          </el-form>
        </div>
        <div class="login-footer">
          <!-- <p>{{ $t('login.copyright') }}2020 © </p> -->
          <!-- <p>H3C云测试平台 </p> -->
        </div>
        <!--满天星特效-->
        <!-- <div class="stars">
          <div class="star" v-for="n in 10" :key="n" :style="{'--star-color':colorData[n%5]}"></div>
        </div> -->
        <!-- <div class='starIcon' v-for="n in 10" :key="n" :style="getStartStyle(n)"></div> -->
      </main>
    </div>
    <add-or-updata v-if="addOrUpdataVisible" ref="addOrUpdata" @init="addOrUpdataVisible = false"></add-or-updata>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { messages } from '@/i18n'
import loginFilter from '../../utils/login-filter'
import addOrUpdata from '@/views/modules/accountManagement4A/addOrUpdata'
export default {
  mixins: [loginFilter],
  components: {
    addOrUpdata
  },
  data () {
    return {
      i18nMessages: messages,
      captchaPath: '',
      tokenFailure: false, // 是否为外联程序token失效
      dataForm: {
        username: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      colorData: ['#FFFFFF', '#00FF00', '#FFFF00', '#00FFFF', '#C0C0C0'],
      addOrUpdataVisible: false
    }
  },
  computed: {
    dataRule () {
      return {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        password: [
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
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      let thisvm = this
      thisvm.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        let params = Object.assign({}, thisvm.dataForm)
        params.password = thisvm.encryptPassword(params.password)
        thisvm.$http.post('/auth/login', params).then(({ data: res }) => {
          if (res.code !== 0) {
            thisvm.getCaptcha()
            return thisvm.$message.error(res.msg)
          }
          this.loginSuccess(res)
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    accountApplication () {
      this.getdictList()
    },
    getdictList () {
      // 获取字典列表, 添加并全局变量保存
      this.$ctcLoading.open()
      this.$http.get('/sys/dict/type/all').then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.addOrUpdataVisible = true
        window.SITE_CONFIG['dictList'] = res.data
        this.$nextTick(() => {
          this.$refs.addOrUpdata.init('4A账号申请', '1')
        })
      }).catch(() => { this.$ctcLoading.close() })
    }
  }
}
</script>
<style lang="scss">
.aui-page__login {
  background-color: #fff;
  // background: url('../../assets/img/login_bg.jpg') no-repeat center center;
  background: url('../../assets/img/login3.jpeg') no-repeat center center;
  background-size: cover;
  position:relative;
  .aui-wrapper-mask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(117, 115, 115, 0.6);
  }
  .login-header {
    position: fixed;
    top: 20%;
    // right: 13%;
    text-shadow: 5px 5px 5px rgba(13, 63, 164, 0.5);
  }
  .login-body {
    position: fixed;
    /*top: 35%;*/
    top: 30%;
    // right: 10%;
    border-radius: 10px;
    background-color: rgba(17, 5, 110, 0.6);
    color: #fff;
    box-shadow: 11px 11px 3px 0px rgba(4, 7, 10, 0.44);
    // box-shadow: 11px 17px 3px 0px rgba(32, 101, 207, 0.44);
    z-index: 10;
    .login-title{
      font-size: 26px;
    }
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
</style>
