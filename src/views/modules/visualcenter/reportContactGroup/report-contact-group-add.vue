<template>
  <el-dialog :visible.sync="visible" @close="closeToast" width="50%" :title="!dataForm.id ? $t('add') : $t('update')" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form max-height="480" label-position="left" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="130px">
      <el-form-item prop="contactGroupName" label="联系组名称">
        <el-input v-model="dataForm.contactGroupName" :placeholder="$t('params.paramValue')"></el-input>
      </el-form-item>
      <el-form-item prop="acceptAccounts" label="收件人邮箱">
        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="dataForm.acceptAccounts" placeholder="请输入正确的邮箱地址，多个邮箱请使用英文逗号分割"></el-input>
      </el-form-item>
      <el-form-item prop="copyAccounts" label="抄送人邮箱">
        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="dataForm.copyAccounts" placeholder="请输入正确的邮箱地址，多个邮箱请使用英文逗号分割"></el-input>
      </el-form-item>
      <el-form-item prop="mailContentBegin" label="邮件正文开头">
        <el-input v-model="dataForm.mailContentBegin" :placeholder="$t('params.paramValue')"></el-input>
      </el-form-item>
      <el-form-item style="display: flex;justify-content: center;align-items: center;">
        <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
        <el-button size="small" type="primary" @click="dataFormSubmitHandle()">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
import debounce from 'lodash/debounce'
import { isEmail } from '@/utils/validate'
export default {
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        activatedIsNeed: false
      },
      visible: false,
      dataForm: {
        contactGroupId: '',
        contactGroupName: '',
        acceptAccounts: '',
        copyAccounts: '',
        mailContentBegin: ''
      }
    }
  },
  components: {
  },
  computed: {
    dataRule () {
      return {
        contactGroupName: [
          { required: true, message: '联系组名称不允许为空', trigger: 'blur' },
          { required: true, message: '联系组名称不允许为空', trigger: 'change' }
        ],
        acceptAccounts: [
          { required: true, validator: this.validatorOperateLog, trigger: 'blur' },
          { required: true, validator: this.validatorOperateLog, trigger: 'change' }
        ],
        copyAccounts: [
          { required: true, validator: this.validatorOperateLog, trigger: 'blur' },
          { required: true, validator: this.validatorOperateLog, trigger: 'change' }
        ],
        mailContentBegin: [
          { required: true, message: '邮件正文开头不允许为空', trigger: 'blur' },
          { required: true, message: '邮件正文开头不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.dataForm.projectBaseinfoDtos = []
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.contactGroupId) {
          this.getInfo()
        } else {
          this.dataForm.projectBaseinfoDtos = []
        }
      })
    },
    validatorOperateLog (rule, value, callback) {
      if (value) {
        value = value.trim()
        // 第一步：校验邮箱分隔符是否正确
        // 按@符号分割
        let regex = new RegExp('@', 'g')
        let emailASplit = value.match(regex)
        emailASplit = emailASplit || []
        let tregex = new RegExp(',', 'g')
        let emailDSplit = value.match(tregex)
        emailDSplit = emailDSplit || []
        if (emailASplit.length > 0) {
          if (emailASplit.length === 1 && emailDSplit.length === 0) {
            // 第一步：校验邮箱地址是否正确
            let emailArr = value.split(',')
            emailArr.forEach((item, index) => {
              if (!isEmail(item)) {
                return callback(new Error(item + '邮箱地址不正确'))
              }
            })
            callback()
          } else if (emailDSplit.length > 0 && (emailASplit.length >= (emailDSplit.length + 1))) {
            // 第一步：校验邮箱地址是否正确
            let emailArr = value.split(',')
            emailArr.forEach((item, index) => {
              if (!isEmail(item)) {
                return callback(new Error(item + '邮箱地址不正确'))
              }
            })
            callback()
          } else {
            return callback(new Error('分隔符格式不匹配，(分隔符不是英文逗号、分隔符数量不匹配)'))
          }
        } else {
          return callback(new Error('邮箱地址不正确'))
        }
      } else {
        return callback(new Error('邮箱不允许为空'))
      }
    },
    // 获取信息
    getInfo () {
      this.$http.get(`ctc/visualization/report/getContactGroupById/${this.dataForm.contactGroupId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = { ...this.dataForm, ...res.data }
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.d1 = this.dataForm
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.contactGroupId ? 'post' : 'put'](!this.dataForm.contactGroupId ? '/ctc/visualization/report/contactGroupSave' : '/ctc/visualization/report/contactGroupUpdate', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    closeToast () {
      this.$refs['dataForm'].resetFields()
    }
  }
}
</script>
