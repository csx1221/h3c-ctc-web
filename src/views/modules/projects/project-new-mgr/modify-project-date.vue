<template>
  <el-dialog title="调整项目周期" :visible.sync="innerVisible" :close-on-click-modal="false" width="30%" class="case-review">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="planStartTime" label="开始日期：">
                <el-date-picker v-model="dataForm.planStartTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsStart" placeholder="请选择计划开始日期" :disabled="true">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="planEndTime" label="结束日期：">
                <el-date-picker v-model="dataForm.planEndTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsEnd" placeholder="请选择计划结束日期">
                </el-date-picker>
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
  name: 'ModifyProjectDate',
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
        planStartTime: '',
        planEndTime: '',
        maxPlanEndTime: ''
      },
      parentId: '',
      projectId: '',
      pickerOptionsStart: {
        disabledDate: time => {
          const dateVal = new Date().getTime()
          if (dateVal) {
            const endDateVal = new Date(this.dataForm.planEndTime).getTime()
            if (endDateVal) {
              return time.getTime() < dateVal - 86400000 || time.getTime() > endDateVal - 0
            } else {
              return time.getTime() < dateVal - 86400000
            }
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const dateVal = new Date().getTime()
          if (dateVal) {
            const beginDateVal = new Date(this.dataForm.planStartTime).getTime()
            if (beginDateVal) {
              const maxEndDateVal = new Date(this.dataForm.maxPlanEndTime).getTime()
              if (maxEndDateVal) {
                return time.getTime() < dateVal - 86400000 || time.getTime() < beginDateVal - 86400000 || time.getTime() > maxEndDateVal
              } else {
                return time.getTime() < dateVal - 86400000 || time.getTime() < beginDateVal - 86400000
              }
            } else {
              return time.getTime() < dateVal - 86400000
            }
          }
        }
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
        planStartTime: [
          { required: true, message: '计划开始时间不允许为空', trigger: 'blur' },
          { required: true, message: '计划开始时间不允许为空', trigger: 'change' }
        ],
        planEndTime: [
          { required: true, message: '计划结束时间不允许为空', trigger: 'blur' },
          { required: true, message: '计划结束时间不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataForm.maxPlanEndTime = ''
        // 只有子项目调整周期，会去触发加载父项目信息
        this.getProjectInfoById()
      })
    },
    getProjectInfoById () {
      let projectId = this.parentId
      if (projectId) {
        this.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('获取项目基本信息失败')
          } else {
            let data = res.data
            this.dataForm.maxPlanEndTime = data.planEndTime
          }
        }).catch(() => { })
      }
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {}
          // 设置为正常在测
          params.projectStatus = 1
          params.planEndTime = this.dataForm.planEndTime
          params.projectId = this.projectId || this.parentId
          this.$http.post('/ctc/project/projectBase/updateProjectCycle', params).then(({ data: res }) => {
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
                this.$emit('watchChildMethod', { 'type': 'modifyProjectDate', 'data': {} })
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
