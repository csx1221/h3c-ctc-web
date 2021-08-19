<template>
  <div class="project-case-list">
    <el-row>
      <el-col :span="24">
        <el-card shadow="never" class="aui-card--fill">
          <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="creatorName" label="创建人">
                  <el-input v-model="dataForm.creatorName" placeholder="请输入创建人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="caseName" label="用例名称">
                  <el-input v-model="dataForm.caseName" placeholder="请输入用例名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
                <el-checkbox v-model="batchCheckAll" @change="batchCheckAllChange" style="margin:0px 5px;">全选</el-checkbox>
                <el-button type="primary" size="small" @click="getProjectCase()">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
              </el-col>
            </el-row>
            <el-row v-if="isOpen">
              <el-col :span="8">
                <el-form-item prop="caseType" label="用例类型">
                  <ctc-select v-model="dataForm.caseType" dict-type="caseType" placeholder="请选择用例类型"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="issueStatus" label="下发状态">
                  <ctc-select v-model="dataForm.issueStatus" dict-type="issueStatus" placeholder="请选择下发状态"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="reviewStatus" label="评审状态">
                  <ctc-select v-model="dataForm.reviewStatus" dict-type="reviewStatus" placeholder="请选择评审状态"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="createDate" label="创建时间">
                  <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
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
            <el-col :span="21" style="text-align:right;" v-if="inType!='processed'">
              <span style="color:#4190f7;padding-right:10px;" v-if="(projectData.taskId || '')==''">说明：要选到左侧具体任务节点，才支持用例上传</span>
              <el-button type="blue" size="small" @click="doAddCase()">新增</el-button>
              <el-button type="blue" size="small" @click="doRefCase()">引用</el-button>
              <el-button type="blue" size="small" @click="doImportCase()" v-if="(projectData.taskId || '')!=''">上传</el-button>
              <el-button type="blue" size="small" @click="doIssueCase()">下发</el-button>
              <el-button type="danger" size="small" @click="doBatchDeleteCase()">删除</el-button>
            </el-col>
          </el-row>
          <el-table stripe highlight-current-row :data="caseTableData" ref="caseTableData" border maxHeight="680" style="width:100%;;overflow-y:auto;">
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
            <el-table-column prop="issueStatus" label="下发状态" header-align="center" align="center">
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
      <!--引入下发用例-->
      <case-issue ref="caseIssue" :visible.sync="caseIssue" @watchChildPage="triggerParentMethod"></case-issue>
      <!--引入引用用例页面-->
      <ref-case ref="refCase" :visible.sync="refCase" @watchChildPage="triggerParentMethod"></ref-case>
      <!--引入文件导入-->
      <ctc-file-import ref="ctcFileImport" :visible.sync="ctcFileImport" @watchChildImport="triggerParentMethod"></ctc-file-import>
    </el-row>
  </div>
