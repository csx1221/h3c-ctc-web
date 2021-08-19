<template>
  <el-container style="project-task-mgr">
    <split-bar>
      <div slot='split_left' style="background-color: white;height: 100%;padding: 20px 10px 0;margin-right: 10px;margin-left: -5px;">
        <el-form :model="projectDataForm">
          <el-row style="margin-bottom:5px;margin-top:20px;">
            <el-input placeholder="请输入项目\子项目名称" v-model="projectDataForm.name" @keyup.enter.native="getProjectDataList()" clearable class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="getProjectDataList"></el-button>
            </el-input>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center;white-space:nowrap;overflow-x:hidden;">
              <el-radio-group v-model="projectDataForm.projectStatus" size="mini" @change="getProjectDataList()">
                <el-radio-button size="small" label="">全<br />部</el-radio-button>
                <el-radio-button size="small" label="0">未<br />开始</el-radio-button>
                <el-radio-button size="small" label="1">正常<br />在测</el-radio-button>
                <el-radio-button size="small" label="3">延期<br />在测</el-radio-button>
                <el-radio-button size="small" label="2">正常<br />完成</el-radio-button>
                <el-radio-button size="small" label="4">延期<br />完成</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-form>
        <el-row style="padding-top:10px;">
          <el-tree v-if="treeStatus" ref="leftTree" highlight-current :data="projectTreeData" :load="loadTreeNode" lazy node-key="id" :current-node-key="currentNodekey" :props="defaultProps" @node-click="handleNodeClick" @node-expand="handleNodeExpand" :expand-on-click-node="false" style="height:650px;overflow-y:auto;overflow-x:hidden;">
            <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
              <!--nodeType={1:项目;2子项目;3:阶段;4:任务;模块6}-->
              <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.nodeName}}</span>
            </span>
          </el-tree>
        </el-row>
      </div>
      <el-container slot='split_right'>
        <div style="margin-left: 10px;-webkit-box-flex: 1;box-sizing: border-box;flex: 1 1 auto;overflow: auto;">
          <el-main style="height: 100%; width: 100%;background:#fff;">
            <el-form :model="taskDataForm" ref="taskDataForm" :inline="false" label-position="right" label-width="80px">
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="taskName" label="任务名称">
                    <el-input v-model="taskDataForm.taskName" :placeholder="$t('task.name')" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="taskStatus" label="任务状态">
                    <ctc-select v-model="taskDataForm.taskStatus" dict-type="taskStatus" :placeholder="$t('task.status')"></ctc-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" style="text-align:right">
                  <el-button type="primary" size="small" @click="queryTaskInfoList()">{{ $t('query') }}</el-button>
                  <el-button size="small" @click="onResetTaskDataForm()">重置</el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-row>
              <el-col :span="12" class="split-line" style="text-align:left;">
                任务列表
              </el-col>
              <el-col :span="12" style="padding-left:0px;text-align:right;">
                <el-button v-if="btnTaskAuth" type="primary" size="small" @click="handleAddClick()">{{ $t('add') }}</el-button>
                <el-button v-if="btnTaskAuth" type="primary" size="small" @click="startUp()">{{ $t('task.startUp') }}</el-button>
                <el-button v-if="btnTaskAuth" type="primary" size="small" @click="doBatchCopyTask()">复制</el-button>
                <el-button v-if="btnTaskAuth" type="danger" size="small" @click="handDeleteClick()">{{ $t('deleteBatch') }}</el-button>
              </el-col>
            </el-row>
            <el-table stripe highlight-current-row row-key="taskId" :data="taskInfoList" ref="taskInfoList" @selection-change="dataListSelectionChangeHandle" border style="width: 100%;">
              <el-table-column type="selection" reserve-selection header-align="center" align="center" width="50"></el-table-column>
              <el-table-column prop="taskName" label="任务名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
              <el-table-column prop="taskStatus" label="任务状态" header-align="center" align="center">
                <template slot-scope="scope">
                  {{ $getDictLabel('taskStatus', scope.row.taskStatus) }}
                </template>
              </el-table-column>
              <el-table-column prop="taskType" :label="$t('task.type')" header-align="center" align="center">
                <template slot-scope="scope">
                  {{ $getDictLabel('stageType', scope.row.taskType) }}
                </template>
              </el-table-column>
              <el-table-column prop="planStartTime" label="实际日期" header-align="center" align="center" width="200">
                <template slot-scope="scope">
                  {{scope.row.actStartTime}}- {{scope.row.actEndTime}}
                </template>
              </el-table-column>
              <el-table-column prop="planStartTime" label="计划日期" header-align="center" align="center" width="200">
                <template slot-scope="scope">
                  {{scope.row.planStartTime}}- {{scope.row.planEndTime}}
                </template>
              </el-table-column>
              <el-table-column prop="taskMemberCounts" label="成员数" header-align="center" align="center"></el-table-column>
              <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                  <template v-for="(item, index) in scope.row.operate">
                    <el-button v-if="item==0" @click="doTableOperate(item,scope.row)" type="text" size="small" :key="index">{{ $getDictLabel('operateType',item) }}</el-button>
                    <el-button v-else-if="item==1" :disabled="scope.row.taskStatus === 3" @click="doTableOperate(item,scope.row)" type="text" size="small" :key="index">{{ $getDictLabel('operateType',item) }}</el-button>
                    <el-button v-else-if="item==2" :disabled="scope.row.taskStatus === 3" @click="doTableOperate(item,scope.row)" type="text" size="small" :key="index">{{ $getDictLabel('operateType',item) }}</el-button>
                    <el-button v-else-if="item==13" :disabled="scope.row.taskStatus !== 0" @click="doTableOperate(item,scope.row)" type="text" size="small" :key="index">{{ $getDictLabel('operateType',item) }}</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
            </el-pagination>
            <!--引入是否省份自测-->
            <province-test ref="provinceTest" :visible.sync="provinceTest" @watchChildPage="triggerParentMethod"></province-test>
          </el-main>
        </div>
      </el-container>
    </split-bar>
  </el-container>
