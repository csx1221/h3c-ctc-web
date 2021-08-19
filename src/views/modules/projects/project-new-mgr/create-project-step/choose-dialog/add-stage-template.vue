<template>
  <el-dialog title="阶段模板" :visible.sync="innerVisible" :close-on-click-modal="false" width="45%" class="add-stage">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-form-item prop="stageTemplateId" label="选择阶段模板：">
            <el-select v-model="dataForm.stageTemplateId" placeholder="选择阶段模板" @change="chooseStage">
              <el-option v-for="data in dataList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue">{{data.dictLabel}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="stageTemplateDesc" label="阶段模板说明：">
            <el-tag v-for="(item,index) in stageTemplateData" :key="index" style="margin-right:10px;">{{item.name}}</el-tag>
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
import { getDictDataList } from '@/utils'
export default {
  name: 'addStageTemplate',
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
      planStartTime: '',
      planEndTime: '',
      stageTemplateDesc: '',
      dataList: getDictDataList('stageTemplate'),
      stageTemplateData: [],
      dataForm: {
        stageTemplateId: ''
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
        stageTemplateId: [
          { required: true, message: '请选择阶段模板', trigger: 'blur' }
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
        this.dataForm.stageTemplateId = ''
        this.stageTemplateData = []
        Promise.all([
        ]).then((result) => {
        })
      })
    },
    chooseStage (item) {
      let itemArr = item.split(',')
      let stageTemplateData = []
      itemArr.forEach((titem, tindex) => {
        let tmp = {}
        tmp.projectId = this.projectId
        tmp.stageId = titem
        tmp.name = this.$getDictLabel('stageType', titem)
        tmp.stageStatus = 0
        tmp.planStartTime = this.planStartTime
        tmp.planEndTime = this.planEndTime
        stageTemplateData.push(tmp)
      })
      this.stageTemplateData = stageTemplateData
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 自动合并阶段模板和已添加的数据
          let filterData = this.stageTemplateData
          if (filterData.length > 0) {
            let params = { 'type': 'execute', 'postType': 'post', 'url': '/ctc/project/projectStage/saveTemplate', 'reload': true }
            this.$emit('watchChildMethod', { ...params, 'data': filterData })
          }
          this.handleDialogClose()
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
