<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.roteId ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '180px'">
      <el-form-item label="业务类型" prop="type">
        <ctc-select v-model="dataForm.type" dict-type="businessTypes" placeholder="请选择业务类型"></ctc-select>
      </el-form-item>
      <el-form-item label="请求方法" prop="method">
        <el-input v-model="dataForm.method" placeholder="请求方法"></el-input>
      </el-form-item>
      <el-form-item label="内网地址" prop="defaultUrl">
        <el-input v-model="dataForm.defaultUrl" placeholder="请输入内网地址"></el-input>
      </el-form-item>
      <el-form-item label="外网地址" prop="outerUrl">
        <el-input v-model="dataForm.outerUrl" placeholder="请输入外网地址"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        roteId: '',
        applicationId: this.$route.params.applicationId,
        type: '',
        method: '',
        defaultUrl: '',
        outerUrl: '',
        creator: '',
        createDt: '',
        updater: '',
        updateDt: '',
        deleteFlag: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        applicationId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        type: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        method: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        defaultUrl: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        outerUrl: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        creator: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        createDt: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updater: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        updateDt: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        deleteFlag: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/ctc/subadmin/application/business/url/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/ctc/subadmin/application/business/url', this.dataForm).then(({ data: res }) => {
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
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
