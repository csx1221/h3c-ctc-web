<template>
  <div class="project-task-list">
    <el-row>
      <el-col :span="20" class="split-line">
        数据列表&nbsp;
        <el-button plain type="primary" size="mini" @click="doChooseSataus('')">全 部</el-button>
        <el-button plain :type="item.type" size="mini" @click="doChooseSataus(item.dictValue)" v-for="(item,index) in statusButtonData" :key="index">{{item.dictLabel}}</el-button>
      </el-col>
      <el-col :span="4" v-if="['childrenStage'].includes(tabActiveName)" style="height:40px;text-align:right;">
        <el-button type="blue" size="mini" v-if="btnTaskAuth" @click="doProjectCreateTask()">创建任务</el-button>
        <el-button type="blue" size="mini" v-if="btnTaskAuth && false" @click="startProjectStage()">启动阶段</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="tabActiveName" @tab-click="tabsHandleClick" v-if="tabsData.length>1">
          <el-tab-pane v-for="item in tabsData" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-table ref="refTableObject" :data="refTableData" style="width:100%;" stripe highlight-current-row border>
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <template v-for="(item, index) in refTableTitleData">
        <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" :width="getTableColumnWidth(item)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-html="getTableColumnData(scope.row,item)"></span>
          </template>
        </el-table-column>
      </template>
      <el-table-column fixed="right" label="操作" :width="operateColWidth" v-if="operateColFlag">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.operate">
            <el-button @click="doTableOperate(item,scope.row)" v-if="item==13" :disabled="(scope.row.taskStatus || 0) !== 0" :key="index" type="text" size="small">{{ $getDictLabel('operateType',item) }}</el-button>
            <el-button @click="doTableOperate(item,scope.row)" v-else-if="item==2" :disabled="(scope.row.taskNum || 0)>0" :key="index" type="text" size="small">{{ $getDictLabel('operateType',item) }}</el-button>
            <el-button @click="doTableOperate(item,scope.row)" v-else :key="index" type="text" size="small">{{ $getDictLabel('operateType',item) }}</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :current-page.sync="dataForm.page" :page-size="dataForm.limit" :total="total" @current-change="chagePageTableData">
    </el-pagination>
    <!--引入添加阶段-->
    <add-stage :visible.sync="addStage" ref="addStage" @watchChildMethod="triggerParentMethod"></add-stage>
    <!--引入是否省份自测-->
    <province-test ref="provinceTest" :visible.sync="provinceTest" @watchChildPage="triggerParentMethod"></province-test>
  </div>
</template>
<script>
import { addDynamicRoute } from '@/router'
import addStage from './choose-dialog/add-stage'
import ProvinceTest from '../../task-mgr/taskConfigure/province-test'

