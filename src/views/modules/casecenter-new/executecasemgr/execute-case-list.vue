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
                <el-form-item prop="execStatus" label="执行状态">
                  <ctc-select v-model="dataForm.execStatus" dict-type="resultDetermination" placeholder="请选择执行状态"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="executor" label="执行人名">
                  <el-input v-model="dataForm.executor" placeholder="请输入执行人"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top:24px;">
        <el-card shadow="never" class="aui-card--fill">
          <el-row>
            <el-col :span="12" class="split-line" style="text-align:left;">
              用例列表
            </el-col>
            <el-col :span="12" style="text-align:right;">
              <el-button type="warning" size="small" @click="doExportCase()">导出</el-button>
              <el-button type="danger" size="small" @click="doBatchDeleteCase()">删除</el-button>
            </el-col>
          </el-row>
          <el-table stripe highlight-current-row :data="caseTableData" ref="caseTableData" border height="680" style="width:100%;;overflow-y:auto;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="caseCode" label="用例编号" header-align="left" align="left" width="190" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="doSearchCase(scope.row)">{{scope.row.caseCode?scope.row.caseCode:scope.row.caseId}}</el-button>
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
            <el-table-column prop="execStatus" label="执行状态" header-align="center" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ $getDictLabel('resultDetermination', scope.row.execStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="execType" label="执行类型" header-align="center" align="center">
              <template slot-scope="scope">
                {{ $getDictLabel('execType', scope.row.execType) }}
              </template>
            </el-table-column>
            <el-table-column prop="executor" label="执行人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="autoPlatformName" label="关联平台" header-align="center" align="center" show-overflow-tooltip></el-table-column>
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
            <el-table-column prop="createName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateDate" label="修改时间" header-align="right" align="right" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" :disabled="!scope.row.operate.includes('21')" @click="doOperation(1,scope.row)">执行轨迹</el-button>
                <el-button type="text" size="small" :disabled="!scope.row.operate.includes('1')" @click="doOperation(2,scope.row)">修改</el-button>
                <el-button type="text" size="small" :disabled="!scope.row.operate.includes('0')" @click="doOperation(3,scope.row)">查看</el-button>
                <el-button type="text" size="small" :disabled="!scope.row.operate.includes('2')" @click="doOperation(4,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :current-page="dataForm.page" :page-sizes="[10, 20, 50]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
        </el-card>
      </el-col>
      <!--引入案例轨迹页面-->
      <execute-case-trajectory ref="executeCaseTrajectory" :visible.sync="executeCaseTrajectory"></execute-case-trajectory>
      <!--引入新增修改用例页面-->
      <add-or-update-case ref="addOrUpdateCase" :visible.sync="addOrUpdateCase" @watchChildPage="triggerParentMethod"></add-or-update-case>
    </el-row>
  </div>
</template>
<script>
import ctcUtils from '@/utils/ctc-utils.js'
import { addDynamicRoute } from '@/router'
import ExecuteCaseTrajectory from '@/components/common/case/execute-case-trajectory'
import AddOrUpdateCase from './children-page/add-or-update-case'
export default {
  name: 'ExecuteCaseList',
  components: {
    ExecuteCaseTrajectory, AddOrUpdateCase
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
        caseType: '',
        caseName: '',
        execStatus: '',
        executor: '',
        limit: 10,
        page: 1
      },
      total: 0,
      caseTableData: [],
      dataModuleOneData: [], // 模块一数据
      dataModuleTwoData: [], // 模块二数据
      dataModuleThreeData: [], // 模块三数据
      isOpen: false,
      executeCaseTrajectory: false,
      addOrUpdateCase: false
    }
  },
  watch: {
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        // console.info('newVal====' + JSON.stringify(newVal))
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
    getProjectCase () {
      this.$ctcLoading.open()
      let params = { ...this.dataForm, ...this.projectData }
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
      this.$http.get('/ctc/exec/case/pageCaseInfoByTask', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.caseTableData = res.data.list
          this.total = res.data.total
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    loadModuleData (type, tparams) {
      let thisvm = this
      let params = { ...tparams, ...thisvm.projectData }
      delete params['taskId']
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
      if (type === 1) {
        // 执行轨迹
        this.$refs.executeCaseTrajectory.init()
        this.$refs.executeCaseTrajectory.caseId = row.caseId
      } else if (type === 2) {
        // 修改用例
        this.$refs.addOrUpdateCase.dataForm.pathPageName = '执行用例管理'
        this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
        this.$refs.addOrUpdateCase.dataForm.taskId = row.taskId
        this.$refs.addOrUpdateCase.dataForm.readOnly = 0 // 0:编辑模式;1:只读模式
        this.$refs.addOrUpdateCase.init()
      } else if (type === 3) {
        // 查看用例
        this.$refs.addOrUpdateCase.dataForm.pathPageName = '执行用例管理'
        this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
        this.$refs.addOrUpdateCase.dataForm.taskId = row.taskId
        this.$refs.addOrUpdateCase.dataForm.readOnly = 1 // 0:编辑模式;1:只读模式
        this.$refs.addOrUpdateCase.init()
      } else if (type === 4) {
        // 删除用例
        this.doCaseDelete(row)
      }
    },
    doCaseDelete (row) {
      this.$toggleRowSelectionTable('caseTableData', row)
      this.$confirm('确定删除[用例]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/exec/case', { 'data': [row.caseId] }).then(({ data: res }) => {
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
    doSearchCase (row) {
      // 查看用例
      this.$refs.addOrUpdateCase.dataForm.pathPageName = '执行用例管理'
      this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
      this.$refs.addOrUpdateCase.dataForm.taskId = row.taskId
      this.$refs.addOrUpdateCase.dataForm.readOnly = 1 // 0:编辑模式;1:只读模式
      this.$refs.addOrUpdateCase.init()
    },
    doBatchDeleteCase () {
      let selectionData = this.$refs.caseTableData.selection
      if (selectionData.length > 0) {
        let caseIds = []
        let caseNoDels = []
        selectionData.forEach((item, index) => {
          if (!item.operate.includes('2')) {
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
            this.$http.delete('/ctc/exec/case', { 'data': caseIds }).then(({ data: res }) => {
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
    doExportCase () {
      let data = { ...this.dataForm, ...this.projectData }
      data.fileName = '用例执行'
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
      let url = '/ctc/exec/case/exportData'
      ctcUtils.customExportPost(url, data)
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
