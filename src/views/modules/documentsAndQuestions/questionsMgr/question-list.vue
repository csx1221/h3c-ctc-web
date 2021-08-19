<template>
  <div class="question-list">
    <el-row>
      <el-col :span="24">
        <el-card shadow="never" class="aui-card--fill">
          <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="title" label="问题/任务标题">
                  <el-input v-model="dataForm.title" placeholder="请输入问题/任务标题"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="handlerName" label="下一步处理人">
                  <el-input v-model="dataForm.handlerName" placeholder="请输入下一步处理人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="text-align:right;">
                <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
                <el-button type="primary" size="small" @click="getProjectQuestion()">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
              </el-col>
            </el-row>
            <el-row v-if="isOpen">
              <el-col :span="8">
                <el-form-item prop="questionCode" label="问题/任务编码">
                  <el-input v-model="dataForm.questionCode" placeholder="请输入问题/任务编码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="questionStatus" label="问题/任务状态">
                  <ctc-select v-model="dataForm.questionStatus" dict-type="question.questionStatus" placeholder="请选择评审状态"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="level" label="问题/任务级别">
                  <ctc-select v-model="dataForm.level" dict-type="question.level" placeholder="请选择问题/任务级别"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="type" label="问题/任务类型">
                  <ctc-select v-model="dataForm.type" dict-type="question.type" placeholder="请选择问题/任务类型"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="flow" label="问题/任务流程">
                  <ctc-select v-model="dataForm.flow" dict-type="question.flow" placeholder="请选择问题/任务流程"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="creatorName" label="创建人名">
                  <el-input v-model="dataForm.creatorName" placeholder="请输入创建人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="createDate" label="创建时间">
                  <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top:24px;">
        <el-card shadow="never" class="aui-card--fill">
          <el-row>
            <el-col :span="24" class="split-line" style="text-align:left;">
              问题/任务列表
              <span style="color:#4190f7;padding-right:10px;" v-if="(projectData.taskId || '')==''">说明：要选到左侧具体项目节点，才支持问题/任务创建</span>
              <el-switch v-model="showField" @change="showFieldChange" active-text="全部字段" inactive-text="隐藏字段" style="padding-left:15px;"></el-switch>
            </el-col>
            <el-col :span="24" style="text-align:right;margin-bottom:5px;">
              <el-button type="blue" size="small" @click="doAddOrUpdateHandle('')" v-if="(projectData.projectId || '')!=''">新增</el-button>
              <el-button type="success" size="small" @click="doDataStatistics()" v-if="(projectData.projectId || '')!=''">数据统计</el-button>
              <el-button type="warning" size="small" @click="doExportData()">导出</el-button>
            </el-col>
          </el-row>
          <el-table stripe highlight-current-row :data="questionTableData" ref="questionTableData" border max-height="800px" style="width:100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <template v-for="(item, index) in questionTableTitleData">
              <el-table-column :key="index" :label="item.name" :width="item.width" v-if="item.isShow" header-align="left" align="left" show-overflow-tooltip>
                <template slot-scope="scope">
                  <template v-if="item.code=='questionCode'">
                    <el-button type="text" size="small" @click="doSearchQuestionDetail(scope.row)">{{scope.row.questionCode}}</el-button>
                    <el-button type="text" icon="el-icon-copy-document" @click="$copyContent(scope.row.questionCode)"></el-button>
                  </template>
                  <template v-else>
                    <div v-html="getTableColumnData(scope.row,item)"></div>
                  </template>
                </template>
              </el-table-column>
            </template>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="doAddOrUpdateHandle(scope.row.questionId)" :disabled="doValidBtnAuth(scope.row)">修改</el-button>
                <el-button type="text" size="small" @click="doSingleDeleteData(scope.row)" :disabled="doValidBtnAuth(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :current-page="dataForm.page" :page-sizes="[10, 100, 500,1000]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
          <!-- 弹窗, 新增 / 修改 -->
          <add-or-update :visible.sync="addOrUpdate" ref="addOrUpdate" @watchChildPage="triggerParentMethod"></add-or-update>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { addDynamicRoute } from '@/router'
