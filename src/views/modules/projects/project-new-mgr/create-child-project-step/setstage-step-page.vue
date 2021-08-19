<template>
  <el-row>
    <el-col :span="18" class="split-line" style="text-align:left;">
      子项目阶段列表 <span style="color:#4190f7;padding-left:24px;">说明：因为任务要在各阶段下创建，所以请先设置当前项目涉及到的阶段信息</span>
    </el-col>
    <el-col :span="6" style="text-align:right;" v-if="projectData.readOnly==0">
      <el-button size="small" type="blue" v-if="$hasPermission('projects:create:addStage')" @click="doAddStage">添加阶段</el-button>
      <el-button size="small" type="blue" v-if="$hasPermission('projects:create:addStageTemplate')" @click="doAddStageTemplate">阶段模板</el-button>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-table stripe :data="stageTableData" border style="width: 100%;">
        <el-table-column prop="name" label="阶段名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="stageId" label="基础阶段" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel('stageType', scope.row.stageId) }}
          </template>
        </el-table-column>
        <el-table-column prop="planStartTime" label="开始日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="planEndTime" label="结束日期" header-align="center" align="center"></el-table-column>
        <el-table-column prop="memberCounts" label="成员数量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="memberNames" label="成员列表" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.memberNames.join("，")}}
          </template>
        </el-table-column>
        <el-table-column prop="stageStatus" label="阶段状态" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel('project.projectStatus', scope.row.stageStatus) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" v-if="projectData.readOnly==0">
          <template slot-scope="scope">
            <el-button @click="handleAddMemberClick(scope.row)" type="text" size="small">添加成员</el-button>
            <el-button @click="handleEditClick(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="handleDeleteClick(scope.row)" :disabled="[1,3].includes(scope.row.stageStatus)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <add-stage :visible.sync="addStage" ref="addStage" @watchChildMethod="triggerParentMethod"></add-stage>
    <add-stage-template :visible.sync="addStageTemplate" ref="addStageTemplate" @watchChildMethod="triggerParentMethod"></add-stage-template>
    <add-stage-member :visible.sync="addStageMember" ref="addStageMember" @watchChildMethod="triggerParentMethod"></add-stage-member>
  </el-row>
</template>
<script>
import addStage from './choose-dialog/add-stage'
import addStageTemplate from './choose-dialog/add-stage-template'
import addStageMember from './choose-dialog/add-stage-member'
export default {
  name: 'SetstageStepPage',
  components: {
    addStage, addStageTemplate, addStageMember
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      name: '',
      stageTableData: [],
      addStage: false,
      addStageTemplate: false,
      addStageMember: false
    }
  },
  computed: {},
  mounted () {
    let thisvm = this
    let index = 1
    let setIntervaltime = setInterval(() => {
      if (index === 10 || thisvm.stageTableData.length >= 2) {
        clearInterval(setIntervaltime)
      } else {
        thisvm.getStageData()
      }
      index++
    }, 1500)
    thisvm.getStageData()
  },
  methods: {
    triggerParentMethod (message) {
      // 判断是否是函数执行
      if (message.type === 'execute') {
        this.executeMethod(message)
      }
    },
    // 执行服务
    executeMethod (message) {
      if (message.postType === 'get') {
        this.$http.get(message.url, { params: { ...message.data } }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            if (message.data.reload) {
              this.getStageData()
            }
          }
        }).catch(() => {
        })
      } else {
        // 支持[put,post,delete]
        this.$http[message.postType](message.url, message.data).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            if (message.reload) {
              this.getStageData()
            }
          }
        }).catch(() => {
        })
      }
    },
    getStageData () {
      this.$ctcLoading.open()
      let params = { 'projectId': this.projectData.projectId, 'random': Math.random() }
      this.$http.get('/ctc/project/projectStage/list', { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('查询项目阶段数据失败')
        } else {
          this.stageTableData = res.data
        }
        this.$nextTick(() => {
          this.$ctcLoading.close()
        })
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    handleAddMemberClick (row) {
      this.$refs.addStageMember.parentProjectId = this.projectData.parentId
      this.$refs.addStageMember.projectId = this.projectData.projectId
      this.$refs.addStageMember.projectStageId = row.projectStageId
      this.$refs.addStageMember.stageId = row.stageId
      this.$refs.addStageMember.init()
    },
    handleEditClick (row) {
      this.$refs.addStage.projectId = this.projectData.projectId
      this.$refs.addStage.projectStageId = row.projectStageId
      this.$refs.addStage.readOnly = 0 // 0:编辑模式;1:只读模式
      this.$refs.addStage.init()
    },
    handleDeleteClick (row) {
      let result = this.validStageData('delete', row)
      if (result.isOk) {
        this.$confirm('确定进行[删除]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {}
          data.data = [row.projectStageId]
          let params = { 'type': 'execute', 'postType': 'delete', 'url': '/ctc/project/projectStage', 'reload': true }
          let saveParams = { ...params, 'data': data }
          this.executeMethod(saveParams)
        }).catch(() => {
        })
      }
    },
    // 校验项目阶段([用例评审、用例执行]必须包含用例设计)
    validStageData (type, row) {
      let result = { 'isOk': true }
      let stageTableData = this.stageTableData
      if (type === 'delete') {
        // 删除校验(5:用例设计;6:用例评审;7:用例执行)
        let stageId = row.stageId
        if (stageId === '5') {
          let stageNames = []
          stageTableData.forEach((item, index) => {
            if (['6', '7'].includes(item.stageId)) {
              stageNames.push(item.name)
            }
          })
          if (stageNames.length > 0) {
            this.$message.warning('删除【用例设计】阶段，必须先删除【' + stageNames.join('，') + '】阶段')
            result.isOk = false
          }
        }
      } else if (type === 'nextStep') {
        let designData = []
        let execReviewData = []
        stageTableData.forEach((item, index) => {
          if (['6', '7'].includes(item.stageId)) {
            execReviewData.push(item.name)
          } else if (['5'].includes(item.stageId)) {
            designData.push(item.name)
          }
        })
        if (execReviewData.length > 0 && designData.length === 0) {
          this.$message.warning('包含【' + execReviewData.join('，') + '】阶段，必须要有【用例设计】阶段')
          result.isOk = false
        }
      }
      return result
    },
    doAddStage () {
      this.$refs.addStage.stageTableData = this.stageTableData
      this.$refs.addStage.projectId = this.projectData.projectId
      this.$refs.addStage.projectStageId = ''
      this.$refs.addStage.readOnly = 0 // 0:编辑模式;1:只读模式
      this.$refs.addStage.dataForm.planStartTime = this.projectData.baseInfo.planStartTime
      this.$refs.addStage.dataForm.planEndTime = this.projectData.baseInfo.planEndTime
      this.$refs.addStage.init()
    },
    doAddStageTemplate () {
      this.$refs.addStageTemplate.stageTableData = this.stageTableData
      this.$refs.addStageTemplate.projectId = this.projectData.projectId
      this.$refs.addStageTemplate.planStartTime = this.projectData.baseInfo.planStartTime
      this.$refs.addStageTemplate.planEndTime = this.projectData.baseInfo.planEndTime
      this.$refs.addStageTemplate.init()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
