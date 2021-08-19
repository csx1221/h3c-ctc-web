<template>
  <div class="project-case-list">
    <el-row>
      <el-col :span="24">
        <el-card shadow="never" class="aui-card--fill">
          <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="moduleOneName" label="模块一名">
                  <el-select v-model="dataForm.moduleOneName" clearable filterable placeholder="选择模块一" value-key="moduleId" @change="chooseModule">
                    <el-option v-for="data in dataModuleOneData" :key="data.moduleId" :label="data.moduleName" :value="data">{{data.moduleName}}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="moduleTwoName" label="模块二名">
                  <el-select v-model="dataForm.moduleTwoName" clearable filterable placeholder="选择模块二" value-key="moduleId" @change="chooseModule">
                    <el-option v-for="data in dataModuleTwoData" :key="data.moduleId" :label="data.moduleName" :value="data">{{data.moduleName}}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
                <el-button type="primary" size="small" @click="getProjectCase()">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
                <br /><br />
                <el-checkbox v-model="batchCheckAll" @change="batchCheckAllChange">批量全选</el-checkbox>
              </el-col>
            </el-row>
            <el-row v-if="isOpen">
              <el-col :span="8">
                <el-form-item prop="moduleThreeName" label="模块三名">
                  <el-select v-model="dataForm.moduleThreeName" clearable filterable placeholder="选择模块三" value-key="moduleId" @change="chooseModule">
                    <el-option v-for="data in dataModuleThreeData" :key="data.moduleId" :label="data.moduleName" :value="data">{{data.moduleName}}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="creatorName" label="创建人名">
                  <el-input v-model="dataForm.creatorName" placeholder="请输入创建人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="issueStatus" label="下发状态">
                  <ctc-select v-model="dataForm.issueStatus" dict-type="issueStatus" placeholder="请选择下发状态"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="caseName" label="用例名称">
                  <el-input v-model="dataForm.caseName" placeholder="请输入用例名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="caseType" label="用例类型">
                  <ctc-select v-model="dataForm.caseType" dict-type="caseType" placeholder="请选择用例类型"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="reviewStatus" label="评审状态">
                  <ctc-select v-model="dataForm.reviewStatus" dict-type="reviewStatus" placeholder="请选择评审状态"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="createDate" label="创建时间">
                  <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="updateDate" label="修改时间">
                  <el-date-picker v-model="dataForm.updateDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top:24px;">
        <el-card shadow="never" class="aui-card--fill">
          <el-row>
            <el-col :span="3" class="split-line" style="text-align:left;">
              用例列表
            </el-col>
            <el-col :span="21" style="text-align:right;">
              <span style="color:#4190f7;padding-right:10px;" v-if="(projectData.taskId || '')==''">说明：要选到左侧具体任务节点，才支持用例上传</span>
              <el-button type="blue" size="small" @click="doAuthValid('add')" v-if="(projectData.taskId || '')!=''">新增</el-button>
              <el-button type="blue" size="small" @click="doAuthValid('ref')" v-if="(projectData.taskId || '')!=''">引用</el-button>
              <el-button type="blue" size="small" @click="doImportCase()" v-if="(projectData.taskId || '')!=''">上传</el-button>
              <el-button type="blue" size="small" @click="doAuthValid('issue')" v-if="(projectData.taskId || '')!=''">下发</el-button>
              <el-button type="blue" size="small" @click="doCaseCollect()">收藏</el-button>
              <el-button type="warning" size="small" @click="doExportCase()">导出</el-button>
              <el-button type="blue" size="small" @click="doModuleCase()" v-if="(projectData.projectId || '')!=''">模块</el-button>
              <el-button type="danger" size="small" @click="doBatchDeleteCase()">删除</el-button>
            </el-col>
          </el-row>
          <el-table stripe highlight-current-row :data="caseTableData" ref="caseTableData" border height="680" style="width:100%;;overflow-y:auto;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="caseCode" label="用例编号" header-align="left" align="left" width="190" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.caseCode?scope.row.caseCode:scope.row.caseId}}
              </template>
            </el-table-column>
            <el-table-column prop="caseName" label="用例名称" header-align="left" align="left" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="moduleOneName" label="模块一/二/三名" header-align="left" align="left" width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.moduleThreeName">{{scope.row.moduleOneName}} / {{scope.row.moduleTwoName}} / {{scope.row.moduleThreeName}}</span>
                <span v-else-if="scope.row.moduleTwoName">{{scope.row.moduleOneName}} / {{scope.row.moduleTwoName}}</span>
                <span v-else> {{scope.row.moduleOneName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="caseType" label="用例类型" header-align="center" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('caseType', scope.row.caseType) }}
              </template>
            </el-table-column>
            <el-table-column prop="caseClass" label="用例类别" header-align="center" align="center">
              <template slot-scope="scope">
                {{ $getDictLabel('caseClass', scope.row.caseClass) }}
              </template>
            </el-table-column>
            <el-table-column prop="shouldTest" label="是否必测" header-align="center" align="center">
              <template slot-scope="scope">
                {{ $getDictLabel('yesOrNo', scope.row.shouldTest) }}
              </template>
            </el-table-column>
            <el-table-column prop="reviewStatus" label="评审状态" header-align="center" align="center">
              <template slot-scope="scope">
                {{ $getDictLabel('reviewStatus', scope.row.reviewStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="issueStatus" label="下发状态" header-align="center" align="center" width="120">
              <template slot-scope="scope">
                {{ $getDictLabel('issueStatus', scope.row.issueStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="execType" label="执行类型" header-align="center" align="center">
              <template slot-scope="scope">
                {{ $getDictLabel('execType', scope.row.execType) }}
              </template>
            </el-table-column>
            <el-table-column prop="autoPlatformName" label="关联平台" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
            <el-table-column prop="createDate" label="创建时间" header-align="right" align="right" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateDate" label="修改时间" header-align="right" align="right" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="quoteNum" label="引用次数" header-align="center" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" width="170">
              <template slot-scope="scope">
                <template v-for="(item, index) in scope.row.operate">
                  <el-button v-if="item==2" @click="doOperation(item,scope.row)" :disabled="[1,4].includes(scope.row.reviewStatus)" :key="index" type="text" size="small">{{ $getDictLabel('operateType',item) }}</el-button>
                  <el-button v-else @click="doOperation(item,scope.row)" :key="index" type="text" size="small">{{ $getDictLabel('operateType',item) }}</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :current-page="dataForm.page" :page-sizes="[10, 100, 500,10000]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
        </el-card>
      </el-col>
      <!--引入新增修改用例页面-->
      <add-or-update-case ref="addOrUpdateCase" :visible.sync="addOrUpdateCase" @watchChildPage="triggerParentMethod"></add-or-update-case>
      <!--引入案例轨迹页面-->
      <case-trajectory ref="caseTrajectory" :visible.sync="caseTrajectory"></case-trajectory>
      <!--引入用例收藏-->
      <case-collect ref="caseCollect" :visible.sync="caseCollect"></case-collect>
      <!--引入引用用例页面-->
      <ref-case ref="refCase" :visible.sync="refCase" @watchChildPage="triggerParentMethod"></ref-case>
      <!--引入下发用例-->
      <case-issue ref="caseIssue" :visible.sync="caseIssue" @watchChildPage="triggerParentMethod"></case-issue>
      <!--引入用例模块-->
      <case-module ref="caseModule" :visible.sync="caseModule" @watchChildPage="triggerParentMethod"></case-module>
      <!--引入文件导入-->
      <ctc-file-import ref="ctcFileImport" :visible.sync="ctcFileImport" @watchChildImport="triggerParentMethod"></ctc-file-import>
    </el-row>
  </div>
</template>
<script>
import ctcUtils from '@/utils/ctc-utils.js'
import { addDynamicRoute } from '@/router'
import AddOrUpdateCase from '@/components/common/case/add-or-update-case'
import CaseTrajectory from '@/components/common/case/case-trajectory'
import CaseCollect from './children-page/case-collect'
import RefCase from './children-page/ref-case'
import CaseIssue from './children-page/case-issue'
import CaseModule from './children-page/case-module'
export default {
  name: 'ProjectCaseList',
  components: {
    AddOrUpdateCase, CaseTrajectory, CaseCollect, RefCase, CaseIssue, CaseModule
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      dataForm: {
        moduleOneName: '',
        moduleTwoName: '',
        moduleThreeName: '',
        creatorName: '',
        issueStatus: '',
        reviewStatus: '',
        caseName: '',
        caseType: '',
        createDate: '',
        updateDate: '',
        limit: 10,
        page: 1
      },
      orderId: '',
      total: 0,
      caseTableData: [],
      dataModuleOneData: [], // 模块一数据
      dataModuleTwoData: [], // 模块二数据
      dataModuleThreeData: [], // 模块三数据
      batchCheckAll: false,
      isOpen: false,
      addOrUpdateCase: false,
      caseTrajectory: false,
      caseCollect: false,
      refCase: false,
      caseIssue: false,
      ctcFileImport: false,
      caseModule: false
    }
  },
  watch: {
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getProjectCase()
        this.loadModuleData(1, { 'moduleLevel': 1 })
      }
    }
  },
  computed: {
  },
  mounted () {
    this.getProjectCase()
    this.loadModuleData(1, { 'moduleLevel': 1 })
  },
  activated () {
  },
  methods: {
    triggerParentMethod (message) {
      if (message.type === 'reloadTable') {
        this.getProjectCase()
        this.$emit('watchChildTree', { 'type': 'reloadTree', 'data': { 'taskId': this.projectData.taskId } })
      }
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getProjectCase()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getProjectCase()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getProjectCase()
    },
    batchCheckAllChange (item) {
      if (item) {
        this.dataForm.limit = 10000
      } else {
        this.dataForm.limit = 10
      }
      this.getProjectCase()
    },
    getParams () {
      let params = { ...this.dataForm, ...this.projectData }
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createDateStart = params.createDate[0]
        params.createDateEnd = params.createDate[1]
        delete params['createDate']
      }
      if (params.updateDate.length > 0) {
        params.updateDateStart = params.updateDate[0]
        params.updateDateEnd = params.updateDate[1]
        delete params['updateDate']
      }
      // 特殊处理模块过滤条件
      let moduleOneItem = params.moduleOneName || {}
      if (moduleOneItem.moduleId) {
        params.moduleOne = moduleOneItem.moduleId
        params.moduleOneName = ''
      } else {
        params.moduleOneName = moduleOneItem.moduleName
      }
      let moduleTwoItem = params.moduleTwoName || {}
      if (moduleTwoItem.moduleId) {
        params.moduleTwo = moduleTwoItem.moduleId
        params.moduleTwoName = ''
      } else {
        params.moduleTwoName = moduleTwoItem.moduleName
      }
      let moduleThreeItem = params.moduleThreeName || {}
      if (moduleThreeItem.moduleId) {
        params.moduleThree = moduleThreeItem.moduleId
        params.moduleThreeName = ''
      } else {
        params.moduleThreeName = moduleThreeItem.moduleName
      }
      return params
    },
    getProjectCase () {
      this.$ctcLoading.open()
      let params = this.getParams()
      this.$http.get('ctc/case/caseList/pageFromMenu', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.caseTableData = res.data.list
          this.total = res.data.total
          // 判断是否批量全选
          if (this.batchCheckAll) {
            this.$refs.caseTableData.toggleAllSelection()
          }
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    loadModuleData (type, tparams) {
      let thisvm = this
      let params = { ...tparams, ...thisvm.projectData }
      thisvm.$http.get('ctc/case/caseTree/moduleList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          if (type === 1) {
            thisvm.dataModuleOneData = res.data
            thisvm.dataModuleTwoData = []
            thisvm.dataModuleThreeData = []
            thisvm.dataForm.moduleOneName = ''
            thisvm.dataForm.moduleTwoName = ''
            thisvm.dataForm.moduleThreeName = ''
          } else if (type === 2) {
            thisvm.dataModuleTwoData = res.data
            thisvm.dataModuleThreeData = []
            thisvm.dataForm.moduleTwoName = ''
            thisvm.dataForm.moduleThreeName = ''
          } else if (type === 3) {
            thisvm.dataModuleThreeData = res.data
            thisvm.dataForm.moduleThreeName = ''
          }
        }
      }).catch(() => { })
    },
    chooseModule (item) {
      let moduleLevel = item.moduleLevel
      let moduleLevelNext = moduleLevel + 1
      if (item.moduleId) {
        let params = { 'parentModule': item.moduleId, 'moduleLevel': moduleLevelNext }
        this.loadModuleData(moduleLevelNext, params)
      }
    },
    doOperation (type, row) {
      if (type === '21') {
        // 案例轨迹
        this.$refs.caseTrajectory.init()
        this.$refs.caseTrajectory.caseId = row.caseId
      } else if (type === '1') {
        // 修改用例
        this.$refs.addOrUpdateCase.dataForm.pathPageName = '用例设计管理'
        this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
        this.$refs.addOrUpdateCase.dataForm.taskId = row.taskId
        this.$refs.addOrUpdateCase.dataForm.readOnly = 0 // 0:编辑模式;1:只读模式
        this.$refs.addOrUpdateCase.init()
      } else if (type === '0') {
        // 查看用例
        this.$refs.addOrUpdateCase.dataForm.pathPageName = '用例设计管理'
        this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
        this.$refs.addOrUpdateCase.dataForm.taskId = row.taskId
        this.$refs.addOrUpdateCase.dataForm.readOnly = 1 // 0:编辑模式;1:只读模式
        this.$refs.addOrUpdateCase.init()
      } else if (type === '2') {
        // 删除用例
        this.doCaseDelete(row)
      }
    },
    // 权限控制
    doAuthValid (type) {
      let taskId = this.projectData.taskId
      if (taskId) {
        let params = { 'taskId': taskId }
        this.$http.get('/ctc/task/base/canDesignTaskCase', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.orderId = res.data || ''
            if (type === 'ref') {
              this.doRefCase()
            } else if (type === 'add') {
              this.doAddCase()
            } else if (type === 'issue') {
              this.doIssueCase()
            }
          }
        }).catch(() => { })
      }
    },
    doRefCase () {
      // 引用用例
      this.$refs.refCase.parentProjectId = this.projectData.parentProjectId
      this.$refs.refCase.projectId = this.projectData.projectId
      this.$refs.refCase.taskId = this.projectData.taskId
      this.$refs.refCase.init()
    },
    doAddCase () {
      // 新增用例
      this.$refs.addOrUpdateCase.dataForm.pathPageName = '用例设计管理'
      this.$refs.addOrUpdateCase.dataForm.parentProjectId = this.projectData.parentProjectId
      this.$refs.addOrUpdateCase.dataForm.projectId = this.projectData.projectId
      this.$refs.addOrUpdateCase.dataForm.caseId = ''
      this.$refs.addOrUpdateCase.dataForm.orderId = this.orderId
      this.$refs.addOrUpdateCase.dataForm.taskId = this.projectData.taskId
      this.$refs.addOrUpdateCase.dataForm.readOnly = 0 // 0:编辑模式;1:只读模式
      this.$refs.addOrUpdateCase.init()
    },
    doIssueCase () {
      let thisvm = this
      let selectionData = thisvm.$refs.caseTableData.selection
      if (selectionData.length > 0) {
        let caseIds = []
        let caseNames = [] // 判断用例下发评审状态
        selectionData.forEach((item, index) => {
          caseIds.push(item.caseId)
          // 用例评审不通过
          if (item.reviewStatus === 2) {
            caseNames.push(item.caseName)
          }
        })
        if (caseNames.length > 0) {
          thisvm.$message.warning('评审不通过用例，不允许下发执行！')
        } else {
          let params = { 'caseIds': caseIds }
          params.projectId = thisvm.projectData.projectId
          params.taskId = thisvm.projectData.taskId
          thisvm.$http.post('ctc/case/caseInfo/caseIssue', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return thisvm.$message.error(res.msg)
            }
            let data = res.data
            if (data.needSelect) {
              // 待选任务
              thisvm.$refs.caseIssue.issueTaskIdsData = data.caseIssueTasks
              thisvm.$refs.caseIssue.dataForm.issueType = data.issueType
              thisvm.$refs.caseIssue.dataForm.caseIds = caseIds
              thisvm.$refs.caseIssue.init()
            } else {
              this.getProjectCase()
              return thisvm.$message.success('用例下发成功')
            }
          }).catch(() => { })
        }
      } else {
        thisvm.$message.warning('没有选中任何操作记录！')
      }
    },
    doCaseCollect () {
      let selectionData = this.$refs.caseTableData.selection
      if (selectionData.length > 0) {
        let caseIds = []
        selectionData.forEach((item, index) => {
          caseIds.push(item.caseId)
        })
        // 机构收藏
        this.$refs.caseCollect.init()
        this.$refs.caseCollect.caseIds = caseIds
      } else {
        this.$message.warning('没有选中任何操作记录！')
      }
    },
    doBatchDeleteCase () {
      let selectionData = this.$refs.caseTableData.selection
      if (selectionData.length > 0) {
        let caseIds = []
        let caseNoDels = []
        selectionData.forEach((item, index) => {
          if (!item.operate.includes('2') || [1, 4].includes(item.reviewStatus)) {
            caseNoDels.push(item.caseName)
          }
          caseIds.push(item.caseId)
        })
        if (caseNoDels.length > 0) {
          let msg = '以下用例校验不通过，不允许批量删除<br/>' + caseNoDels.join('<br/>')
          this.$message({
            dangerouslyUseHTMLString: true,
            message: msg,
            showClose: true,
            duration: 15000,
            type: 'warning'
          })
        } else {
          this.$confirm('确定删除[用例]操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.delete('/ctc/case/caseInfo', { 'data': caseIds }).then(({ data: res }) => {
              if (res.code !== 0) {
                this.$message.error(res.msg)
              } else {
                this.$message.success('用例删除成功')
                this.getProjectCase()
              }
            }).catch(() => {
            })
          }).catch(() => { })
        }
      } else {
        this.$message.warning('没有选中任何操作记录！')
      }
    },
    doCaseDelete (row) {
      this.$toggleRowSelectionTable('caseTableData', row)
      this.$confirm('确定删除[用例]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/case/caseInfo', { 'data': [row.caseId] }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('用例删除成功')
            this.getProjectCase()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    doImportCase () {
      let taskId = this.projectData.taskId
      if (taskId) {
        let params = { 'taskId': taskId }
        this.$http.get('/ctc/task/base/canDesignTaskCase', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            let uploadData = Object.assign({}, this.projectData)
            uploadData.orderId = res.data || ''
            let templateData = { 'fileName': '用例设计模板下载' }
            let fileImportParams = { 'templateData': templateData, 'uploadData': uploadData }
            fileImportParams.templateUrl = '/ctc/case/caseInfo/exportCaseTemplate'
            fileImportParams.uploadUrl = '/ctc/case/caseInfo/importCaseData'
            this.$refs.ctcFileImport.fileImportParams = { ...this.$refs.ctcFileImport.fileImportParams, ...fileImportParams }
            this.$refs.ctcFileImport.init()
          }
        }).catch(() => { })
      }
    },
    doExportCase () {
      let data = { ...this.dataForm, ...this.projectData }
      data.fileName = '用例导出'
      // 特殊处理创建日期、修改日期
      if (data.createDate.length > 0) {
        data.createDateStart = data.createDate[0]
        data.createDateEnd = data.createDate[1]
        delete data['createDate']
      }
      if (data.updateDate.length > 0) {
        data.updateDateStart = data.updateDate[0]
        data.updateDateEnd = data.updateDate[1]
        delete data['updateDate']
      }
      delete data['page']
      delete data['limit']
      // 特殊处理用例勾选用例，只导出用户勾选用例
      let selectionData = this.$refs.caseTableData.selection
      if (selectionData.length > 0) {
        let caseIds = []
        selectionData.forEach((item, index) => {
          caseIds.push(item.caseId)
        })
        data.caseIdArr = caseIds.join(',')
      }
      let projectId = data.projectId || data.parentProjectId || ''
      if (projectId) {
        this.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('获取项目基本信息失败')
          } else {
            data.fileName = res.data.name
            let url = '/ctc/case/caseInfo/exportCaseData'
            ctcUtils.customExportPost(url, data)
          }
        }).catch(() => { })
      } else {
        let url = '/ctc/case/caseInfo/exportCaseData'
        ctcUtils.customExportPost(url, data)
      }
    },
    doModuleCase () {
      this.$refs.caseModule.projectId = this.projectData.projectId
      this.$refs.caseModule.taskId = this.projectData.taskId
      this.$refs.caseModule.init()
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
.el-col {
}
</style>
