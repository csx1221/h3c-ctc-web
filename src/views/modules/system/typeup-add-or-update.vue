<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="bizName" label="类型名称">
        <el-input v-model="dataForm.bizName" :placeholder="$t('params.paramCode')"></el-input>
      </el-form-item>
      <el-form-item prop="bizValue" label="类型值">
        <el-input v-model="dataForm.bizValue" :placeholder="$t('params.paramValue')"></el-input>
      </el-form-item>
      <el-form-item prop="orderNumber" :label="$t('dict.sort')">
        <el-input-number v-model="dataForm.orderNumber" controls-position="right" :min="0" :label="$t('dict.sort')"></el-input-number>
      </el-form-item>
      <el-form-item prop="commonts" :label="$t('dict.remark')">
        <el-input v-model="dataForm.commonts" :placeholder="$t('dict.remark')"></el-input>
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
        bizName: '',
        bizValue: '',
        paramCode: '',
        paramValue: '',
        orderNumber: '',
        commonts: '',
        remark: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        bizValue: [
          { required: true, message: '请输入类型值', trigger: 'blur' }
        ],
        bizName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
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
      this.$http.get(`/ctc/subadmin/permissiondic/authtype/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/ctc/subadmin/permissiondic/authtype', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.dataForm.pid = ''
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
