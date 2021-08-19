<template>
  <el-row class="finish-step" v-if="projectData.readOnly==0">
    <el-col :span="24" style="text-align:center;margin-top:15%;">
      <el-button type="primary" round @click="doStartProjectStage" v-if="showStageBtn">启动任务</el-button>
      <el-button type="primary" round @click="doCreate">创建任务</el-button>
      <el-button type="info" round @click="doCancel">取 消</el-button>
    </el-col>
    <!--引入是否省份自测-->
    <province-test ref="provinceTest" :visible.sync="provinceTest" @watchChildPage="triggerParentMethod"></province-test>
  </el-row>
</template>
<script>
import { addDynamicRoute, removeCurrentTabsHandle } from '@/router'
import ProvinceTest from '@/views/modules/projects/task-mgr/taskConfigure/province-test.vue'
export default {
  name: 'FinishStepPage',
  components: {
    ProvinceTest
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      provinceTest: false,
      showStageBtn: true
    }
  },
  watch: {
    'projectData': {
      deep: true,
      handler: function (newVal, oldVal) {
        if (newVal.triggerObject.type === 3) {
          this.getProjectStageStatus()
        }
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    triggerParentMethod (message) {
      // 判断是否是函数执行
      if (message.type === 'startExecute') {
        let mg = message.message
        let data = message.data
        this.executeHttpsService(mg, data)
      }
    },
    getProjectStageStatus () {
      let params = { 'projectId': this.projectData.baseInfo.projectId }
      this.$http.get('/ctc/project/projectStage/projectStageStartFlag', { 'params': params }).then(({ data: res }) => {
        this.showStageBtn = res.status
        this.stageData = res.stageData
      })
    },
    doStartProjectStage () {
      this.$confirm('确定进行任务启动操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 判断是否有执行类型阶段
        let hasExecTask = false
        let projectStageIds = []
        let stageData = this.stageData
        stageData.forEach((item, index) => {
          if (item.stageId === '7') {
            hasExecTask = true
          }
          projectStageIds.push(item.projectStageId)
        })
        let projectInfo = this.projectData.baseInfo
        let message = { 'url': '/ctc/task/base/startTaskBatch', 'postType': 'post', 'reload': true }
        let data = { 'projectId': projectInfo.projectId, 'projectStageIds': projectStageIds }
        // 存在执行类阶段，需要判断项目范围是否是非集中化
        if (hasExecTask) {
          let scope = projectInfo.scope
          if (Number(scope) === 1) {
            this.executeHttpsService(message, data)
          } else {
            this.executeProvinceTestStart(message, data)
          }
        } else {
          this.executeHttpsService(message, data)
        }
      })
    },
    // 执行选择省份自测启动
    executeProvinceTestStart (message, data) {
      this.$refs.provinceTest.message = message
      this.$refs.provinceTest.executeParams = data
      this.$refs.provinceTest.init()
    },
    executeHttpsService (message, data) {
      this.$ctcLoading.open()
      // 支持[put,post,delete]
      this.$http[message.postType](message.url, data).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message.success('操作成功')
          if (message.reload) {
            this.getProjectStageStatus()
          }
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    doCreate () {
      // 继续操作
      let parentId = this.projectData.parentId || ''
      let projectId = this.projectData.projectId || ''
      let projectName = this.projectData.baseInfo.name || ''
      let type = this.projectData.type
      let title = '新建任务'
      let params = { 'parentId': parentId, 'projectId': projectId || '', 'projectName': projectName, 'type': type }
      // 组装当前路径参数
      let pagePathParams = { 'pageName': '项目管理', 'id': '', 'type': '' }
      // 兼容其他功能父项目键值不统一
      params.parentProjectId = params.parentId
      params.projectStageId = ''
      params.operationType = 'add'
      // 设置当前路径参数
      pagePathParams.type = 'project'
      pagePathParams.id = projectId
      params.pagePathParams = pagePathParams
      this.customAddDynamicRoute('projects/task-mgr/create-task-step', title, params)
    },
    doCancel () {
      this.$handTriggerReLoadEvent('projectReload')
      removeCurrentTabsHandle(this)
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
    }
  }
}
</script>
<style lang="scss" scoped>
.finish-step {
  .el-button {
    margin-right: 10%;
  }
}
</style>
