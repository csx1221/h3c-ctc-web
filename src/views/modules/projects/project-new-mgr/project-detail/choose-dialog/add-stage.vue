<template>
  <el-dialog title="编辑阶段基本信息" :visible.sync="innerVisible" :close-on-click-modal="false" width="45%" class="add-stage">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" :disabled="readOnly==1">
          <el-form-item prop="stageId" label="基础阶段：">
            <el-select v-model="dataForm.stageId" placeholder="请选择基础阶段" @change="chooseStage" :disabled="projectStageId!=''">
              <el-option v-for="data in dataList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue">{{data.dictLabel}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name" label="阶段名称：">
            <el-input v-model="dataForm.name" placeholder="请输入阶段名称"></el-input>
          </el-form-item>
          <el-form-item prop="planStartTime" label="开始日期：">
            <el-date-picker v-model="dataForm.planStartTime" type="date" :picker-options="pickerOptionsStart" placeholder="请选择计划开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="planEndTime" label="结束日期：">
            <el-date-picker v-model="dataForm.planEndTime" type="date" :picker-options="pickerOptionsEnd" placeholder="请选择计划结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="description" label="阶段描述：">
            <el-input v-model="dataForm.description" placeholder="请输入阶段描述" :rows="5" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div :span="24" class="selected" v-if="readOnly==0">
      <el-button size="small" @click="handleDialogClose">关闭</el-button>
      <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDictDataList } from '@/utils'
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
      readOnly: 0,
      stageTableData: [],
      projectId: '',
      projectStageId: '',
      dataList: getDictDataList('stageType'),
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
      this.$nextTick(() => {
        this.innerVisible = true
        this.dataForm.stageId = ''
        this.dataForm.name = ''
        if (this.projectStageId !== '' && this.projectStageId !== undefined) {
          Promise.all([
            this.getProjectStageById()
          ]).then((result) => {
          })
        } else {
        }
      })
    },
    handleDialogClose () {
      this.innerVisible = false
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
    executeSaveUpdateStage (message) {
      this.$http[message.postType](message.url, message.data).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message.success('操作成功')
        }
      }).catch(() => { })
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.projectStageId !== '' && this.projectStageId !== undefined) {
            let updateData = { 'projectId': this.projectId, ...this.dataForm }
            // 新增：post;修改：put;删除：delete
            let updateParams = { 'type': 'execute', 'postType': 'put', 'url': '/ctc/project/projectStage', 'reload': true }
            let message = { ...updateParams, 'data': updateData }
            this.executeSaveUpdateStage(message)
            this.$emit('watchChildMethod', message)
            this.handleDialogClose()
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
              let message = { ...insertParams, 'data': insertData }
              this.executeSaveUpdateStage(message)
              this.$emit('watchChildMethod', message)
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