</template>
<script>
import { addDynamicRoute } from '@/router'
import CtcProjectUserTable from '@/components/project/ctc-project-user-table'
import ProvinceTest from './taskConfigure/province-test'
export default {
  name: 'TaskmgrPage',
  components: {
    CtcProjectUserTable, ProvinceTest
  },
  data () {
    return {
      projectDataForm: {
        name: '',
        projectStatus: ''
      },
      taskDataForm: {
        taskName: '',
        taskStatus: ''
      },
      page: 1,
      limit: 10,
      total: 0,
      addOrUpdateVisible: false,
      provinceTest: false,
      projectData: {
        // nodeType 1:项目2:子项目;3:阶段
        nodeType: '',
        childNodeType: '',
        projectId: '',
        projectName: ''
      },
      currentNodekey: '',
      projectTreeData: [],
      defaultProps: {
        children: 'zones',
        label: 'nodeName',
        isLeaf: 'leaf'
      },
      isFirst: true,
      isSecond: false,
      taskCountList: [],
      taskInfoList: [],
      treeStatus: true,
      ifShow: false,
      selection: [],
      operateStatus: {
        startTask: false,
        createTask: false,
        editTask: false,
        deleteTask: false,
        setMember: false
      },
      btnTaskAuth: false, // 根据项目Id，控制是否有操作权限(true:有;false:无)
      cacheTreeData: {}
    }
  },
  created () {
    // 项目明细入口(1:项目归档;0:项目列表)
    let parentId = this.$route.params.parentId || this.$route.params.parentProjectId || ''
    let projectId = this.$route.params.projectId || ''
    this.projectDataForm.projectId = parentId || projectId
    // 设置全局子项目编码、父项目编码
    this.projectData.tparentProjectId = parentId
    this.projectData.tprojectId = projectId
  },
  mounted () {
    let thisvm = this
    if (thisvm.projectDataForm.projectId !== '') {
      let data = {}
      data.pid = ''
      data.id = thisvm.projectDataForm.projectId
      data.nodeType = 1
      data.childNodeType = thisvm.projectData.tparentProjectId ? 2 : 3
      if (Object.keys(thisvm.cacheTreeData).length > 0) {
        data = thisvm.cacheTreeData
      }
      thisvm.handleNodeClick(data)
    } else {
      thisvm.getTabTableData()
    }
    window.addEventListener('handReLoadEvent', function (event) {
      if (event.key === 'taskReload') {
        thisvm.getTabTableData()
      }
    })
  },
  activated () {
  },
  methods: {
    triggerParentMethod (message) {
      let mg = message.message
      let data = message.data
      this.executeHttpsService(mg, data)
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('../../../../assets/img/icon_' + data.nodeType + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '子项目', '3': '阶段', '4': '任务', '6': '模块' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.getTabTableData()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.getTabTableData()
    },
    getTabTableData () {
      this.queryTaskInfoList()
    },
    dataListSelectionChangeHandle (val) {
      this.selection = val
    },
    // 根据项目ID获取任务数据列表
    queryTaskInfoList () {
      let taskDataForm = this.taskDataForm
      let params = { 'page': this.page, 'limit': this.limit, ...taskDataForm }
      let url = ''
      // 1:项目2:子项目;3:阶段
      let childNodeType = this.projectData.childNodeType
      let nodeType = this.projectData.nodeType
      if (childNodeType === '') {
        url = '/ctc/task/taskQuery/pageTaskInfoByProject'
      } else if (childNodeType === 2) {
        params.parentProjectId = this.projectData.nodeId
        url = '/ctc/task/taskQuery/pageTaskInfoByProject'
      } else if (childNodeType === 3) {
        params.projectId = this.projectData.nodeId
        url = '/ctc/task/taskQuery/pageTaskInfoBySubProject'
      } else if (nodeType === 3) {
        params.projectStageId = this.projectData.nodeId
        url = '/ctc/task/taskQuery/pageTaskInfoByStage'
      }
      this.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$refs.taskInfoList.clearSelection()
          this.taskInfoList = res.data.list
          this.total = res.data.total
          this.setOperateStatus()
        }
      }).catch(() => {
      })
    },
    // 设置操作权限
    setOperateStatus () {
      let i = 0
      for (i in this.taskInfoList[0].operate) {
        if (this.taskInfoList[0].operate[i] === '13') {
          this.operateStatus.startTask = true
        } else if (this.taskInfoList[0].operate[i] === '14') {
          this.operateStatus.setMember = true
        } else if (this.taskInfoList[0].operate[i] === '11') {
          this.operateStatus.createTask = true
        } else if (this.taskInfoList[0].operate[i] === '1') {
          this.operateStatus.editTask = true
        } else if (this.taskInfoList[0].operate[i] === '2') {
          this.operateStatus.deleteTask = true
        }
      }
    },
    doTableOperate (type, row) {
      if (type === '0') {
        // 查看
        this.handleSearchClick(row)
      } else if (type === '1') {
        // 编辑
        this.handleEditClick(row)
      } else if (type === '2') {
        // 删除
        this.handDeleteClick(row)
      } else if (type === '13') {
        // 启动
        this.startUp(row)
      }
    },
    // 新增
    handleAddClick () {
      let path = 'projects/task-mgr/create-task-step'
      let titel = '新建任务'
      // 特殊处理判断判断子项目编码
      let parentProjectId = this.projectData.parentProjectId || this.projectData.tparentProjectId || this.projectData.tprojectId
      let projectId = this.projectData.projectId
      if (projectId === this.projectData.tparentProjectId) {
        projectId = this.projectData.tprojectId || this.projectData.tparentProjectId
      }
      let params = { 'projectId': projectId, 'parentProjectId': parentProjectId, 'projectStageId': this.projectData.projectStageId, 'operationType': 'add' }
      // 组装当前路径参数
      let pagePathParams = { 'pageName': '任务管理', 'id': params.projectStageId, 'type': 'stage' }
      params.pagePathParams = pagePathParams
      this.customAddDynamicRoute(path, titel, params)
    },
    // 查看
    handleSearchClick (row) {
      let path = 'projects/task-mgr/create-task-step'
      let titel = '查看任务'
      let params = { 'projectId': row.projectId, 'parentProjectId': this.projectData.parentProjectId, 'projectStageId': row.projectStageId, 'taskId': row.taskId, 'operationType': 'update' }
      params.readOnly = 1 // 0:编辑模式;1:只读模式
      // 组装当前路径参数
      let pagePathParams = { 'pageName': '任务管理', 'id': params.projectStageId, 'type': 'stage' }
      params.pagePathParams = pagePathParams
      this.customAddDynamicRoute(path, titel, params)
    },
    // 编辑
    handleEditClick (row) {
      let path = 'projects/task-mgr/create-task-step'
      let titel = '修改任务'
      let params = { 'projectId': row.projectId, 'parentProjectId': this.projectData.parentProjectId, 'projectStageId': row.projectStageId, 'taskId': row.taskId, 'operationType': 'update' }
      params.readOnly = 0 // 0:编辑模式;1:只读模式
      // 组装当前路径参数
      let pagePathParams = { 'pageName': '任务管理', 'id': params.projectStageId, 'type': 'stage' }
      params.pagePathParams = pagePathParams
      this.customAddDynamicRoute(path, titel, params)
    },
    // 删除
    handDeleteClick (row) {
      this.$toggleRowSelectionTable('taskInfoList', row)
      let params = { 'type': '删除', 'postType': 'delete', 'url': '/ctc/task/base', 'reload': true }
      let saveParams = { ...params, 'row': row }
      this.executeMethod(saveParams)
    },
    // 启动
    startUp (row) {
      let params = { 'type': '启动', 'postType': 'post', 'url': '/ctc/task/base/startTask', 'reload': true }
      let saveParams = { ...params, 'row': row }
      this.executeMethod(saveParams)
    },
    // 设置成员
    setMember (row) {
      let path = 'projects/task-mgr/create-task-step'
      let title = '设置成员'
      let params = { 'projectId': row.projectId, 'projectStageId': row.projectStageId, 'taskId': row.taskId, 'operationType': 'update' }
      params.activeIndex = 2
      this.customAddDynamicRoute(path, title, params)
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
            this.executeTaskStart(message, data)
          } else {
            this.executeHttpsService(message, data)
          }
        }
      }).catch(() => { })
    },
    executeTaskStart (message, data) {
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
            this.queryTaskInfoList()
          }
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    doBatchCopyTask () {
      let selection = this.$refs.taskInfoList.selection
      if (selection.length > 0) {
        this.$confirm('确定进行[任务复制]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let taskIds = []
          selection.forEach((item, index) => {
            taskIds.push(item.taskId)
          })
          this.$ctcLoading.open()
          this.$http.post('/ctc/task/base/copyTask', taskIds).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.$message.success('任务复制成功')
              this.getTabTableData()
            }
            this.$ctcLoading.close()
          }).catch(() => {
            this.$ctcLoading.close()
          })
        }).catch(() => { })
      } else {
        this.$message.warning('没有选择任何操作记录！')
      }
    },
    onResetTaskDataForm () {
      this.taskDataForm.taskName = ''
      this.taskDataForm.taskStatus = ''
      this.queryTaskInfoList()
    },
    onResetProjectDataForm () {
      this.$refs.projectDataForm.resetFields()
      this.getProjectDataList()
    },
    getProjectDataList () {
      let thisvm = this
      thisvm.treeStatus = false
      setTimeout(function () { thisvm.treeStatus = true }, 500)
    },
    // 获取项目-任务树的数据
    getProjectTaskTreeData (resolve) {
      let thisvm = this
      let params = Object.assign({}, thisvm.projectDataForm)
      thisvm.$http.get('/ctc/project/projectDetail/listTreeRoot', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        resolve(res.data)
      }).catch(() => {
        resolve([])
      })
    },
    loadTreeNode (node, resolve) {
      // nodeType 1:项目2:子项目;3:阶段
      if (node.level === 0) {
        this.getProjectTaskTreeData(resolve)
      } else {
        let params = { 'id': node.data.id, 'nodeType': node.data.nodeType }
        if (params.nodeType !== 3) {
          this.$http.get('/ctc/project/projectDetail/listTree', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            let list = res.data
            let parentProjectId = ''
            if (node.data.nodeType === 1) {
              parentProjectId = node.data.id
            } else if (node.data.nodeType === 2) {
              parentProjectId = node.data.pid
            }
            for (let i = 0; i < list.length; i++) {
              list[i].parentProjectId = parentProjectId
            }
            resolve(list)
          }).catch(() => {
            resolve([])
          })
        } else {
          resolve([])
        }
      }
    },
    getProjectTaskAuth () {
      let projectId = this.projectData.projectId || this.projectData.parentProjectId
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
    handleNodeClick (data) {
      // 缓存tree数据
      this.cacheTreeData = data
      // nodeType 1:项目2:子项目;3:阶段
      this.projectData.nodeId = data.id
      this.projectData.nodeName = data.nodeName
      this.projectData.nodePid = data.pid
      this.projectData.nodeType = data.nodeType
      this.projectData.childNodeType = data.childNodeType
      if (data.nodeType === 1) {
        this.projectData.projectId = data.id
        this.ifShow = false
      } else if (data.nodeType === 2) {
        this.projectData.projectId = data.id
        this.projectData.parentProjectId = data.pid
        this.ifShow = false
      } else if (data.nodeType === 3) {
        this.projectData.projectId = data.pid
        this.projectData.projectStageId = data.id
        this.projectData.parentProjectId = data.parentProjectId
        this.ifShow = true
      }
      // 根据项目Id，控制任务操作权限
      if (this.ifShow) {
        this.getProjectTaskAuth()
      } else {
        this.btnTaskAuth = false
      }
      this.queryTaskInfoList()
    },
    handleNodeExpand (data) {
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
<style lang="scss">
.project-task-mgr {
}
</style>
