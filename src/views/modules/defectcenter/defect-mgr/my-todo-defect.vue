<template>
  <el-card shadow="never" class="aui-card--fill  my-todo-defect">
    <el-form :model="dataForm" ref="dataForm" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="parentProjectId" label="所属项目">
            <el-select v-model="dataForm.parentProjectId" clearable filterable placeholder="请选择项目" value-key="id" @change="chooseParentProject">
              <el-option v-for="data in dataParentProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dataForm.hasChildProject">
          <el-form-item prop="projectId" label="子项目名">
            <el-select v-model="dataForm.projectId" clearable filterable placeholder="请选择项目" value-key="id" @change="chooseProject">
              <el-option v-for="data in dataProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="defectCode" label="缺陷编号">
            <el-input v-model="dataForm.defectCode" placeholder="请输入缺陷编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align:right;">
          <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
          <el-button type="primary" size="small" @click="doProjectDefectData()">查询</el-button>
          <el-button size="small" @click="doResetProjectDefectData()">重置</el-button>
        </el-col>
      </el-row>
      <el-row v-if="isOpen">
        <el-col :span="6">
          <el-form-item prop="name" label="缺陷名称">
            <el-input v-model="dataForm.name" placeholder="请输入缺陷名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="taskId" label="关联任务">
            <el-select v-model="dataForm.taskId" clearable filterable placeholder="请选择任务" value-key="id">
              <el-option v-for="data in dataTaskData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="caseCode" label="用例编号">
            <el-input v-model="dataForm.caseCode" placeholder="请输入用例编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="defectLevel" label="缺陷级别">
            <ctc-select v-model="dataForm.defectLevel" dict-type="defectLevel" placeholder="请选择缺陷级别"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="defectStatus" label="缺陷状态">
            <ctc-select v-model="dataForm.defectStatus" dict-type="defectStatus" placeholder="请选择缺陷状态"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="creatorName" label="提出人名">
            <el-input v-model="dataForm.creatorName" placeholder="请输入提出人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :span="14" class="split-line" style="text-align:left;">
          我待办缺陷<el-switch v-model="showCaseField" @change="showCaseFieldChange" active-text="显示全部字段" inactive-text="隐藏用例字段" style="padding-left:15px;"></el-switch>
        </el-col>
        <el-col :span="10" style="text-align:right;">
          <el-button type="blue" size="small" @click="doExportData()">导出</el-button>
        </el-col>
      </el-row>
      <el-table stripe highlight-current-row :data="defectDataList" ref="defectDataList" border style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <template v-for="(item, index) in defectTableTitleData">
          <el-table-column :key="index" :label="item.name" :width="item.width" v-if="item.isShow" header-align="left" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="item.code=='defectCode'">
                <el-button type="text" size="small" @click="doSearchDefectDetail(scope.row)">{{scope.row.defectCode}}</el-button>
                <el-button type="text" icon="el-icon-copy-document" @click="$copyContent(scope.row.defectCode)"></el-button>
              </template>
              <template v-else>
                <div v-html="getTableColumnData(scope.row,item)"></div>
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination :current-page="dataForm.page" :page-sizes="[10, 20, 50]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </el-form>
  </el-card>
