<template>
  <el-dialog :visible.sync="visible" :title="$t('updatePassword.title')" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item :label="$t('updatePassword.username')">
        <span>{{realName}}</span>
      </el-form-item>
      <el-form-item prop="password" :label="$t('updatePassword.password')">
        <el-input v-model="dataForm.password" type="password" :placeholder="$t('updatePassword.password')"></el-input>
      </el-form-item>
      <el-form-item prop="newPassword" :label="$t('updatePassword.newPassword')">
        <el-input v-model="dataForm.newPassword" type="password" :placeholder="$t('updatePassword.newPassword')"></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" :label="$t('updatePassword.confirmPassword')">
        <el-input v-model="dataForm.confirmPassword" type="password" :placeholder="$t('updatePassword.confirmPassword')"></el-input>
      </el-form-item>
      <el-form-item prop="passwordStrong" label="密码强度">
        <el-button-group>
          <el-button size="mini" :type="dataForm.passwordStrong>1?'danger':'info'">弱</el-button>
          <el-button size="mini" :type="dataForm.passwordStrong>3?'warning':'info'">中</el-button>
          <el-button size="mini" :type="dataForm.passwordStrong>5?'success':'info'">强</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" size="small" :disabled="dataForm.passwordStrong<6" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import { clearLoginInfo } from '@/utils'
import CryptoJS from 'crypto-js'
export default {
  data () {
    return {
      visible: false,
      realName: Cookies.get('realName'),
      dataForm: {
        password: '',
        newPassword: '',
        confirmPassword: '',
        passwordStrong: 1 // 密码强度
      },
      noPassRule: [], // 校验不通过规则
      passwordValid: {
        '1': '密码至少包含1位数字',
        '2': '密码至少包含1位小写字母',
        '3': '密码至少包含1位大写字母',
        '4': '密码至少包含1位特殊字符[!#$%]',
        '5': '密码中字符[{}]最多允许重复3次',
        '6': '新旧密码至少要有3个字符不同'
      }
    }
  },
  watch: {
    'dataForm.newPassword' (newVal, oldVal) {
      this.checkStrong()
    }
  },
  computed: {
    dataRule () {
      var validateNewPassword = (rule, value, callback) => {
        if (this.noPassRule.length > 0) {
          return callback(new Error(this.noPassRule[0]))
        } else {
          if (!value) {
            return callback(new Error('必填项不能为空'))
          } else if (this.dataForm.newPassword.length <= 8) {
            return callback(new Error('密码长度必须大于8'))
          } else {
            callback()
          }
        }
      }
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          return callback(new Error(this.$t('updatePassword.validate.confirmPassword')))
        }
        callback()
      }
      return {
        password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        newPassword: [
          { validator: validateNewPassword, trigger: 'blur' },
          { validator: validateNewPassword, trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    checkStrong () {
      let passRule = []
      let noPassRule = []
      let sValue = this.dataForm.newPassword
      // 正则表达式验证符合要求的
      if (/\d/.test(sValue)) {
        // 数字
        passRule.push('通过')
      } else {
        noPassRule.push(this.passwordValid['1'])
      }
      if (/[a-z]/.test(sValue)) {
        // 小写
        passRule.push('通过')
      } else {
        noPassRule.push(this.passwordValid['2'])
      }
      if (/[A-Z]/.test(sValue)) {
        // 大写
        passRule.push('通过')
      } else {
        noPassRule.push(this.passwordValid['3'])
      }
      if (/[!|#|$|%]/.test(sValue)) {
        // 特殊字符
        passRule.push('通过')
      } else {
        noPassRule.push(this.passwordValid['4'])
      }
      // 校验单个字符是否重复3次
      let repeatCount3 = ''
      for (let idx = 0; idx < sValue.length; idx++) {
        let char = sValue.charAt(idx)
        let count = this.matchChartRepeatCount(sValue, char)
        if (count > 3) {
          repeatCount3 = char
        }
      }
      if (repeatCount3) {
        let temp = this.passwordValid['5'].replace('{}', repeatCount3)
        noPassRule.push(temp)
      } else {
        passRule.push('通过')
      }
      // 校验新旧密码要有三个字符不同
      let charDifferent = 0
      let password = this.dataForm.password
      let newPassword = this.dataForm.newPassword
      let passwordLen = password.length > newPassword.length ? newPassword.length : password.length
      let diffLen = Math.abs(password.length - newPassword.length)
      for (let idx = 0; idx < passwordLen; idx++) {
        if (password.charAt(idx) !== newPassword.charAt(idx)) {
          charDifferent++
        }
      }
      if (diffLen < 3 && charDifferent < 3) {
        noPassRule.push(this.passwordValid['6'])
      } else {
        passRule.push('通过')
      }
      this.dataForm.passwordStrong = passRule.length
      this.noPassRule = noPassRule
    },
    matchChartRepeatCount (str, mChar) {
      // eslint-disable-next-line no-eval
      let rule = eval('/' + mChar + '/ig')
      return str.match(rule) ? str.match(rule).length : 0
    },
    encryptPassword (password) {
      let key = CryptoJS.enc.Latin1.parse('dufy20200904java')
      let iv = CryptoJS.enc.Latin1.parse('dufy20200904java')
      let encryptPwd = CryptoJS.AES.encrypt(password, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString()
      return encodeURIComponent(encryptPwd)
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      let thisvm = this
      thisvm.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        let params = Object.assign({}, thisvm.dataForm)
        params.password = thisvm.encryptPassword(params.password)
        params.newPassword = thisvm.encryptPassword(params.newPassword)
        params.confirmPassword = thisvm.encryptPassword(params.confirmPassword)
        thisvm.$http.put('/sys/user/password', params).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          thisvm.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              thisvm.visible = false
              clearLoginInfo()
              thisvm.$router.replace({ name: 'login' })
            }
          })
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