export default {
  name: 'ProjectTaskList',
  components: {
    addStage, ProvinceTest
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      dataForm: {
        name: '',
        status: '',
        limit: 10,
        page: 1
      },
      total: 0,
      refTableTitleData: [{ 'code': 'name', 'name': '子项目名' }, { 'code': 'projectStatus', 'name': '状态' }, { 'code': 'memberCounts', 'name': '成员数量' }],
      refTableData: [],
      tabActiveName: 'childrenProject',
      tabsData: [],
      // 是否显示操作列
      operateColWidth: 150,
      operateColFlag: true, // 是否显示操作列
      addStage: false, // 修改、查看阶段
      statusButtonData: [], // 状态操作按钮
      btnTaskAuth: true, // 根据项目Id，控制是否有操作权限(true:有;false:无)
      provinceTest: false
    }
  },
  watch: {
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getTableData()
      }
    }
  },
  computed: {
  },
  mounted () {
  },
  activated () {
    this.getTableData(this.tabActiveName)
  },
  methods: {
    triggerParentMethod (message) {
      // 判断是否是函数执行
      if (message.type === 'execute') {
        this.getTableData(this.tabActiveName)
      } else if (message.type === 'startExecute') {
        let mg = message.message
        let data = message.data
        this.executeHttpsService(mg, data)
      }
    },
    // 获取表格字段宽度
    getTableColumnWidth (item) {
      let width = 'auto'
      if (item.code === 'planTime' | item.code === 'actTime') {
        width = 180
      } else if (item.code === 'name') {
        width = 250
      }
      return width
    },
    autoCalcOperateWidth () {
      // 特殊处理是否展示操作列
      let data = this.refTableData
      if (data.length > 0) {
        let maxWidth = 0
        data.forEach((item, index) => {
          let operateArr = item.operate || []
          let operateNameArr = []
          operateArr.forEach((item, index) => {
            operateNameArr.push(this.$getDictLabel('operateType', item))
          })
          let operateColWidth = operateNameArr.join(',').length * 15
          if (maxWidth < operateColWidth) {
            maxWidth = operateColWidth
          }
        })
        if (maxWidth > 150 && this.operateColWidth !== maxWidth) {
          this.operateColWidth = maxWidth
        }
        // 特殊处理是否展示操作列
        this.operateColFlag = maxWidth > 0
      }
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      // 项目状态
      let bool = 'projectStatus,stageStatus,taskStatus,level,category,scope,taskType'.includes(item.code)
      if (bool) {
        // 兼容项目状态、阶段状态、任务状态
        if ('projectStatus'.includes(item.code)) {
          columnValue = this.$getDictLabel('project.projectStatus', row.projectStatus)
        } else if ('stageStatus'.includes(item.code)) {
          columnValue = this.$getDictLabel('project.stageStatus', row.stageStatus)
        } else if ('taskStatus'.includes(item.code)) {
          columnValue = this.$getDictLabel('taskStatus', row.taskStatus)
        } else if ('taskType'.includes(item.code)) {
          columnValue = this.$getDictLabel('stageType', row.taskType)
        } else {
          columnValue = this.$getDictLabel('project.' + item.code, row.taskStatus)
        }
      } else {
        columnValue = row[item.code]
      }
      // 特殊处理计划周期
      if (item.code === 'planTime') {
        columnValue = row.planStartTime + '-' + row.planEndTime
      }
      // 特殊处理实际周期
      if (item.code === 'actTime') {
        columnValue = (row.actStartTime || '') + '-' + (row.actEndTime || '')
      }
      return columnValue
    },
    getStatusButtonData () {
      let dictData = []
      if (['childrenProject'].includes(this.tabActiveName)) {
        dictData = this.$getDictDataList('project.projectStatus')
      } else if (['stage', 'childrenStage'].includes(this.tabActiveName)) {
        dictData = this.$getDictDataList('project.stageStatus')
      } else if (['task'].includes(this.tabActiveName)) {
        dictData = this.$getDictDataList('taskStatus')
      }
      dictData.map((item, index) => {
        item.type = 'primary'
      })
      this.statusButtonData = dictData
    },
    tabsHandleClick (tab, event) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      setTimeout(function () { thisvm.$ctcLoading.close() }, 1500)
      this.getTableData(tab.name)
    },
    getProjectTaskAuth () {
      let projectId = this.dataForm.projectId || this.dataForm.parentId
      if (projectId) {
        let params = { 'projectId': projectId }
        this.$http.get('/ctc/project/list/canEditProject', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.btnTaskAuth = res.data || false
          }
        }).catch(() => { })
      }
    },
    initTabsData (nodeType, childNodeType) {
      let tabsData = []
      if (nodeType === 1) {
        tabsData.push({ 'name': 'stage', 'label': '项目阶段', 'url': '/ctc/project/projectDetail/pageProjectDetailSubProjectStageByParent' })
        tabsData.push({ 'name': 'childrenProject', 'label': '子项目', 'url': '/ctc/project/projectDetail/pageProjectDetailSubProject' })
      } else if (nodeType === 2 && childNodeType === 3) {
        // 有子项目
        tabsData.push({ 'name': 'childrenStage', 'label': '子项目阶段', 'url': '/ctc/project/projectDetail/pageProjectDetailSubProjectStage', 'type': 2 })
        tabsData.push({ 'name': 'task', 'label': '任务', 'url': '/ctc/task/taskQuery/pageDynamicTaskInfoByStage' })
      } else if (nodeType === 2 && childNodeType === 2) {
        // 无子项目
        tabsData.push({ 'name': 'childrenStage', 'label': '项目阶段', 'url': '/ctc/project/projectDetail/pageProjectDetailProjectStage', 'type': 1 })
        tabsData.push({ 'name': 'task', 'label': '任务', 'url': '/ctc/task/taskQuery/pageDynamicTaskInfoByStage' })
      } else if (nodeType === 3) {
        tabsData.push({ 'name': 'task', 'label': '任务', 'url': '/ctc/task/taskQuery/pageDynamicTaskInfoByStage' })
      } else if (nodeType === -1) {
        tabsData.push({ 'name': 'childrenProject', 'label': '子项目', 'url': '/ctc/project/projectDetail/pageProjectDetailSubProject' })
      }
      this.tabsData = tabsData
    },
    chagePageTableData () {
      this.getTableData(this.tabActiveName)
    },
    getTableData (clickTabName) {
      this.$ctcLoading.open()
      // 1:项目2:子项目;3:阶段
      let nodeType = this.projectData.nodeType
      let childNodeType = this.projectData.childNodeType
      // 特殊处理没有子项目
      if (nodeType === 1 && childNodeType !== 2) {
        nodeType = 2
        childNodeType = 2
      }
      let params = { 'page': this.dataForm.page, 'limit': this.dataForm.limit }
      if (nodeType === 1) {
        params.parentId = this.projectData.nodeId
        params.projectStatus = this.dataForm.status
      } else if (nodeType === 2) {
        params.parentId = this.projectData.nodePid
        params.projectId = this.projectData.nodeId
        params.stageStatus = this.dataForm.status
      } else if (nodeType === 3) {
        params.projectStageId = this.projectData.nodeId
        params.taskStatus = this.dataForm.status
      } else {
        params.projectStatus = this.dataForm.status
      }
      // 根据nodeType获取tabs数据
      this.initTabsData(nodeType, childNodeType)
      if (!clickTabName) {
        clickTabName = this.tabsData[0].name
      }
      // 动态获取tab切名称
      let currSelectedTabs = this.tabsData.filter(function (item) {
        return item.name === clickTabName
      })[0]
      this.tabActiveName = currSelectedTabs.name
      // 根据tab名称，动态修改参数键值
      if (this.tabActiveName === 'childrenStage') {
        if (nodeType === 2 && childNodeType === 2) {
          // 无子项目
          params.projectId = params.parentId || params.projectId
          delete params['parentId']
        }
      } else if (this.tabActiveName === 'stage') {
        params.stageStatus = this.dataForm.status
        delete params['projectStatus']
      } else if (this.tabActiveName === 'task') {
        params.taskStatus = this.dataForm.status
      }
      this.dataForm = Object.assign({}, params)
      // 获取操作按钮
      this.getStatusButtonData()
      // 获取项目任务权限按钮
      this.getProjectTaskAuth()
      let url = currSelectedTabs.url
      this.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.refTableTitleData = res.data.head
          this.refTableData = res.data.data.list
          this.total = res.data.data.total
          this.operateColWidth = 150
          this.autoCalcOperateWidth()
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getTableData()
    },
    doChooseSataus (status) {
      this.dataForm.status = status
      this.getTableData(this.tabActiveName)
    },
    doTableOperate (type, row) {
      let path = ''
      let title = ''
      let params = { 'parentId': this.projectData.projectId || row.parentId || '', 'projectId': row.projectId || '', 'projectName': row.name, 'projectStageId': row.projectStageId || '' }
      // 组装当前路径参数
      let pagePathParams = { 'pageName': '阶段管理', 'id': '', 'type': '' }
      // 设置项目成员(7L),设置参测对象(8L),设置阶段(9L)，启动阶段(10L)，创建任务(11L)，后续阶段(15L)，编辑子项目(16L)，删除子项目(17L)
      let tabActiveName = this.tabActiveName
      if (tabActiveName === 'childrenProject') {
        // 子项目操作列
        if (type === '5') {
          path = 'projects/project-new-mgr/set-interface-user'
          title = '设置接口人'
        } else if (type === '16') {
          path = 'projects/project-new-mgr/create-child-project-page'
          title = '编辑子项目'
          params.operationType = 'update'
          params.activeIndex = 0
          params.readOnly = 0 // 0:编辑模式;1:只读模式
          // 设置当前路径参数
          pagePathParams.type = 'project'
          pagePathParams.id = params.projectId
        } else if (type === '0') {
          path = 'projects/project-new-mgr/create-child-project-page'
          title = '查看子项目'
          params.operationType = 'update'
          params.activeIndex = 0
          params.readOnly = 1 // 0:编辑模式;1:只读模式
          // 设置当前路径参数
          pagePathParams.type = 'project'
          pagePathParams.id = params.projectId
        } else if (type === '17') {
          this.doSubDeleteProject(row)
        }
      } else if (tabActiveName === 'stage' || tabActiveName === 'childrenStage') {
        // 阶段操作列
        if (type === '1') {
          // 编辑
          this.$refs.addStage.projectId = params.projectId
          this.$refs.addStage.projectStageId = params.projectStageId
          this.$refs.addStage.readOnly = 0 // 0:编辑模式;1:只读模式
          this.$refs.addStage.init()
        } else if (type === '2') {
          // 删除
          this.deleteProjectStage(row)
        } else if (type === '0') {
          // 查看
          this.$refs.addStage.projectId = params.projectId
          this.$refs.addStage.projectStageId = params.projectStageId
          this.$refs.addStage.readOnly = 1 // 0:编辑模式;1:只读模式
          this.$refs.addStage.init()
        } else if (type === '20') {
          // 设置阶段
          title = '设置阶段成员'
          params.operationType = 'update'
          params.readOnly = 0 // 0:编辑模式;1:只读模式
          // 设置当前路径参数
          pagePathParams.type = 'project'
          pagePathParams.id = params.projectId
          let currSelectedTabs = this.tabsData.filter(function (item) {
            return item.name === tabActiveName
          })[0]
          if (currSelectedTabs.type === 1) {
            path = 'projects/project-new-mgr/create-project-page'
            params.activeIndex = 3
          } else {
            path = 'projects/project-new-mgr/create-child-project-page'
            params.activeIndex = 1
          }
        }
      } else if (tabActiveName === 'task') {
        // 任务操作列
        if (type === '1') {
          // 编辑
          path = 'projects/task-mgr/create-task-step'
          title = '编辑任务'
          params.taskId = row.taskId
          params.operationType = 'update'
          pagePathParams.type = 'task'
          pagePathParams.id = params.taskId
        } else if (type === '2') {
          // 删除
          let tparams = { 'type': '删除', 'postType': 'delete', 'url': '/ctc/task/base', 'reload': true }
          let saveParams = { ...tparams, 'row': row }
          this.executeMethod(saveParams)
        } else if (type === '13') {
          // 启动
          let tparams = { 'type': '启动', 'postType': 'post', 'url': '/ctc/task/base/startTask', 'reload': true }
          let saveParams = { ...tparams, 'row': row }
          this.executeMethod(saveParams)
        } else if (type === '0') {
          // 查看
          path = 'projects/task-mgr/create-task-step'
          title = '查看任务'
          params.taskId = row.taskId
          params.operationType = 'update'
          // 控制是否是查看模式
          params.readOnly = 1
          pagePathParams.type = 'task'
          pagePathParams.id = params.taskId
        }
      }
      params.pagePathParams = pagePathParams
      this.customAddDynamicRoute(path, title, params)
    },
    // 创建子项目
    doCreateChildProject () {
      let title = '创建子项目'
      let params = { 'parentId': this.projectData.projectId, 'projectId': '', 'operationType': 'add' }
      // 组装当前路径参数
      let pagePathParams = { 'pageName': '阶段管理', 'id': '', 'type': '' }
      params.activeIndex = 0
      // 设置当前路径参数
      pagePathParams.type = 'project'
      pagePathParams.id = params.parentId
      params.pagePathParams = pagePathParams
      this.customAddDynamicRoute('projects/project-new-mgr/create-child-project-page', title, params)
    },
    // 创建任务
    doProjectCreateTask () {
      let title = '新建任务'
      let params = { 'parentId': this.dataForm.parentId, 'projectId': this.dataForm.projectId, 'projectStageId': this.dataForm.projectStageId, 'operationType': 'add' }
      // 组装当前路径参数
      let pagePathParams = { 'pageName': '阶段管理', 'id': '', 'type': '' }
      params.activeIndex = 0
      // 兼容任务父项目编码
      params.parentProjectId = params.parentId || ''
      params.projectId = params.projectId || params.parentProjectId
      params.projectStageId = ''
      params.operationType = 'add'
      // 设置当前路径参数
      pagePathParams.type = 'project'
      pagePathParams.id = params.projectId
      params.pagePathParams = pagePathParams
      this.customAddDynamicRoute('projects/task-mgr/create-task-step', title, params)
    },
    // 校验项目阶段([用例评审、用例执行]必须包含用例设计)
    validStageData (type, row) {
      let result = { 'isOk': true }
      let stageTableData = this.refTableData
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
      return result
    },
    // 删除阶段
    deleteProjectStage (row) {
      let result = this.validStageData('delete', row)
      if (result.isOk) {
        this.$confirm('确定进行删除[阶段]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {}
          data.data = [row.projectStageId]
          let params = { 'type': 'execute', 'postType': 'delete', 'url': '/ctc/project/projectStage', 'reload': true }
          let message = { ...params, 'data': data }
          this.$http[message.postType](message.url, message.data).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.$message.success('操作成功')
              if (message.reload) {
                this.chagePageTableData()
              }
            }
          }).catch(() => { })
        }).catch(() => { })
      }
    },
    doSubDeleteProject (row) {
      this.$confirm('确定删除[子项目]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/ctc/project/projectBase/deleteSubProject/' + row.projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('子项目删除成功')
            this.getTableData()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 执行删除、启动服务
    executeMethod (message) {
      if (typeof message.row === 'undefined' && this.selection.length <= 0) {
        return this.$message({
          message: '请选择' + message.type + '项',
          type: 'warning',
          duration: 1000
        })
      }
      this.$confirm('确定进行' + message.type + '操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {}
        data.isOK = true
        // 判断是否有执行类型任务
        data.hasExecTask = false
        if (typeof message.row !== 'undefined') {
          if (message.type === '删除' && message.row.taskStatus > 0) {
            data.isOK = false
            return this.$message({
              message: '只有配置中和未开始的任务可以' + message.type,
              type: 'warning'
            })
          } else if (message.type === '启动' && message.row.taskStatus !== 0) {
            data.isOK = false
            return this.$message({
              message: '只有未开始的任务可以' + message.type,
              type: 'warning'
            })
          }
          data.data = [message.row.taskId]
          data.hasExecTask = (message.row.taskType === 7)
          data.projectId = message.row.projectId
        } else {
          let taskIds = []
          this.selection.forEach((item, index) => {
            let taskId = item.taskId
            let taskStatus = item.taskStatus
            let taskType = item.taskType
            if (message.type === '删除' && taskStatus > 0) {
              data.isOK = false
              return this.$message({
                message: '只有配置中和未开始的任务可以' + message.type,
                type: 'warning'
              })
            } else if (message.type === '启动' && taskStatus !== 0) {
              data.isOK = false
              return this.$message({
                message: '只有未开始的任务可以' + message.type,
                type: 'warning'
              })
            }
            taskIds.push(taskId)
            if (taskType === 7) {
              data.hasExecTask = true
            }
            data.projectId = item.projectId
          })
          data.data = taskIds
        }
        // 特殊处理执行类任务启动
        if (data.isOK && data.data.length > 0) {
          if (message.type === '启动' && data.hasExecTask) {
            // 判断项目范围是否是非集中化
            let projectId = data.projectId
            this.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
              if (res.code !== 0) {
                this.$message.error(res.msg)
              } else {
                if (res.data.scope === 1) {
                  this.executeHttpsService(message, data)
                } else {
                  // 判断任务是否包含参测对象
                  this.validTaskIsExistParticipant(message, data)
                }
              }
            }).catch(() => { })
          } else {
            this.executeHttpsService(message, data)
          }
        }
      }).catch(() => { })
    },
    // 判断任务是否包含参测对象
    validTaskIsExistParticipant (message, data) {
      let params = { 'taskIds': data.data.join(',') }
      this.$http.get('/ctc/task/participant/ifExistParticipantByTaskId', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          if (res.data) {
            this.executeProvinceTestStart(message, data)
          } else {
            this.executeHttpsService(message, data)
          }
        }
      }).catch(() => { })
    },
    // 启动阶段
    startProjectStage () {
      let thisvm = this
      let selection = thisvm.$refs.refTableObject.selection
      if (selection.length > 0) {
        this.$confirm('确定进行阶段启动操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 判断任务数量是否为0
          let taskNumBool = false
          // 判断是否有执行类型阶段
          let hasExecTask = false
          let projectStageIds = []
          selection.forEach((item, index) => {
            if (Number(item.taskNum) > 0) {
              taskNumBool = true
            }
            if (item.stageId === '7') {
              hasExecTask = true
            }
            projectStageIds.push(item.projectStageId)
          })
          if (taskNumBool) {
            this.$message.warning('当前选中的阶段已有任务启动，请到任务管理菜单查看！')
          } else {
            let message = { 'url': '/ctc/project/projectStage/stageStart', 'postType': 'post', 'reload': true }
            let data = { 'projectId': this.dataForm.projectId, 'projectStageIds': projectStageIds }
            // 存在执行类阶段，需要判断项目范围是否是非集中化
            if (hasExecTask) {
              let projectId = this.dataForm.projectId
              this.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
                if (res.code !== 0) {
                  this.$message.error(res.msg)
                } else {
                  if (res.data.scope === 1) {
                    this.executeHttpsService(message, data)
                  } else {
                    this.executeProvinceTestStart(message, data)
                  }
                }
              }).catch(() => { })
            } else {
              this.executeHttpsService(message, data)
            }
          }
        })
      } else {
        this.$message.warning('没有选中任何操作记录！')
      }
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
            this.getTableData(this.tabActiveName)
          }
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
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
.project-task-list {
  background: #fff;
  padding: 15px;
  .project-header {
    padding: 10px;
    height: 50px;
    .el-input {
      width: 450px;
    }
    .el-date-editor {
      width: 280px;
    }
  }
}
</style>
