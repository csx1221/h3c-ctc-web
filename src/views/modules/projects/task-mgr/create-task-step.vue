<template>
  <el-row class="task-el-container">
    <ctc-page-path ref="ctcPagePath"></ctc-page-path>
    <el-col :span="24" class="task-el-header">
      <el-divider content-position="left">{{activeName}}</el-divider>
    </el-col>
    <el-col :span="24" class="task-el-middle">
      <!--任务创建=基本信息-->
      <task-base-info-page v-if="activeIndex==0" ref="taskBaseInfoPage" :taskData="taskData" @watchChildMethod="triggerParentPage"></task-base-info-page>
    </el-col>
    <el-col :span="24" class="task-el-bottom">
      <el-button type="primary" size="small" @click="doStep(6)">取消</el-button>
      <el-button type="primary" size="small" @click="doStep(4)" v-if="taskData.readOnly==0">完成</el-button>
      <el-button type="primary" size="small" @click="doStep(5)" :disabled="taskData.operationType!=='add'&&taskData.baseInfo.taskStatus!==0" v-if="taskData.readOnly==0">立即启动</el-button>
    </el-col>
  </el-row>
</template>
<script>
import TaskBaseInfoPage from './create-task-step/task-base-info-page'
export default {
  name: 'CreateTaskPage',
  components: {
    TaskBaseInfoPage
  },
  data () {
    return {
      activeIndex: 0, // 当前激活状态
      activeName: '基本信息', // 当前激活状态名称
      taskData: {
        taskId: '',
        operationType: '',
        // 基础信息
        baseInfo: {
          name: ''
        },
        triggerObject: {
          // 触发类型(1:保存;)
          type: -1,
          random: -1
        },
        resultObject: {
          // 返回触发类型(1:保存成功;0:保存失败)
          type: -1,
          random: -1
        }
      },
      projectName: '',
      parentProjectName: ''
    }
  },
  watch: {
  },
  computed: {
  },
  mounted () {
    let params = this.$route.params
    // 0:编辑模式;1:只读模式
    params.readOnly = params.readOnly || 0
    let pagePathParams = params.pagePathParams || {}
    // 显示页面路径地址
    this.$refs.ctcPagePath.init(pagePathParams)
    this.taskData = { ...this.taskData, ...params }
    let operationType = this.taskData.operationType || 'add'
    let searchId = this.taskData.taskId
    let url = '/ctc/task/base/'
    if (operationType === 'update') {
      this.$http.get(url + searchId).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let data = res.data
          // 回显参测对象
          let participantList = data.participantList || []
          let tparticipantList = []
          participantList.forEach((item, index) => {
            tparticipantList.push(item.organizeId)
          })
          data.participantList = tparticipantList

          // 回显关联平台
          let relevanceList = data.relevanceList || []
          let trelevanceList = []
          relevanceList.forEach((item, index) => {
            trelevanceList.push(item.platformId)
          })
          data.relevanceList = trelevanceList
          data.relaPlatformList = data.relaPlatformList[0] || null
          this.taskData.taskId = searchId
          let { taskRelevanceInfo, ...baskInfo } = { ...params, ...data, 'parentProjectId': params.parentProjectId }
          this.taskData.baseInfo = baskInfo
          this.taskData.baseInfo.taskType = parseInt(data.taskType)
          this.taskData.baseInfo.taskName = data.taskName
        }
        // 触发加载任务基本信息
        this.$refs.taskBaseInfoPage.init()
      }).catch(() => { })
    } else {
      this.taskData.baseInfo = { ...params, taskType: '' }
      this.taskData.baseInfo.taskStatus = -1
    }
  },
  methods: {
    triggerParentPage (message) {
      console.log(message)
      this.parentProjectName = message.data.parentProjectName || ''
      this.projectName = message.data.projectName || ''
    },
    doStep (type) {
      // type(4:完成;5:立即启动;6:取消)
      this.taskData.triggerObject.type = type
      this.taskData.triggerObject.random = Math.random()
    }
  }
}
</script>
<style lang="scss" scoped>
.task-el-container {
  height: 100%;
  padding: 24px;
  background: #ffffff;
  .task-el-header {
    /*height: 100px;*/
    /*margin-top: 20px;*/
    margin-bottom: 20px;
    .el-divider__text.is-left {
      color: #17b3a3;
      font-size: 20px;
    }
  }
  .task-el-middle {
    height: 80%;
    /*min-height: 580px;*/
    margin-bottom: 50px;
  }
  .task-el-bottom {
    text-align: center;
    /*position: fixed;*/
    right: 15px;
    bottom: 0px;
    z-index: 2;
    width: 90%;
    background: #ffffff;
    .el-button {
      margin: 12px 40px 50px 40px;
    }
  }
}
</style>
