<template>
  <el-dialog title="用例评审" :visible.sync="innerVisible" :close-on-click-modal="false" width="50%" class="case-review">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="reviewstatus" label="评审结果：">
                <el-select v-model="dataForm.reviewstatus">
                  <el-option value="1" label="通过"></el-option>
                  <el-option value="2" label="不通过"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="operateLog" label="评审意见：">
                <el-input v-model="dataForm.operateLog" placeholder="请输入评审意见" :rows="5" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'CaseReview',
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
        reviewstatus: '1',
        operateLog: ''
      },
      dataRule: {
        operateLog: [
          { validator: this.validatorOperateLog, trigger: 'blur' },
          { validator: this.validatorOperateLog, trigger: 'change' }
        ]
      },
      caseIds: [],
      // 评审类型(1:单个评审;2:批量评审)
      reviewType: 1
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
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.dataForm.operateLog = ''
      })
    },
    validatorOperateLog (rule, value, callback) {
      if (this.dataForm.reviewstatus === '2' && this.dataForm.operateLog === '') {
        return callback(new Error('评审意见不允许为空，点击【确定】按钮，才会继续触发校验'))
      } else {
        callback()
      }
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = { ...this.dataForm }
          params.caseIds = this.caseIds
          // 修改：put
          this.$http.put('ctc/case/review', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.handleDialogClose()
                // 刷新表格
                this.$emit('watchChildPage', { 'type': 'reloadTable', 'data': {} })
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
.case-review {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
