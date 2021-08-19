<template>
  <el-dialog title="用例下发" :visible.sync="innerVisible" :close-on-click-modal="false" width="50%" class="ref-case">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="issueTaskId" label="下发到：">
                <el-radio-group v-model="dataForm.issueTaskId">
                  <el-radio :label="item.taskId" border v-for="(item,index) in issueTaskIdsData" :key="index">{{item.taskName}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <div class="grid-content bg-purple-dark"></div>
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" :disabled="confirmBtn" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'CaseIssue',
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
        issueTaskId: '', // 下发选择的任务
        caseIds: [],
        issueType: '' // 1 评审下发;2 执行下发
      },
      issueTaskIdsData: [],
      confirmBtn: false
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
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.confirmBtn = false
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmBtn = true
          this.$ctcLoading.open()
          let params = this.dataForm
          this.$http.post('/ctc/case/caseInfo/doIssue', params).then(({ data: res }) => {
            this.confirmBtn = false
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$ctcLoading.close()
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
          }).catch(() => {
            this.$ctcLoading.close()
          })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.ref-case {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
