<template>
  <el-card shadow="never" class="aui-card--fill  defect-mgr">
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
          <el-form-item prop="multipleDefectStatus" label="缺陷状态">
            <ctc-select v-model="dataForm.multipleDefectStatus" multiple dict-type="defectStatus" placeholder="请选择缺陷状态"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align:right;">
          <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
          <el-button type="text" size="small" @click="doQueryFilter(isSave)">{{isSave=='1'?'保存':'取消保存'}}</el-button>
          <el-button type="primary" size="small" @click="doProjectDefectData()">查询</el-button>
          <el-button size="small" @click="doResetProjectDefectData()">重置</el-button>
          <br />
          <el-tooltip class="item" effect="dark" content="请先选择所属项目信息" placement="bottom-end">
            <el-checkbox v-model="batchCheckAll" @change="batchCheckAllChange" style="margin-top:6px;" :disabled="!(dataForm.parentProjectId!='' || dataForm.projectId!='')">全选</el-checkbox>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row v-show="isOpen">
        <el-col :span="6">
          <el-form-item prop="defectCode" label="缺陷编号">
            <el-input v-model="dataForm.defectCode" placeholder="请输入缺陷编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="name" label="缺陷名称">
            <el-input v-model="dataForm.name" placeholder="请输入缺陷名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="taskId" label="关联任务">
            <el-select v-model="dataForm.taskId" filterable placeholder="请选择任务" value-key="id">
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
          <el-form-item prop="defectCategory" label="缺陷分类">
            <ctc-select v-model="dataForm.defectCategory" dict-type="defectCategory" placeholder="请选择缺陷分类"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="creatorName" label="提出人名">
            <el-input v-model="dataForm.creatorName" placeholder="请输入提出人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="handlerName" label="处理人名">
            <el-input v-model="dataForm.handlerName" placeholder="请输入当前处理人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="organizeId" label="参测对象">
            <ctc-project-organize-table v-model="dataForm.organizeId" :organizeId.sync="echoDataForm.organizeId" placeholder="请选择参测对象"></ctc-project-organize-table>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="createDate" label="创建时间">
            <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :span="8" class="split-line" style="text-align:left;">
          缺陷列表
          <el-switch v-model="showCaseField" @change="showCaseFieldChange" active-text="显示全部字段" inactive-text="隐藏用例字段" style="padding-left:15px;"></el-switch>
        </el-col>
        <el-col :span="16" style="text-align:right;">
          <el-button type="blue" size="small" @click="addAddUpdateDefect()">新增</el-button>
          <el-button type="blue" size="small" @click="doBatchPublish()">发布</el-button>
          <el-button type="blue" size="small" @click="doTableTitleOrder()">列表设置</el-button>
          <el-button type="warning" size="small" @click="doExportData()">导出</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:10px;" v-if="titleOrderAdjust">
        <el-col :span="24" style="height:100px;overflow-y:auto;border:1px solid #ccc;">
          <template v-for="(item,index) in defectTableTitleData">
            <el-tag :key="index" v-if="item.isShow" effect="dark" v-dragging="{ item: item, list: defectTableTitleData, group: 'color' }" style="margin:6px;cursor:move;">
              {{ item.name }}
            </el-tag>
          </template>
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
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="doValidBtnAuth('1',scope.row)" @click="doReopenDefect(scope.row)">重新打开</el-button>
            <el-button type="text" size="small" :disabled="doValidBtnAuth('2',scope.row)" @click="addAddUpdateDefect(scope.row.defectId)">修改</el-button>
            <el-button type="text" size="small" v-if="false" @click="doDeleteDefect(scope.row.defectId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="dataForm.page" :page-sizes="[10, 20, 50,50000]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </el-form>
    <!--引入重新打开-->
    <defect-reopen :visible.sync="defectReopen" ref="defectReopen" @watchChildPage="triggerParentProject"></defect-reopen>
  </el-card>