</template>
<script>
import { addDynamicRoute } from '@/router'
import AddOrUpdateCase from '@/components/common/case/add-or-update-case'
import CaseTrajectory from '@/components/common/case/case-trajectory'
import CaseIssue from './children-page/case-issue'
import RefCase from './children-page/ref-case'
export default {
  name: 'ProjectCaseList',
  components: {
    AddOrUpdateCase, CaseTrajectory, CaseIssue, RefCase
  },
  props: {
    projectData: Object,
    inType: [Number, String],
    baseInfo: Object
  },
  data () {
    return {
      dataForm: {
        creatorName: '',
        caseName: '',
        caseType: '',
        issueStatus: '',
        reviewStatus: '',
        createDate: '',
        updateDate: '',
        limit: 10,
        page: 1
      },
      total: 0,
      caseTableData: [],
      batchCheckAll: false,
      isOpen: false,
      addOrUpdateCase: false,
      caseTrajectory: false,
      caseCollect: false,
      refCase: false,
      caseIssue: false,
      ctcFileImport: false
    }
  },
  watch: {
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getProjectCase()
      }
    }
  },
  computed: {
  },
  mounted () {
  },
  activated () {
  },
  methods: {
    triggerParentMethod (message) {
      if (message.type === 'reloadTable') {
        this.getProjectCase()
        let taskId = this.projectData.taskId || this.baseInfo.result.taskId
        this.$emit('watchChildTree', { 'type': 'reloadTree', 'data': { 'taskId': taskId } })
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
      this.$ctcLoading.open()
      let params = { ...this.dataForm, ...this.projectData }
      // 特殊处理创建日期、修改 日期
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
      return params
    },
    getProjectCase () {
      this.$ctcLoading.open()
      let params = this.getParams()
      this.$http.get('ctc/case/caseList/pageFromOrder', { 'params': params }).then(({ data: res }) => {
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
    doOperation (type, row) {
      if (type === '21') {
        // 案例轨迹
        this.$refs.caseTrajectory.init()
        this.$refs.caseTrajectory.caseId = row.caseId
      } else if (type === '1') {
        // 修改用例
        this.$refs.addOrUpdateCase.dataForm.pathPageName = '我的工作台'
        this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
        this.$refs.addOrUpdateCase.dataForm.taskId = row.taskId
        this.$refs.addOrUpdateCase.dataForm.readOnly = 0 // 0:编辑模式;1:只读模式
        this.$refs.addOrUpdateCase.init()
      } else if (type === '0') {
        // 查看用例
        this.$refs.addOrUpdateCase.dataForm.pathPageName = '我的工作台'
        this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
        this.$refs.addOrUpdateCase.dataForm.taskId = row.taskId
        this.$refs.addOrUpdateCase.dataForm.readOnly = 1 // 0:编辑模式;1:只读模式
        this.$refs.addOrUpdateCase.init()
      } else if (type === '2') {
        // 删除用例
        this.doCaseDelete(row)
      }
    },
    doAddCase () {
      // 新增用例
      this.$refs.addOrUpdateCase.dataForm.pathPageName = '我的工作台'
      this.$refs.addOrUpdateCase.dataForm.parentProjectId = this.projectData.parentProjectId || this.baseInfo.result.parentProjectId
      this.$refs.addOrUpdateCase.dataForm.projectId = this.projectData.projectId || this.baseInfo.result.projectId
      this.$refs.addOrUpdateCase.dataForm.taskId = this.projectData.taskId || this.baseInfo.result.taskId
      this.$refs.addOrUpdateCase.dataForm.orderId = this.baseInfo.result.orderId
      this.$refs.addOrUpdateCase.dataForm.caseId = ''
      this.$refs.addOrUpdateCase.dataForm.readOnly = 0 // 0:编辑模式;1:只读模式
      this.$refs.addOrUpdateCase.init()
    },
    doRefCase () {
      // 引用用例
      this.$refs.refCase.parentProjectId = this.projectData.parentProjectId || this.baseInfo.result.parentProjectId
      this.$refs.refCase.projectId = this.projectData.projectId || this.baseInfo.result.projectId
      this.$refs.refCase.taskId = this.projectData.taskId || this.baseInfo.result.taskId
      this.$refs.refCase.orderId = this.baseInfo.result.orderId
      this.$refs.refCase.init()
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
          let projectId = thisvm.baseInfo.result.projectId || thisvm.baseInfo.result.parentProjectId
          let params = { 'caseIds': caseIds }
          params.projectId = projectId
          params.taskId = thisvm.projectData.taskId || thisvm.baseInfo.result.taskId
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
    doImportCase () {
      let taskId = this.projectData.taskId
      if (taskId) {
        let uploadData = Object.assign({}, this.projectData)
        let templateData = { 'fileName': '用例设计模板下载' }
        let fileImportParams = { 'templateData': templateData, 'uploadData': uploadData }
        fileImportParams.templateUrl = '/ctc/case/caseInfo/exportCaseTemplate'
        fileImportParams.uploadUrl = '/ctc/case/caseInfo/importCaseData'
        this.$refs.ctcFileImport.fileImportParams = { ...this.$refs.ctcFileImport.fileImportParams, ...fileImportParams }
        this.$refs.ctcFileImport.init()
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
            this.$message.error('用例删除失败')
          } else {
            this.$message.success('用例删除成功')
            this.getProjectCase()
          }
        }).catch(() => {
        })
      }).catch(() => {
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
<style lang="scss">
.project-case-list {
}
</style>
<style lang="scss" scoped>
.project-case-list {
}
</style>
