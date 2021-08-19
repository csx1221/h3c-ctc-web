<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" class="platform-add-or-update">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px" :disabled="dataForm.readOnly==1">
      <el-form-item prop="name" label="平台名称：">
        <el-input v-model="dataForm.name" type="text" placeholder="请输入平台名称"></el-input>
      </el-form-item>
      <el-form-item prop="remark" label="平台备注：">
        <el-input v-model="dataForm.remark" placeholder="请输入平台备注" :rows="4" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer" v-if="dataForm.readOnly==0">
      <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button size="small" type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
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
        name: '',
        remark: '',
        readOnly: 0 // 0:编辑模式;1:只读模式
      }
    }
  },
  watch: {
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '平台名称不允许为空', trigger: 'blur' },
          { required: true, message: '平台名称不允许为空', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '平台备注不允许为空', trigger: 'blur' },
          { required: true, message: '平台备注不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id !== '' && this.dataForm.id !== undefined) {
          this.getPlatformInfo()
        }
      })
    },
    getPlatformInfo () {
      this.$http.get(`/sys/platform/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.dataForm = { ...this.dataForm, ...res.data }
        }
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        // 新增：post;修改：put
        this.$http[!this.dataForm.id ? 'post' : 'put']('sys/platform', this.dataForm).then(({ data: res }) => {
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
<style  lang="scss">
.platform-add-or-update {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
</style>