import AddOrUpdate from './children/question-add-or-update'
import ctcUtils from '@/utils/ctc-utils.js'
export default {
  name: 'QuestionList',
  components: {
    AddOrUpdate
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      dataForm: {
        title: '',
        questionCode: '',
        level: '',
        type: '',
        flow: '',
        questionStatus: '',
        createDate: '',
        creatorName: '',
        handlerName: '',
        trackType: 2,
        limit: 10,
        page: 1
      },
      orderId: '',
      total: 0,
      questionTableData: [],
      questionTableTitleData: [
        { 'code': 'questionCode', 'name': '问题/任务编码', 'width': 200, 'isShow': true }, { 'code': 'title', 'name': '问题/任务标题', 'width': 250, 'isShow': true },
        { 'code': 'questionStatus', 'name': '问题/任务状态', 'width': 120, 'isShow': true }, { 'code': 'handlerName', 'name': '处理人', 'width': 200, 'isShow': true },
        { 'code': 'operationDesc', 'name': '处理意见', 'width': 250, 'isShow': true }, { 'code': 'nextHandlerName', 'name': '下一步处理人', 'width': 200, 'isShow': true },
        { 'code': 'type', 'name': '问题/任务类型', 'width': 120, 'isShow': true }, { 'code': 'level', 'name': '问题/任务级别', 'width': 120, 'isShow': true },
        { 'code': 'flow', 'name': '问题/任务流程', 'width': 120, 'isShow': false }, { 'code': 'creatorName', 'name': '创建人', 'width': 150, 'isShow': true },
        { 'code': 'createDate', 'name': '创建时间', 'width': 180, 'isShow': true }, { 'code': 'updateDate', 'name': '修改时间', 'width': 180, 'isShow': true }
      ],
      showField: false,
      isOpen: false,
      addOrUpdate: false
    }
  },
  watch: {
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getProjectQuestion()
      }
    }
  },
  computed: {
  },
  mounted () {
    let thisvm = this
    thisvm.getProjectQuestion()
    window.addEventListener('handReLoadEvent', function (event) {
      if (event.key === 'questionReload') {
        thisvm.getProjectQuestion()
      }
    })
  },
  activated () {
  },
  methods: {
    triggerParentMethod (message) {
      if (message.type === 'reloadTable') {
        this.getProjectQuestion()
      }
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getProjectQuestion()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getProjectQuestion()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getProjectQuestion()
    },
    getProjectQuestion () {
      this.$ctcLoading.open()
      let params = { ...this.dataForm, ...this.projectData }
      // 特殊处理创建日期修改日期
      if (params.createDate.length > 0) {
        params.createDateStart = params.createDate[0]
        params.createDateEnd = params.createDate[1]
        delete params['createDate']
      }
      this.$http.get('/ctc/project/question/page', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.questionTableData = res.data.list
          this.total = res.data.total
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    showFieldChange (value) {
      let thisvm = this
      let caseFields = ['flow']
      thisvm.questionTableTitleData.forEach((item, index) => {
        if (caseFields.includes(item.code)) {
          item.isShow = value
          thisvm.$set(thisvm.questionTableTitleData, index, item)
        }
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (['questionStatus', 'type', 'level', 'flow'].includes(item.code)) {
        columnValue = this.$getDictLabel('question.' + item.code, row[item.code])
      } else if (['handlerName', 'nextHandlerName', 'operationDesc'].includes(item.code)) {
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
    doValidBtnAuth (row) {
      let authFlag = true
      let opAuth = [row.creator]
      // 特殊判断,是否是超级管理员
      if (this.$store.state.user.superAdmin === 1) {
        opAuth.push(this.$store.state.user.id)
      }
      // 判断当前登录账号
      if (opAuth.includes(this.$store.state.user.id)) {
        authFlag = false
      }
      // 判断状态[待处理、已关闭可以删除]
      if ([1, 3].includes(row.questionStatus)) {
        authFlag = true
      }
      // 版本1不允许修改
      if (row.version === 1) {
        authFlag = true
      }
      return authFlag
    },
    doDataStatistics () {
      let path = 'documentsAndQuestions/questionsMgr/question-data-statistics.vue'
      let title = '数据统计'
      let params = {}
      params.projectId = this.projectData.projectId
      this.customAddDynamicRoute(path, title, params)
    },
    doSearchQuestionDetail (row) {
      let path = 'documentsAndQuestions/questionsMgr/question-view.vue'
      if (row.version === 2) {
        path = 'documentsAndQuestions/questionsMgr/question-view-v2.vue'
      }
      let title = '查看问题/任务详情'
      let params = {}
      params.questionId = row.questionId
      this.customAddDynamicRoute(path, title, params)
    },
    doAddOrUpdateHandle (questionId) {
      this.$refs.addOrUpdate.dataForm.parentProjectId = this.projectData.parentProjectId
      this.$refs.addOrUpdate.dataForm.projectId = this.projectData.projectId
      this.$refs.addOrUpdate.dataForm.questionId = questionId || ''
      this.$refs.addOrUpdate.init()
    },
    doSingleDeleteData (row) {
      let questionIds = [row.questionId]
      this.executeBatchDeleteOperate(questionIds)
    },
    executeBatchDeleteOperate (questionIds) {
      this.$confirm('确定删除【问题/任务】操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/project/question', { 'data': questionIds }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            this.getProjectQuestion()
          }
        }).catch(() => { })
      }).catch(() => { })
    },
    doExportData () {
      let data = { ...this.dataForm, ...this.projectData }
      // 特殊处理创建日期、修改日期
      if (data.createDate.length > 0) {
        data.createDateStart = data.createDate[0]
        data.createDateEnd = data.createDate[1]
        delete data['createDate']
      }
      data.fileName = '【问题任务导出】列表'
      let selectionData = this.$refs.questionTableData.selection
      if (selectionData.length > 0) {
        let questionIds = []
        selectionData.forEach((item, index) => {
          questionIds.push(item.questionId)
        })
        data.questionIds = questionIds
      }
      let url = '/ctc/project/question/exportQuestionData'
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
</style>