</template>
<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import DefectAddOrUpdate from './defect-add-or-update'
import DefectReopen from './children-page/defect-reopen'
import ctcUtils from '@/utils/ctc-utils.js'
import { addDynamicRoute } from '@/router'
import { polishingOssHost } from '@/utils/validate'
export default {
  name: 'DefectMgr',
  components: {
    CtcProjectOrganizeTable, DefectAddOrUpdate, DefectReopen
  },
  data () {
    return {
      dataForm: {
        hasChildProject: true, // 判断有无子项目
        parentProjectId: '',
        projectId: '',
        taskId: '',
        multipleDefectStatus: '',
        defectCode: '',
        name: '',
        caseId: '',
        defectLevel: '',
        defectCategory: '',
        creatorName: '',
        handlerName: '',
        createDate: '',
        organizeId: '',
        caseCode: '',
        page: 1,
        limit: 10
      },
      echoDataForm: {
        organizeId: ''
      },
      total: 0,
      dataParentProjectData: [],
      dataProjectData: [],
      dataTaskData: [],
      relaPlatformDataMap: {},
      isOpen: false,
      isSave: '1', // 1保存;2：清除
      titleOrderAdjust: false,
      defectTrajectory: false,
      defectReopen: false,
      showCaseField: true,
      batchCheckAll: false,
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
      this.doProjectDefectData()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getProjectDefectData()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.doProjectDefectData()
    },
    doResetProjectDefectData () {
      this.$refs.dataForm.resetFields()
      this.echoDataForm.organizeId = 'clear_' + Math.random()
      this.dataForm.hasChildProject = true
      this.batchCheckAll = false
      this.batchCheckAllChange(false)
    },
    doProjectDefectData () {
      this.dataForm.page = 1
      this.getProjectDefectData()
    },
    doTableTitleOrder (type) {
      this.titleOrderAdjust = !this.titleOrderAdjust
    },
    doQueryFilter (type) {
      let thisvm = this
      let key = thisvm.$store.state.user.id + '=defect'
      if (type === '1') {
        // 存储查询条件
        let params = Object.assign({}, thisvm.dataForm)
        if (params.projectId) {
          let projectSelectData = thisvm.dataProjectData.filter(function (item) {
            return params.projectId === item.id
          })
          params.projectSelectData = projectSelectData
        }
        if (params.taskId) {
          let taskSelectData = thisvm.dataTaskData.filter(function (item) {
            return params.taskId === item.id
          })
          params.taskSelectData = taskSelectData
        }
        for (let key in params) {
          if ({}.hasOwnProperty.call(params, key)) {
            if (params[key] === '' || params[key] === undefined || params[key] === null) {
              delete params[key]
            }
          }
        }
        localStorage.setItem(key, JSON.stringify(params))
        thisvm.isSave = '2'
        thisvm.$message.success('保存成功')
      } else if (type === '2') {
        // 清除查询条件
        localStorage.removeItem(key)
        thisvm.isSave = '1'
        thisvm.$message.success('取消保存成功')
      } else if (type === '3') {
        // 得到查询条件
        let data = JSON.parse(localStorage.getItem(key) || '{}')
        if (Object.keys(data).length > 0) {
          thisvm.isSave = '2'
        }
        thisvm.dataForm = { ...thisvm.dataForm, ...data }
        delete thisvm.dataForm['projectSelectData']
        delete thisvm.dataForm['taskSelectData']
        thisvm.echoDataForm.organizeId = data.organizeId
        thisvm.dataProjectData = data.projectSelectData || []
        thisvm.dataTaskData = data.taskSelectData || []
      }
    },
    doValidBtnAuth (type, row) {
      let authFlag = true
      let opAuth = [row.creator]
      // 【重新打开】判断当前登录账号并且缺陷状态是关闭
      if (type === '1' && row.defectStatus === 1 && opAuth.includes(this.$store.state.user.id)) {
        authFlag = false
      }
      // 【修改】判断当前登录账号并且缺陷状态是待修复
      if (type === '2' && row.defectStatus === 5 && opAuth.includes(this.$store.state.user.id)) {
        authFlag = false
      }
      return authFlag
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
    batchCheckAllChange (item) {
      if (item) {
        this.dataForm.limit = 50000
      } else {
        this.dataForm.limit = 10
      }
      this.dataForm.page = 1
      this.getProjectDefectData()
    },
    getProjectDefectData () {
      this.$ctcLoading.open()
      let params = Object.assign({}, this.dataForm)
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createDateStart = params.createDate[0]
        params.createDateEnd = params.createDate[1]
        delete params['createDate']
      }
      // 特殊处理缺陷状态
      params.multipleDefectStatus = params.multipleDefectStatus.join(',')
      this.$http.get('/ctc/defect/base/list', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.defectDataList = res.data.data.list
          this.total = res.data.data.total
          // 判断是否批量全选
          if (this.batchCheckAll) {
            this.$refs.defectDataList.toggleAllSelection()
          }
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
    addAddUpdateDefect (defectId) {
      let path = 'defectcenter/defect-mgr/defect-add-or-update'
      let title = defectId ? '修改缺陷' : '新增缺陷'
      let params = {}
      params.defectId = defectId || ''
      this.customAddDynamicRoute(path, title, params)
    },
    doReopenDefect (row) {
      this.$refs.defectReopen.defectId = row.defectId
      this.$refs.defectReopen.init()
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
          // 获取保存查询条件
          this.doQueryFilter('3')
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
    doDeleteDefect (row) {
      this.$toggleRowSelectionTable('defectDataList', row)
      this.$confirm('确定删除[缺陷]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/defect/base', { 'data': [row.defectId] }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('缺陷删除失败')
          } else {
            this.$message.success('缺陷删除成功')
            this.getProjectDefectData()
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    doExportData () {
      let data = { ...this.dataForm }
      data.fileName = '【缺陷导出】缺陷列表'
      // 特殊处理创建日期、修改日期
      if (data.createDate.length > 0) {
        data.createDateStart = data.createDate[0]
        data.createDateEnd = data.createDate[1]
        delete data['createDate']
      }
      // 特殊处理缺陷状态
      data.multipleDefectStatus = data.multipleDefectStatus.join(',')
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
      // 导出增加判断
      if (projectId || (selectionData.length > 0 && selectionData.length <= 50)) {
        if (projectId) {
          this.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error('获取项目基本信息失败')
            } else {
              data.fileName = '【' + res.data.name + '】缺陷列表'
              let url = '/ctc/defect/base/export'
              ctcUtils.customExportPost(url, data)
            }
          }).catch(() => { })
        } else {
          let url = '/ctc/defect/base/export'
          ctcUtils.customExportPost(url, data)
        }
      } else {
        this.$message.warning('缺陷导出仅支持按项目导出、直接勾选【<=50条】导出！')
      }
    },
    doBatchPublish () {
      let selectionData = this.$refs.defectDataList.selection
      if (selectionData.length > 0) {
        let defectIds = []
        // 缺陷状态判断
        let defectStatusNo = []
        // 缺陷处理人判断
        let defectHandlerNo = []
        selectionData.forEach((item, index) => {
          if (item.defectStatus !== 7) {
            defectStatusNo.push(item.defectCode)
          } else if (item.nowHandler !== this.$store.state.user.id) {
            defectHandlerNo.push(item.defectCode)
          }
          defectIds.push(item.defectId)
        })
        if (defectStatusNo.length > 0 || defectHandlerNo.length > 0) {
          let msgArr = ['以下缺陷校验不通过，只有【待发布】状态才能进行批量发布处理']
          if (defectStatusNo.length > 0) {
            msgArr = msgArr.concat(defectStatusNo)
          } else if (defectHandlerNo.length > 0) {
            msgArr = ['您没有发布权限，不能进行批量发布处理']
          }
          let msg = msgArr.join('<br/>')
          this.$message({
            dangerouslyUseHTMLString: true,
            message: msg,
            showClose: true,
            duration: 10000,
            type: 'warning'
          })
        } else {
          this.$confirm('确定批量发布[缺陷]操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {}
            params.defectId = defectIds
            params.operation = 10
            params.operationDesc = '批量发布'
            this.$http.post('/ctc/defect/base/deal', params).then(({ data: res }) => {
              if (res.code !== 0) {
                this.$message.error(res.msg)
              } else {
                this.$message.success('发布成功')
                this.getProjectDefectData()
              }
            }).catch(() => { })
          }).catch(() => { })
        }
      } else {
        this.$message.warning('请选择需要发布的缺陷！')
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
.defect-mgr {
}
</style>
