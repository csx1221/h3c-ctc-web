<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form label-position="right" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="160px">
      <el-form-item prop="bizName" label="字典名称">
        <el-input v-model="dataForm.bizName" :placeholder="$t('params.paramCode')"></el-input>
      </el-form-item>
      <el-form-item prop="bizValue" label="字典值">
        <el-input v-model="dataForm.bizValue" :placeholder="$t('params.paramValue')"></el-input>
      </el-form-item>
      <el-form-item prop="comments" label="备注">
        <el-input v-model="dataForm.comments" :placeholder="$t('params.remark')"></el-input>
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
        pid: '',
        applicationId: '',
        bizName: '',
        bizValue: '',
        comments: '',
        status: '0'
      }
    }
  },
  computed: {
    dataRule () {
      return {
        bizName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        bizValue: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.dataForm.pid = ''
      this.dataForm.createDt = ''
      this.dataForm.creator = ''
      this.dataForm.updateDt = ''
      this.dataForm.deleteFlag = 0
      this.dataForm.applicationId = ''
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
      this.$http.get(`/ctc/servicebus/routedic/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.dataForm.status = Number(this.dataForm.status)
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/ctc/servicebus/routedic', this.dataForm).then(({ data: res }) => {
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
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