</template>
<script>
import ctcUtils from '@/utils/ctc-utils.js'
import { addDynamicRoute } from '@/router'
import { polishingOssHost } from '@/utils/validate'
export default {
  name: 'MytodoDefect',
  components: {
  },
  data () {
    return {
      dataForm: {
        hasChildProject: true, // 判断有无子项目
        parentProjectId: '',
        projectId: '',
        taskId: '',
        defectStatus: '',
        defectCode: '',
        name: '',
        caseId: '',
        defectLevel: '',
        creatorName: '',
        caseCode: '',
        page: 1,
        limit: 10
      },
      total: 0,
      dataParentProjectData: [],
      dataProjectData: [],
      dataTaskData: [],
      relaPlatformDataMap: [],
      addOrUpdateDefect: false,
      defectTrajectory: false,
      isOpen: false,
      showCaseField: true,
      defectDataList: [],
      defectTableTitleData: [
        { 'code': 'parentProjectName', 'name': '项目', 'width': 200, 'isShow': true }, { 'code': 'projectName', 'name': '子项目', 'width': 200, 'isShow': true },
        { 'code': 'taskName', 'name': '任务', 'width': 200, 'isShow': true }, { 'code': 'moduleTwoName', 'name': '模块二', 'width': 200, 'isShow': true },
        { 'code': 'moduleThreeName', 'name': '模块三', 'width': 200, 'isShow': true }, { 'code': 'defectCode', 'name': '缺陷编号', 'width': 180, 'isShow': true },
        { 'code': 'name', 'name': '缺陷名称', 'width': 350, 'isShow': true }, { 'code': 'defectStatus', 'name': '缺陷状态', 'width': 120, 'isShow': true },
        { 'code': 'caseCode', 'name': '用例编号', 'width': 150, 'isShow': true }, { 'code': 'caseName', 'name': '用例名称', 'width': 200, 'isShow': true },
        { 'code': 'moduleOneName', 'name': '模块一', 'width': 200, 'isShow': true }, { 'code': 'organizeName', 'name': '参测对象', 'width': 200, 'isShow': true },
        { 'code': 'creatorName', 'name': '提出人', 'width': 200, 'isShow': true }, { 'code': 'handlerName', 'name': '当前处理人', 'width': 200, 'isShow': true },
        { 'code': 'defectType', 'name': '缺陷类型', 'width': 150, 'isShow': true }, { 'code': 'defectEnv', 'name': '缺陷环境', 'width': 120, 'isShow': true },
        { 'code': 'defectLevel', 'name': '缺陷级别', 'width': 120, 'isShow': true }, { 'code': 'defectSource', 'name': '缺陷来源', 'width': 200, 'isShow': true },
        { 'code': 'createDate', 'name': '创建时间', 'width': 180, 'isShow': true }, { 'code': 'expectRepairDate', 'name': '期望时间', 'width': 180, 'isShow': true },
        { 'code': 'repairDate', 'name': '修复时间', 'width': 180, 'isShow': true }, { 'code': 'closeDate', 'name': '关闭时间', 'width': 180, 'isShow': true },
        { 'code': 'rejectCount', 'name': '驳回次数', 'width': 100, 'isShow': true }, { 'code': 'defectReason', 'name': '缺陷原因', 'width': 200, 'isShow': true },
        { 'code': 'defectCategory', 'name': '缺陷原因分类', 'width': 200, 'isShow': true }
      ]
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    let thisvm = this
    // 两个标签页手动触发加载
    window.addEventListener('handReLoadEvent', function (event) {
      if (event.key === 'defectReload') {
        thisvm.doProjectDefectData()
      }
    })
    thisvm.getRelevanceData()
  },
  activated () {
  },
  methods: {
    triggerParentProject (message) {
      this.getProjectDefectData()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getProjectDefectData()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getProjectDefectData()
    },
    doResetProjectDefectData () {
      this.$refs.dataForm.resetFields()
      this.dataForm.hasChildProject = true
      this.doProjectDefectData()
    },
    doProjectDefectData () {
      this.dataForm.page = 1
      this.getProjectDefectData()
    },
    scrollBarWheel (event) {
      this.dom = this.$refs.defectDataList.bodyWrapper
      let delta = event.wheelDelta ? event.wheelDelta : (-event.detail) * 40
      let left = this.dom.scrollLeft
      this.dom.scrollLeft = left + delta * 0.3
    },
    showCaseFieldChange (value) {
      let thisvm = this
      let caseFields = ['taskName', 'moduleTwoName', 'moduleThreeName', 'caseCode', 'caseName', 'moduleOneName', 'organizeName']
      thisvm.defectTableTitleData.forEach((item, index) => {
        if (caseFields.includes(item.code)) {
          item.isShow = value
          thisvm.$set(thisvm.defectTableTitleData, index, item)
        }
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (['defectStatus', 'defectType', 'defectEnv', 'defectLevel', 'defectCategory'].includes(item.code)) {
        columnValue = this.$getDictLabel(item.code, row[item.code])
      } else if (['defectSource'].includes(item.code)) {
        columnValue = this.relaPlatformDataMap[row[item.code]] || '执行中心'
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    getProjectDefectData () {
      this.$ctcLoading.open()
      let params = Object.assign({}, this.dataForm)
      this.$http.get('/ctc/defect/base/todo', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.defectDataList = res.data.data.list
          this.total = res.data.data.total
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    // 父项目联动
    chooseParentProject (id) {
      let item = this.dataParentProjectData.filter(function (item) {
        return id === item.id
      })[0]
      this.dataForm.projectId = ''
      this.dataForm.taskId = ''
      this.chooseProjectTask(item)
    },
    // 子项目联动
    chooseProject (id) {
      let item = this.dataProjectData.filter(function (item) {
        return id === item.id
      })[0]
      this.dataForm.taskId = ''
      this.chooseProjectTask(item)
    },
    // 任务
    chooseTask (id) {
    },
    chooseProjectTask (item) {
      if (item.id) {
        // nodeType 1:项目2:子项目;4:任务
        let nodeType = item.nodeType
        let childNodeType = item.childNodeType
        // 判断有无子项目
        if (nodeType === 1) {
          if (childNodeType === 2) {
            this.dataForm.hasChildProject = true
          } else {
            this.dataForm.hasChildProject = false
          }
        }
        this.loadProjectTaskData(childNodeType, item, true)
      }
    },
    loadProjectTaskData (type, node) {
      let params = { 'id': node.id, 'nodeType': node.nodeType }
      let url = '/ctc/project/projectDetail/listTreeRoot'
      if (type === 1) {
        url = '/ctc/project/projectDetail/listTreeRoot'
      } else if (type === 2) {
        url = '/ctc/project/projectDetail/listTree'
      } else if (type === 3 || type === 4) {
        url = '/ctc/task/taskQuery/listTaskTree'
        params.taskType = 5
      }
      this.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          if (type === 1) {
            this.dataParentProjectData = res.data
            this.dataProjectData = []
            this.dataTaskData = []
          } else if (type === 2) {
            this.dataProjectData = res.data
            this.dataTaskData = []
          } else if (type === 3) {
            this.dataTaskData = res.data
          }
        }
      }).catch(() => { })
    },
    getDefectSourceHtml (row) {
      let defectSourceName = this.relaPlatformDataMap[row.defectSource] || '执行中心'
      return defectSourceName
    },
    getRelevanceData () {
      this.$http.get('/ctc/project/relaPlatform/list', { params: {} }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let defaultData = [{ 'applicationId': '-1', 'name': '执行中心', 'code': 'ZXZX' }]
          let data = defaultData.concat(res.data)
          this.relaPlatformDataMap = {}
          data.forEach((item, index) => {
            this.relaPlatformDataMap[item.applicationId] = item.name
          })
          this.getProjectDefectData()
          this.loadProjectTaskData(1, {})
        }
      }).catch(() => { })
    },
    doSearchDefectDetail (row) {
      let path = 'defectcenter/defect-mgr/defect-data-detail'
      let titel = '查看缺陷详情'
      let params = {}
      params.defectId = row.defectId
      params.defectInfo = row
      this.customAddDynamicRoute(path, titel, params)
    },
    doExportData () {
      let data = { ...this.dataForm }
      data.fileName = '我待办缺陷导出'
      let selectionData = this.$refs.defectDataList.selection
      if (selectionData.length > 0) {
        let defectIds = []
        selectionData.forEach((item, index) => {
          defectIds.push(item.defectId)
        })
        data.defectIds = defectIds.join(',')
      }
      // 设置文件服务器域名
      data.ossHost = polishingOssHost('#filePath#', 2)
      let projectId = data.projectId || data.parentProjectId || ''
      if (projectId) {
        this.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('获取项目基本信息失败')
          } else {
            data.fileName = res.data.name
            let url = '/ctc/defect/base/toDoListExport'
            ctcUtils.customExportPost(url, data)
          }
        }).catch(() => { })
      } else {
        let url = '/ctc/defect/base/toDoListExport'
        ctcUtils.customExportPost(url, data)
      }
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
<style  lang="scss">
.my-todo-efect {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .el-form-item__content .el-input-group--append {
    width: 200px;
  }
  .el-form-item__content .el-date-editor--date {
    width: 200px;
  }
}
</style>
