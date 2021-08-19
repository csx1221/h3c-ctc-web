<template>
  <el-dialog :visible.sync="visible" title="编辑资料" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true">
    <el-form class="main_el_form" :model="dataForm" ref="dataForm" :rules="rules" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="dataForm.realName"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <ctc-select v-model="dataForm.gender" dict-type="gender"></ctc-select>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="dataForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email"></el-input>
      </el-form-item>
      <el-form-item label="提醒形式" prop="noticeForm">
        <ctc-select v-model="dataForm.noticeForm" dict-type="noticeForm"></ctc-select>
      </el-form-item>
      <el-form-item label="提醒时间点" prop="noticeTime">
        <ctc-select v-model="dataForm.noticeTime" dict-type="noticeTime"></ctc-select>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { isEmail } from '@/utils/validate'
export default {
  name: 'main-navbar-edit-information',
  data () {
    let phone = (rule, value, callback) => {
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    let validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.email') })))
      }
      callback()
    }
    return {
      visible: false,
      dataForm: {},
      rules: {
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        mobile: [
          { required: true, validator: phone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        noticeForm: [
          { required: true, message: '请选择提醒形式', trigger: 'change' }
        ],
        noticeTime: [
          { required: true, message: '请选择提醒时间点', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init (list) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm = JSON.parse(JSON.stringify(list))
        for (var i in this.dataForm) {
          if (this.dataForm[i] === null) {
            this.dataForm[i] = ''
          }
        }
      })
    },
    dataFormSubmitHandle () {
      let newForm = {}
      newForm.id = this.dataForm.id
      newForm.realName = this.dataForm.realName
      newForm.gender = this.dataForm.gender
      newForm.email = this.dataForm.email
      newForm.mobile = this.dataForm.mobile
      newForm.noticeForm = this.dataForm.noticeForm
      newForm.noticeTime = this.dataForm.noticeTime
      newForm.pictureUrl = this.dataForm.pictureUrl
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$ctcLoading.open()
          this.$http.put('/sys/user/base', newForm).then(({ data: res }) => {
            this.$ctcLoading.close()
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.visible = false
              this.$emit('refresh')
            }
          }).catch((res) => {
            this.$ctcLoading.close()
          })
        } else {
          return false
        }
      })
    },
    handlePreview (file) {
      console.log(file)
    },
    httpRequest (data) {
      let _this = this
      let rd = new FileReader() // 创建文件读取对象
      let file = data.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onloadend = function (e) {
        _this.dataForm.file = this.result // this指向当前方法onloadend的作用域
      }
    }
  }
}
</script>

<style lang="scss">
.main_el_form {
  .el-select {
    width: 100%;
  }
}
</style>
