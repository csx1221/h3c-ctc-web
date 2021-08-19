<template>
  <el-dialog title="审核操作" :visible.sync="innerVisible" :close-on-click-modal="false" width="40%" class="product-approval">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-form-item prop="applyStatus" label="审核状态：">
            <el-select v-model="dataForm.applyStatus" placeholder="选择审核状态">
              <el-option label="通过" value="2">通过</el-option>
              <el-option label="不通过" value="3">不通过</el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="approvalOpinion" label="审批意见：">
            <el-input v-model="dataForm.approvalOpinion" :rows="4" placeholder="请输入审批意见" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <div class="grid-content bg-purple-dark"></div>
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ProductApproval',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        billIds: [],
        applyData: [],
        // 2审核通过 3审核不通过
        applyStatus: '2',
        approvalOpinion: ''
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
        approvalOpinion: [
          { required: true, message: '审批意见不允许为空', trigger: 'blur' },
          { required: true, message: '审批意见不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataForm.applyStatus = '2'
        this.dataForm.approvalOpinion = ''
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let thisvm = this
      thisvm.$refs['dataForm'].validate((valid) => {
        if (valid) {
          thisvm.dataForm.applyData.map((item, index) => {
            item.orderPerson = item.applicant
            item.orderPersonName = item.applicantName
          })
          let params = thisvm.dataForm
          thisvm.$http.post('/ctc/shop/productapply/save', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return thisvm.$message.error(res.msg)
            }
            thisvm.$message({
              message: thisvm.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                thisvm.handleDialogClose()
                thisvm.$emit('refreshDataList')
              }
            })
          }).catch(() => { })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.product-approval {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
  .el-select,
  .el-input-number,
  .el-date-editor {
    width: 100%;
  }
}
</style>
