<template>
  <el-dialog title="引用用例" :visible.sync="innerVisible" :close-on-click-modal="false" width="65%" class="ref-case">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" ref="dataForm" :inline="false" label-position="right" label-width="90px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="projectTaskInfo" label="项目任务树" v-if="['1'].includes(dataForm.caseSource)">
                <ctc-project-module-tree v-model="dataForm.projectTaskInfo" placeholder="请选择项目任务树" :parent-name.sync="dataForm.parentName" @watchChildTree="triggerParentTree" style="width:100%;"></ctc-project-module-tree>
              </el-form-item>
              <el-form-item prop="projectTaskInfo" label="项目任务树" v-else>
                <ctc-bak-case-module-tree v-model="dataForm.projectTaskInfo" placeholder="请选择项目任务树" :treeType.sync="dataForm.treeType" :parent-name.sync="dataForm.parentName" @watchChildTree="triggerParentTree"></ctc-bak-case-module-tree>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="caseSource" label="用例来源">
                <el-select v-model="dataForm.caseSource" placeholder="请选择用例来源" @change="caseSourcechange">
                  <el-option key="1" label="项目用例" value="1"></el-option>
                  <el-option key="2" label="备选用例" value="2"></el-option>
                  <el-option key="3" label="共享用例" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align:right;">
              <el-button type="primary" size="small" @click="getRefCaseData()">查询</el-button>
              <el-button size="small" @click="resetRefCaseData()">重置</el-button>
            </el-col>
          </el-row>
          <el-table :data="refCaseTableData" ref="refCaseTableData" border style="width: 100%;height:400px;overflow-y:auto;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="caseName" label="用例名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="moduleOneName" label="模块一" header-align="center" align="center" width="150"></el-table-column>
            <el-table-column prop="creatorName" label="创建人" header-align="center" align="center"></el-table-column>
          </el-table>
          <el-pagination :current-page="dataForm.page" :page-sizes="[5, 20, 50]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
        </el-form>
        <!--[[选择挂载模块start-->
        <el-dialog width="60%" title="选择挂载模块" :visible.sync="refModuleVisible" append-to-body>
          <el-form :model="dataForm1" :rules="dataRule1" ref="dataForm1" :inline="false" label-position="right" label-width="80px">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="moduleOneName" label="模块一">
                  <el-select v-model="dataForm1.moduleOneName" clearable filterable allow-create placeholder="选择模块一" value-key="moduleId" @change="chooseModule" @blur="chooseModuleBlur(1,$event)">
                    <el-option v-for="data in dataModuleOneData" :key="data.moduleId" :label="data.moduleName" :value="data">{{data.moduleName}}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="moduleTwoName" label="模块二">
                  <el-select v-model="dataForm1.moduleTwoName" clearable filterable allow-create placeholder="选择模块二" value-key="moduleId" @change="chooseModule" @blur="chooseModuleBlur(2,$event)">
                    <el-option v-for="data in dataModuleTwoData" :key="data.moduleId" :label="data.moduleName" :value="data">{{data.moduleName}}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="moduleThreeName" label="模块三">
                  <el-select v-model="dataForm1.moduleThreeName" clearable filterable allow-create placeholder="选择模块三" value-key="moduleId" @change="chooseModule" @blur="chooseModuleBlur(3,$event)">
                    <el-option v-for="data in dataModuleThreeData" :key="data.moduleId" :label="data.moduleName" :value="data">{{data.moduleName}}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col :span="24" style="text-align:right;">
              <el-button type="primary" size="small" @click="handleRefModule">引 用</el-button>
            </el-col>
          </el-row>
        </el-dialog>
        <!--选择挂载模块end]]-->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import CtcProjectModuleTree from '@/components/project/ctc-project-module-tree'
