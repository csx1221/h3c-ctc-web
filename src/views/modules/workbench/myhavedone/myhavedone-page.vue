<template>
  <el-row class="project-mgr-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="工单编号" prop="orderId">
                <el-input v-model="dataForm.orderId" placeholder="请输入工单编号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工单分类" prop="orderClassify">
                <el-cascader v-model="orderClassify" :options="orderClassifyData" :props="{ expandTrigger: 'hover' }" clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12" align="right">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button type="primary" size="small" @click="getProjectInfo()">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="6">
              <el-form-item label="项目名称" prop="parentProjectId">
                <el-select v-model="dataForm.parentProjectId" filterable placeholder="请选择项目" @change="chooseParentProject" style="width:100%;">
                  <el-option v-for="data in dataParentProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="子项目名" prop="projectId">
                <el-select v-model="dataForm.projectId" filterable placeholder="请选择子项目" style="width:100%;">
                  <el-option v-for="data in dataProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间" prop="createDate">
                <el-date-picker v-model="dataForm.createDate" type="daterange" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="提交日期" prop="submitDate">
                <el-date-picker v-model="dataForm.submitDate" type="daterange" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row style="margin-bottom:20px;">
          <el-col :span="12" class="split-line" style="text-align:left;">
            已办列表
          </el-col>
        </el-row>
        <el-table stripe highlight-current-row :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <template v-for="(item, index) in tableTitleData">
            <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.code!='dealStatus'" v-html="getTableColumnData(scope.row,item)"></span>
                <template v-else>
                  <el-tag v-if="scope.row.dealStatus ==0" size="small" type="info" v-html="getTableColumnData(scope.row,item)"></el-tag>
                  <el-tag v-else-if="scope.row.dealStatus ==1" size="small" type="success" v-html="getTableColumnData(scope.row,item)"></el-tag>
                  <el-tag v-else-if="scope.row.dealStatus ==2" size="small" type="success" v-html="getTableColumnData(scope.row,item)"></el-tag>
                  <el-tag v-else-if="scope.row.dealStatus ==3" size="small" v-html="getTableColumnData(scope.row,item)"></el-tag>
                </template>
              </template>
            </el-table-column>
          </template>
          <el-table-column fixed="right" label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button @click="doTableOperate(0,scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import mixinViewModule from '@/mixins/view-module'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'MyhavedonePage',
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      orderClassify: ['1', ''],
      dataForm: {
        orderId: '', // 工单编号
        dealStatus: '', // 工单状态
        parentProjectId: '', // 所属项目
        projectId: '', // 子项目
        orderType: '',
        createDate: '',
        submitDate: ''
      },
      orderClassifyData: [
        {
          value: '1',
          label: '任务工单',
          children: [
            { value: '1', label: '需求分析' }, { value: '2', label: '需求评审' }, { value: '3', label: '方案设计' },
            { value: '4', label: '方案评审' }, { value: '5', label: '用例设计' }, { value: '6', label: '用例评审' },
            { value: '7', label: '用例执行' }
          ]
        },
        {
          value: '2',
          label: '缺陷工单',
          children: [
            { value: '8', label: '缺陷中心' }
          ]
        },
        {
          value: '3',
          label: '事件工单',
          children: [
            { value: '9', label: '问题/任务' }
          ]
        },
        {
          value: '4',
          label: '项目工单',
          children: [
            { value: '10', label: '入项申请' }
          ]
        }
      ],
      tableTitleData: [],
      titleDataList: [
        { 'code': 'orderId', 'name': '工单编号' }, { 'code': 'orderTitle', 'name': '工单标题' },
        { 'code': 'orderType', 'name': '工单类型' }, { 'code': 'dealStatus', 'name': '工单状态' },
        { 'code': 'parentProject', 'name': '项目' }, { 'code': 'project', 'name': '子项目' },
        { 'code': 'creatorName', 'name': '派发人' }, { 'code': 'createDate', 'name': '创建时间' },
        { 'code': 'planEndTime', 'name': '计划完成' }, { 'code': 'submitTime', 'name': '提交时间' }
      ],
      questionTitleList: [
        { 'code': 'questionCode', 'name': '工单编号' }, { 'code': 'title', 'name': '工单标题' }, { 'code': 'questionStatus', 'name': '问题/任务状态' },
        { 'code': 'type', 'name': '问题/任务类型' }, { 'code': 'level', 'name': '问题/任务级别' }, { 'code': 'handlerName', 'name': '处理人' },
        { 'code': 'operationDesc', 'name': '处理意见' }, { 'code': 'nextHandlerName', 'name': '下一步处理人' },
        { 'code': 'creatorName', 'name': '创建人' }, { 'code': 'createDate', 'name': '创建时间' }, { 'code': 'updateDate', 'name': '修改时间' }
      ],
      projectApplyTitleList: [
        { 'code': 'orderId', 'name': '工单编号' }, { 'code': 'orderTitle', 'name': '工单标题' }, { 'code': 'creatorName', 'name': '创建人' }, { 'code': 'handlerName', 'name': '审核人' },
        { 'code': 'projectApply.dealStatus', 'name': '工单状态' }, { 'code': 'applyReason', 'name': '申请原因' },
        { 'code': 'operationDesc', 'name': '备注说明' }, { 'code': 'createDate', 'name': '创建时间' }, { 'code': 'updateDate', 'name': '修改时间' }
      ],
      dataList: [],
      dataParentProjectData: [],
      dataProjectData: []
    }
  },
  activated () {
  },
  computed: {},
  mounted () {
    this.loadProjectTaskData(1, {}, false)
    this.getProjectInfo()
  },
  methods: {
    handleSizeChange (val) {
      this.limit = val
      this.getProjectInfo()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getProjectInfo()
    },
    resetForm (formName) {
      this.$refs.dataForm.resetFields()
      this.orderClassify = ['1', '']
      this.getProjectInfo(1)
    },
    // 父项目联动
    chooseParentProject (id) {
      let item = this.dataParentProjectData.filter(function (item) {
        return id === item.id
      })[0]
      this.dataForm.name = item.nodeName
      this.dataForm.projectId = ''
      this.chooseProjectTask(item)
    },
    chooseProjectTask (item) {
      if (item.id) {
        // nodeType 1:项目2:子项目;4:任务
        let childNodeType = item.childNodeType
        this.loadProjectTaskData(childNodeType, item, true)
      }
    },
    loadProjectTaskData (type, node, isClear) {
      let thisvm = this
      let params = { 'id': node.id, 'nodeType': node.nodeType }
      let url = '/ctc/project/projectDetail/listTreeRoot'
      if (type === 1) {
        url = '/ctc/project/projectDetail/listTreeRoot'
      } else if (type === 2) {
        url = '/ctc/project/projectDetail/listTree'
      }
      thisvm.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          if (type === 1) {
            thisvm.dataParentProjectData = res.data
            if (isClear) {
              thisvm.dataProjectData = []
              thisvm.dataForm.parentProjectId = ''
              thisvm.dataForm.projectId = ''
            }
          } else if (type === 2) {
            thisvm.dataProjectData = res.data
            if (isClear) {
              thisvm.dataForm.projectId = ''
            }
          }
        }
      }).catch(() => { })
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.dataListLoading = true
      let params = { page: this.page, limit: this.limit, ...this.dataForm }
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createStartDate = params.createDate[0]
        params.createEndDate = params.createDate[1]
        delete params['createDate']
      }
      if (params.submitDate.length > 0) {
        params.submitStartTime = params.submitDate[0]
        params.submitEndTime = params.submitDate[1]
        delete params['submitDate']
      }
      // 特殊处理工单分类
      let orderClassify = this.orderClassify || ['1', '']
      let classifyValue = orderClassify[0]
      let orderType = orderClassify[1] ? Number(orderClassify[1]) : ''
      let url = '/ctc/task/todo/pageDoneList'
      if (classifyValue === '1') {
        url = '/ctc/task/todo/pageDoneList'
      } else if (classifyValue === '2') {
        url = '/ctc/task/todo/pageDoneList'
      } else if (classifyValue === '3') {
        url = '/ctc/project/question/page'
        params.questionStatus = 1
        // 轨迹类型(1:和登录人相关;2:展示最近一条)
        params.trackType = 2
        params.creatorName = this.$store.state.user.realName
      } else if (classifyValue === '4') {
        url = '/ctc/project/projectApply/page'
        // 已办
        params.type = 2
      }
      params.orderType = orderType
      this.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataListLoading = false
          if (orderType <= 8) {
            let list = res.data.data.list
            for (let i = 0; i < list.length; i++) {
              if (!list[i].parentProject) {
                list[i].parentProject = list[i].project
                list[i].project = ''
              }
            }
            this.tableTitleData = this.titleDataList
            this.dataList = list
            this.total = res.data.data.total
          } else if (orderType === 9) {
            this.tableTitleData = this.questionTitleList
            this.total = res.data.total
            this.dataList = res.data.list
          } else if (orderType === 10) {
            this.tableTitleData = this.projectApplyTitleList
            this.total = res.data.total
            this.dataList = res.data.list
          }
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'orderType') {
        columnValue = this.$getDictLabel('workOrder.type', row[item.code])
      } else if (item.code === 'handlerType') {
        columnValue = this.$getDictLabel('workOrder.handlerType', row[item.code])
      } else if (item.code === 'dealStatus') {
        columnValue = this.$getDictLabel('dealStatus', row[item.code])
      } else if (item.code === 'orderId' && row.orderType === 8) {
        columnValue = row.defectCode
      } else if (item.code === 'projectApply.dealStatus') {
        columnValue = this.$getDictLabel('projectApply.dealStatus', row['dealStatus'])
      } else if (['questionStatus', 'type', 'level', 'flow'].includes(item.code)) {
        columnValue = this.$getDictLabel('question.' + item.code, row[item.code])
      } else if (['handlerName', 'operationDesc', 'nextHandlerName'].includes(item.code)) {
        columnValue = this.doHandTableColumnData(item.code, row)
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    doHandTableColumnData (type, row) {
      let columnValue = ''
      if (type === 'handlerName') {
        columnValue = row.handlerNameList ? row.handlerNameList.join('<br/>') : row.handlerName
      } else if (type === 'nextHandlerName') {
        columnValue = row.nextHandlerNameList ? row.nextHandlerNameList.join('<br/>') : row.nextHandlerName
      } else if (type === 'operationDesc') {
        columnValue = row.operationDescList ? row.operationDescList.join('<br/>') : row.operationDesc
      }
      return columnValue
    },
    doTableOperate (type, row) {
      let path = ''
      let title = ''
      let params = { 'projectId': row.projectId || '', 'projectName': row.name }
      if (row.orderType) {
      } else {
        let orderClassify = this.orderClassify || ['1', '']
        row.orderType = orderClassify[1] ? Number(orderClassify[1]) : ''
      }
      // 转单
      if (type === 0) { // 去处理
        path = 'workbench/mytodo/toDealWith/requirementAnalysis'
        title = '我的工单'
        params.type = 'processed' // processed--去处理  子路由判断进来的是什么类型
        params.rows = row
        // 特殊处理缺陷中心待办
        if (row.orderType === 8) {
          path = 'defectcenter/defect-mgr/defect-data-detail'
          params.defectId = row.orderId
        } else if (row.orderType === 9) {
          path = 'documentsAndQuestions/questionsMgr/question-view.vue'
          params.questionId = row.questionId
        } else if (row.orderType === 10) {
          path = 'projects/whole-network-project/children/member-apply-view.vue'
          params.rowData = row
          params.orderId = row.orderId || ''
        }
      } else if (type === 1) { // 转单
        // 特殊处理，兼容缺陷中心转单
        let projectId = row.projectId || row.parentProjectId
        let orderDealId = row.orderDealId || row.defectId
        let orderType = row.orderType || 8
        let handlerType = row.handlerType || 8
        this.transferOrder(projectId, [orderDealId], orderType, handlerType)
      } else if (type === 2) { // 提交

      }
      this.customAddDynamicRoute(path, title, params)
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
  },
  components: {

  }
}
</script>
<style lang="scss">
.project-mgr-page {
}
</style>
