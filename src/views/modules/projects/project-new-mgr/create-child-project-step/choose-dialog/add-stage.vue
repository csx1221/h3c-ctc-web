<template>
  <el-dialog title="添加阶段" :visible.sync="innerVisible" :close-on-click-modal="false" width="45%" class="add-stage">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-form-item prop="stageId" label="基础阶段：">
            <el-select v-model="dataForm.stageId" placeholder="请选择基础阶段" @change="chooseStage" :disabled="projectStageId!=''">
              <el-option v-for="data in dataList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue" :disabled="data.disabled">{{data.dictLabel}}</el-option>
            </el-select>
            <span style="color:#4190f7;">说明：要创建【用例评审、用例执行】阶段，必须先创建【用例设计】阶段</span>
          </el-form-item>
          <el-form-item prop="name" label="阶段名称：">
            <el-input v-model="dataForm.name" placeholder="请输入阶段名称"></el-input>
          </el-form-item>
          <el-form-item prop="planStartTime" label="开始日期：">
            <el-date-picker v-model="dataForm.planStartTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsStart" placeholder="请选择计划开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="planEndTime" label="结束日期：">
            <el-date-picker v-model="dataForm.planEndTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsEnd" placeholder="请选择计划结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="description" label="阶段描述：">
            <el-input v-model="dataForm.description" placeholder="请输入阶段描述" :rows="5" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div :span="24" class="selected">
      <el-button size="small" @click="handleDialogClose">关闭</el-button>
      <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'addStage',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      stageTableData: [],
      projectId: '',
      projectStageId: '',
      dataList: [],
      dataForm: {
        name: '',
        stageId: '',
        planStartTime: '',
        planEndTime: ''
      },
      pickerOptionsStart: {
        disabledDate: time => {
          const endDateVal = new Date(this.dataForm.planEndTime).getTime()
          if (endDateVal) {
            return time.getTime() > endDateVal - 0
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const beginDateVal = new Date(this.dataForm.planStartTime).getTime()
          if (beginDateVal) {
            return time.getTime() < beginDateVal - 0
          }
        }
      }
    }
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
        name: [
          { required: true, message: '阶段名称不允许为空', trigger: 'blur' }
        ],
        stageId: [
          { required: true, message: '阶段名称不允许为空', trigger: 'blur' }
        ],
        planStartTime: [
          { required: true, message: '计划开始时间不允许为空', trigger: 'blur' }
        ],
        planEndTime: [
          { required: true, message: '计划结束时间不允许为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataForm.stageId = ''
        this.dataForm.name = ''
        this.getStageType()
        if (this.projectStageId !== '' && this.projectStageId !== undefined) {
          this.getProjectStageById()
        }
      })
    },
    getStageType () {
      // 判断用例设计阶段是否存在
      let hasCaseDesign = false
      this.stageTableData.forEach((item, index) => {
        if (item.stageId === '5') {
          hasCaseDesign = true
        }
      })
      let dataList = this.$getDictDataList('stageType')
      dataList.map((item, index) => {
        if (['6', '7'].includes(item.dictValue)) {
          if (hasCaseDesign) {
            item.disabled = false
          } else {
            item.disabled = true
          }
        } else {
          item.disabled = false
        }
      })
      this.dataList = dataList
    },
    chooseStage (item) {
      let dictLabel = this.$getDictLabel('stageType', item)
      this.dataForm.name = dictLabel
    },
    getProjectStageById () {
      this.$http.get(`/ctc/project/projectStage/${this.projectStageId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.dataForm = { ...this.dataForm, ...res.data }
        }
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.projectStageId !== '' && this.projectStageId !== undefined) {
            let updateData = { 'projectId': this.projectId, ...this.dataForm }
            // 新增：post;修改：put;删除：delete
            let updateParams = { 'type': 'execute', 'postType': 'put', 'url': '/ctc/project/projectStage', 'reload': true }
            this.$emit('watchChildMethod', { ...updateParams, 'data': updateData })
          } else {
            // 判断添加阶段是否已存在
            let bool = false
            this.stageTableData.forEach((item, index) => {
              if (item.stageId === this.dataForm.stageId) {
                bool = true
              }
            })
            if (bool) {
              this.$message.warning('基础阶段已存在，不允许重复添加!')
            } else {
              let insertData = [{ 'projectId': this.projectId, ...this.dataForm }]
              let insertParams = { 'type': 'execute', 'postType': 'post', 'url': '/ctc/project/projectStage', 'reload': true }
              this.$emit('watchChildMethod', { ...insertParams, 'data': insertData })
              this.handleDialogClose()
            }
          }
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.add-stage {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