import CtcBakCaseModuleTree from '@/components/project/ctc-bak-case-module-tree'
export default {
  name: 'RefCase',
  components: {
    CtcProjectModuleTree, CtcBakCaseModuleTree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        parentName: '',
        caseName: '',
        caseSource: '1',
        moduleId: '',
        treeType: -2, // 我的用例树
        projectTaskInfo: '',
        page: 1,
        limit: 5
      },
      dataForm1: {
        moduleOneName: '',
        moduleTwoName: '',
        moduleThreeName: ''
      },
      total: 0,
      parentProjectId: '',
      projectId: '',
      taskId: '',
      refCaseTableData: [],
      dataModuleOneData: [], // 模块一数据
      dataModuleTwoData: [], // 模块二数据
      dataModuleThreeData: [], // 模块三数据
      // 选中目录树节点信息
      selectNodeInfo: {
      },
      refModuleVisible: false,
      caseInfos: []
    }
  },
  watch: {
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
    dataRule1 () {
      return {
        moduleOneName: [
          { required: true, message: '模块一不允许为空', trigger: 'blur' },
          { required: true, message: '模块一不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataForm.projectTaskInfo = ''
        this.dataForm.parentName = ''
        this.$refs.dataForm.resetFields()
        this.getRefCaseData()
        this.loadModuleData(1, { 'moduleLevel': 1 })
      })
    },
    triggerParentTree (message) {
      let thisvm = this
      if (message.type === 'chooseProjectTask') {
        thisvm.selectNodeInfo = message.data
        // 1:项目;2:子项目;4:任务
        let nodeType = thisvm.selectNodeInfo.nodeType
        let childNodeType = thisvm.selectNodeInfo.childNodeType
        if (nodeType === 1) {
          if (childNodeType === 2) {
            this.dataForm.parentProjectId = thisvm.selectNodeInfo.id
          } else {
            this.dataForm.projectId = thisvm.selectNodeInfo.id
          }
        } else if (nodeType === 2) {
          this.dataForm.projectId = thisvm.selectNodeInfo.id
        } else {
          this.dataForm.taskId = thisvm.selectNodeInfo.id
        }
        thisvm.loadModuleData(1, { 'moduleLevel': 1 })
      } else if (message.type === 'chooseModule') {
        thisvm.selectNodeInfo = message.data
      }
    },
    loadModuleData (type, tparams) {
      let params = { ...tparams }
      params.parentProjectId = this.parentProjectId || ''
      params.projectId = this.projectId || ''
      params.taskId = this.taskId || ''
      this.$http.get('ctc/case/caseTree/moduleList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          if (type === 1) {
            this.dataModuleOneData = res.data
            this.dataModuleTwoData = []
            this.dataModuleThreeData = []
          } else if (type === 2) {
            this.dataModuleTwoData = res.data
            this.dataModuleThreeData = []
          } else if (type === 3) {
            this.dataModuleThreeData = res.data
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
    chooseModuleBlur (type, el) {
      let thisvm = this
      let inputValue = el.target.value
      let hasModuleName = true
      let tdata = []
      if (inputValue) {
        if (type === 1) {
          // 过滤新创建条目，并且判断用户输入名称是否存在
          let data = thisvm.dataModuleOneData.filter(function (item) {
            if (item.moduleName === inputValue) {
              hasModuleName = false
            }
            return item.moduleId !== ''
          })
          if (hasModuleName) {
            if (data !== undefined) {
              tdata = data
            }
            tdata = [{ 'moduleId': '', 'moduleName': inputValue }].concat(tdata)
            thisvm.dataModuleOneData = tdata
            thisvm.dataForm1.moduleOneName = tdata[0]
          }
        } else if (type === 2) {
          // 过滤新创建条目，并且判断用户输入名称是否存在
          let data = thisvm.dataModuleTwoData.filter(function (item) {
            if (item.moduleName === inputValue) {
              hasModuleName = false
            }
            return item.moduleId !== ''
          })
          if (hasModuleName) {
            if (data !== undefined) {
              tdata = data
            }
            tdata = [{ 'moduleId': '', 'moduleName': inputValue }].concat(tdata)
            thisvm.dataModuleTwoData = tdata
            thisvm.dataForm1.moduleTwoName = tdata[0]
          }
        } else if (type === 3) {
          // 过滤新创建条目，并且判断用户输入名称是否存在
          let data = thisvm.dataModuleThreeData.filter(function (item) {
            if (item.moduleName === inputValue) {
              hasModuleName = false
            }
            return item.moduleId !== ''
          })
          if (hasModuleName) {
            if (data !== undefined) {
              tdata = data
            }
            tdata = [{ 'moduleId': '', 'moduleName': inputValue }].concat(tdata)
            thisvm.dataModuleThreeData = tdata
            thisvm.dataForm1.moduleThreeName = tdata[0]
          }
        }
      }
    },
    caseSourcechange (value) {
      this.dataForm.treeType = value === '2' ? -2 : -1
      this.getRefCaseData()
    },
    resetRefCaseData () {
      this.$refs.dataForm.resetFields()
      this.dataForm.projectTaskInfo = ''
      this.dataForm.parentName = ''
      this.dataForm.caseSource = '1'
      this.getRefCaseData()
    },
    getRefCaseData () {
      let params = Object.assign({}, this.dataForm)
      let url = ''
      if (this.dataForm.caseSource === '1') {
        url = '/ctc/case/caseList/pageFromMenu'
      } else if (this.dataForm.caseSource === '2') {
        url = 'ctc/case/alternative/pageUserCase'
        params.moduleOne = this.selectNodeInfo.moduleOne || ''
        params.moduleTwo = this.selectNodeInfo.moduleTwo || ''
        params.moduleThree = this.selectNodeInfo.moduleThree || ''
      } else if (this.dataForm.caseSource === '3') {
        url = 'ctc/case/alternative/pageSharedCase'
        params.moduleOne = this.selectNodeInfo.moduleOne || ''
        params.moduleTwo = this.selectNodeInfo.moduleTwo || ''
        params.moduleThree = this.selectNodeInfo.moduleThree || ''
      }
      this.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.refCaseTableData = res.data.list
          this.total = res.data.total
        }
      }).catch(() => {
      })
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getRefCaseData()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getRefCaseData()
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let caseInfos = []
      let selectionData = this.$refs.refCaseTableData.selection
      selectionData.forEach((item, index) => {
        item.parentProjectId = this.parentProjectId
        item.projectId = this.projectId
        item.taskId = this.taskId
        caseInfos.push(item)
      })
      if (caseInfos.length > 0) {
        this.handleDialogClose()
        this.caseInfos = caseInfos
        this.dataForm1.moduleOneName = ''
        this.dataForm1.moduleTwoName = ''
        this.dataForm1.moduleThreeName = ''
        this.refModuleVisible = true
      } else {
        this.$message.warning('没有选中任何操作记录！')
      }
    },
    handleRefModule () {
      this.$refs['dataForm1'].validate((valid) => {
        if (valid) {
          // 新增：post;修改：put
          let params = {}
          params.parentProjectId = this.parentProjectId
          params.projectId = this.projectId
          params.taskId = this.taskId
          params.caseInfos = this.caseInfos
          // 特殊处理模块过滤条件
          let moduleOneItem = this.dataForm1.moduleOneName || {}
          if (moduleOneItem.moduleId) {
            params.moduleOne = moduleOneItem.moduleId
            params.moduleOneName = ''
          } else {
            params.moduleOneName = moduleOneItem.moduleName
          }
          let moduleTwoItem = this.dataForm1.moduleTwoName || {}
          if (moduleTwoItem.moduleId) {
            params.moduleTwo = moduleTwoItem.moduleId
            params.moduleTwoName = ''
          } else {
            params.moduleTwoName = moduleTwoItem.moduleName
          }
          let moduleThreeItem = this.dataForm1.moduleThreeName || {}
          if (moduleThreeItem.moduleId) {
            params.moduleThree = moduleThreeItem.moduleId
            params.moduleThreeName = ''
          } else {
            params.moduleThreeName = moduleThreeItem.moduleName
          }
          this.$http.post('/ctc/case/caseInfo/caseQuote', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.refModuleVisible = false
                // 刷新表格
                this.$emit('watchChildPage', { 'type': 'reloadTable', 'data': {} })
              }
            })
          }).catch(() => { })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss">
.ref-case {
}
</style>
<style lang="scss" scoped>
.ref-case {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
