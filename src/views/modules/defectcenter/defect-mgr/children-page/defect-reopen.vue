<template>
  <el-dialog title="重新打开" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="defect-reopn">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="90px">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="operationDesc" label="缺陷描述:">
                <el-input v-model="dataForm.operationDesc" placeholder="请输入缺陷描述" :rows="5" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="defectAttachementId" label="上传附件:">
                <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.defectAttachementId" style="cursor:pointer;"></ctc-file-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">打 开</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import debounce from 'lodash/debounce'
export default {
  name: 'DefectReopen',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defectId: '',
      dataForm: {
        operationDesc: '',
        defectAttachementId: ''
      }
    }
  },
  watch: {
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    dataRule () {
      return {
        operationDesc: [
          { required: true, message: '请输入缺陷描述', trigger: 'blur' },
          { required: true, message: '请输入缺陷描述', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    init () {
      let thisvm = this
      thisvm.innerVisible = true
      thisvm.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        thisvm.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 50, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpeg', '.jpg', '.zip', '.rar', '.mp4'] }
        thisvm.$refs.ctcFileUpload.init()
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm: debounce(function () {
      let thisvm = this
      // 自动触发缺陷附件上传
      thisvm.$refs.ctcFileUpload.doFileUploadAction(function (attachmentId) {
        thisvm.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let params = {}
            params.defectId = [thisvm.defectId]
            params.operation = 11
            params.operationDesc = thisvm.dataForm.operationDesc
            params.attachementId = thisvm.dataForm.defectAttachementId
            thisvm.$http.post('/ctc/defect/base/deal', params).then(({ data: res }) => {
              if (res.code !== 0) {
                thisvm.$message.error(res.msg)
              } else {
                thisvm.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    thisvm.$emit('watchChildPage')
                    thisvm.handleDialogClose()
                  }
                })
              }
            }).catch(() => { })
          }
        })
      })
    }, 2000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style lang="scss" scoped>
.defect-reopn {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
  .el-card-defect {
    i {
      font-size: 20px;
      color: #4190f7;
    }
  }
}
</style>
