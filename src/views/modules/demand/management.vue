<template>
  <el-row class="project-new-mgr-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form label-position="right" ref="dataForm" :model="dataForm" label-width="80px" :inline="false" @keyup.enter.native="getSeachTreeData()">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="name" label="需求名称">
                <el-input v-model="dataForm.name" placeholder="请输入需求名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="state" label="状态">
                <ctc-select v-model="dataForm.state" :placeholder="'请选择'" :multiple="true"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" align="right">
              <el-button type="primary" size="small" @click="getSeachTreeData()">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row style="margin-bottom:20px;">
          <el-col :span="12" class="split-line" style="text-align:left;">需求开发列表</el-col>
          <el-col :span="12" style="padding-left:0px;text-align:right;">
            <el-button type="blue" size="small" @click="addAddDefect()">创建需求</el-button>
            <el-button size="small" @click="doExportData()" v-if="jurisdictionList.indexOf(userId)!=-1">导出</el-button>
          </el-col>
        </el-row>
        <el-table stripe highlight-current-row :data="projectTableData" ref="projectTableData" row-key="projectId" border lazy :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%;">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column type="index" width="50" label="序号" align="center" :index="indexMethod"></el-table-column>
          <template v-for="(item, index) in projectTableTitleData">
            <el-table-column align="center" :key="index" :label="item.name" width="auto" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="getTableColumnData(scope.row,item)" v-if="item.code!='name'"></span>
                <a v-else style="color:#5d5fd0;text-decoration: underline" @click="viewRequirements(scope.row)">{{scope.row.name}}</a>
              </template>
            </el-table-column>
          </template>
          <el-table-column fixed="right" label="操作" :width="operateColWidth" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="delete-btn" v-if="adminId==userId" @click="deleteProject(scope.row)">删除</el-button>
              <div v-if="scope.row.stateId==2" class="operation">
                <el-button type="text" size="small" @click="deleteProject(scope.row)" v-if="scope.row.createUser==userId&&userId!=adminId">删除</el-button>
                <el-button type="text" size="small" @click="assessment(scope.row)" v-if="scope.row.nextDealUser==userId">评审</el-button>
                <el-button type="text" size="small" @click="tracking(scope.row)">流程跟踪</el-button>
              </div>
              <div v-if="scope.row.stateId==3" class="operation">
                <el-button type="text" size="small" @click="review(scope.row)" v-if="scope.row.nextDealUser==userId">评估</el-button>
                <el-button type="text" size="small" @click="tracking(scope.row)">流程跟踪</el-button>
              </div>
              <div v-if="scope.row.stateId==4" class="operation">
                <el-button type="text" size="small" @click="review(scope.row)" v-if="scope.row.nextDealUser.indexOf(userId)!=-1">评估</el-button>
                <el-button type="text" size="small" @click="tracking(scope.row)">流程跟踪</el-button>
              </div>
              <div v-if="scope.row.stateId==5" class="operation">
                <el-button type="text" size="small" @click="development(scope.row)" v-if="scope.row.devManager==userId">开发</el-button>
                <el-button type="text" size="small" @click="tracking(scope.row)">流程跟踪</el-button>
              </div>
              <div v-if="scope.row.stateId==6" class="operation">
                <el-button type="text" size="small" @click="doUpdateDefect(scope.row)" v-if="scope.row.createUser == userId">修改</el-button>
                <el-button type="text" size="small" @click="tracking(scope.row)">流程跟踪</el-button>
              </div>
              <div v-if="scope.row.stateId==7||scope.row.stateId==9" class="operation">
                <el-button type="text" size="small" @click="tracking(scope.row)">流程跟踪</el-button>
              </div>
              <div v-if="scope.row.stateId==10" class="operation">
                <el-button type="text" size="small" @click="receive(scope.row)" v-if="chiefInspector==userId">接收</el-button>
                <el-button type="text" size="small" @click="tracking(scope.row)">流程跟踪</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :page-size="limit" :total="total" :current-page.sync="page" @size-change="pageSizeChangeHandle" @current-change="currentPageChangeHandle"></el-pagination>
        <!-- 创建/修改/查看需求开发 -->
        <mangement-add-or-update :visible.sync="addOrUpdateMangement" ref="addOrUpdateMangement" @watchChildPage="getProjectInfo"></mangement-add-or-update>
        <!-- 需求开发评估 -->
        <requirements-needs-review :visible.sync="requirementsNeedsReview" @watchChildPage="getProjectInfo" ref="requirementsNeedsReview"></requirements-needs-review>
        <!-- 需求开发评审 -->
        <requirements-needs-assessment :visible.sync="requirementsNeedsAssessment" @watchChildPage="getProjectInfo" ref="requirementsNeedsAssessment"></requirements-needs-assessment>
        <!-- 需求开发接收 -->
        <requirements-development-reception :visible.sync="requirementsDevelopmentReception" @watchChildPage="getProjectInfo" ref="requirementsDevelopmentReception"></requirements-development-reception>
        <!-- 需求开发 -->
        <demand-development :visible.sync="demandDevelopment" ref="demandDevelopment" @watchChildPage="getProjectInfo"></demand-development>
        <!-- 流程跟踪 -->
        <process-tracking :visible.sync="processTracking" ref="processTracking"></process-tracking>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import Cookies from 'js-cookie'
import ctcUtils from '@/utils/ctc-utils.js'
import demandDevelopment from './mangement-model/demand-development'
import processTracking from './mangement-model/process-tracking'
import mangementAddOrUpdate from './mangement-model/mangement-add-or-update'
import requirementsNeedsReview from './mangement-model/requirements-needs-review'
import requirementsNeedsAssessment from './mangement-model/requirements-needs-assessment'
import requirementsDevelopmentReception from './mangement-model/requirements-development-reception'
export default {
  name: 'ProjectmgrPage',
  components: {
    demandDevelopment,
    processTracking,
    mangementAddOrUpdate,
    requirementsNeedsReview,
    requirementsNeedsAssessment,
    requirementsDevelopmentReception
  },
  data () {
    return {
      dataForm: {
        name: '', // 需求名称
        state: [] // 状态
      },
      page: 1,
      limit: 10,
      adminId: null, // 判断是不是超级管理员
      currPage: 1, // 当前页数 (分页接口返回-用于分页索引)
      pageSize: 10, // 当前条数 (分页接口返回-用于分页索引)
      chiefInspector: null, // 项目总监
      total: null, // 总条数
      jurisdictionList: [], // 存放开发项目总监和开发经理id
      userId: Cookies.get('id'), // 当前用户id
      projectTableTitleData: [
        { code: 'name', name: '需求名称' },
        { code: 'stateId', name: '状态' },
        { code: 'workload', name: '工作量' },
        { code: 'createUserName', name: '需求提出人' },
        { code: 'createTime', name: '提出日期' },
        { code: 'expectedCompletionTime', name: '期望上线' },
        { code: 'planCompletionTime', name: '计划上线' },
        { code: 'ascription', name: '需求来源' },
        { code: 'devManagerName', name: '开发经理' }
      ],
      projectTableData: [],
      operateColWidth: 150,
      demandDevelopment: false, // 需求开发弹窗状态
      processTracking: false, // 流程跟踪弹窗状态
      addOrUpdateMangement: false, // 需求开发弹窗状态
      requirementsNeedsReview: false, // 评估弹窗状态
      requirementsNeedsAssessment: false, // 评审弹窗状态
      requirementsDevelopmentReception: false // 接收弹窗状态
    }
  },
  // 页面初始化查询修列表内容
  activated () {
    this.getProjectInfo()
  },
  methods: {
    indexMethod (index) {
      return (this.currPage - 1) * this.pageSize + index + 1
    },
    // 列表条件查询
    getSeachTreeData () {
      this.getProjectInfo()
    },
    // 创建需求
    addAddDefect () {
      this.$refs.addOrUpdateMangement.state = 'N'
      this.$refs.addOrUpdateMangement.init()
    },
    // 需求开发详情
    viewRequirements (r) {
      let ref = this.$refs.addOrUpdateMangement
      ref.state = 'S'
      ref.dataForm.id = r.id
      ref.init()
    },
    // 评估
    review (r) {
      let ref = this.$refs.requirementsNeedsReview
      ref.dataForm.demandId = r.id
      ref.dataForm.name = r.name
      ref.dataForm.nextDealUser = ''
      if (r.stateId == 3) { //eslint-disable-line
        ref.assessment = true
        ref.dataForm.attachementId =
          r.attachementId
        ref.dataForm.demandDescribe =
          r.demandDescribe
      } else {
        ref.assessment = false
      }
      ref.init(r)
    },
    // 修改需求开发
    doUpdateDefect (r) {
      let ref = this.$refs.addOrUpdateMangement
      ref.state = 'U'
      ref.dataForm.id = r.id
      ref.init('U')
    },
    // 评审
    assessment (r) {
      let ref = this.$refs.requirementsNeedsAssessment.dataForm
      for (let i in ref) {
        if (
          i !== 'remarks' &&
          i !== 'nextDealUser' &&
          i !== 'nextDealUserName' &&
          i !== 'result'
        ) {
          ref[i] = r[i]
          ref.demandId = r.id
          ref.stateId = 3
          ref.createUser = r.createUser
          ref.createUserName = r.createUserName
        }
      }
      this.$refs.requirementsNeedsAssessment.init()
    },
    // 接收
    receive (r) {
      let ref = this.$refs.requirementsDevelopmentReception.dataForm
      for (let i in ref) {
        if (i !== 'remarks' && i !== 'nextDealUser' && i !== 'result') {
          ref[i] = r[i]
          ref.demandId = r.id
          ref.stateId = 5
          ref.createUser = r.createUser
          ref.createUserName = r.createUserName
          ref.completionTime = r.expectedCompletionTime
        }
      }
      let ids = r.nextDealUser.split(',')
      let name = r.nextDealUserName.split(' ')
      let nextDealUser = ids.map((el, i) => ({ label: name[i], value: el }))
      this.$refs.requirementsDevelopmentReception.options = nextDealUser
      this.$refs.requirementsDevelopmentReception.init()
    },
    // 开发
    development (r) {
      let ref = this.$refs.demandDevelopment.dataForm
      ref.demandId = r.id
      ref.name = r.name
      ref.ascription = r.ascription
      ref.demandDescribe = r.demandDescribe
      ref.attachementId = r.attachementId
      this.$refs.demandDevelopment.init()
    },
    // 删除
    deleteProject (r) {
      this.$confirm(`确定删除需求[${r.name}]?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete('/ctc/demand/deleteDemand/' + r.id)
            .then(({ data: res }) => {
              if (res.code !== 0) {
                this.$message.error(res.msg)
              } else {
                this.$message.success('操作成功')
                this.getProjectInfo()
              }
            })
            .catch(() => { })
        })
        .catch(() => { })
    },
    // 流程跟踪
    tracking (r) {
      this.$refs.processTracking.init(r.id)
    },
    // 导出
    doExportData () {
      let selectionData = JSON.parse(
        JSON.stringify(this.$refs.projectTableData.selection)
      )
      if (selectionData.length <= 0) {
        this.$message.warning('请选择要导出的数据!')
        return
      }
      let ids = []
      selectionData.map(item => {
        ids.push(item.id)
      })
      this.customExportPost('/ctc/demand/saveDemandChartExcel', ids)
    },
    // 导出(方式:post)
    customExportPost (url, datas) {
      datas.fileName = '需求开发列表'
      ctcUtils.customExportPost(url, datas)
    },
    // 表格特殊处理单元格
    getTableColumnData (row, item) {
      let columnValue = ''
      columnValue = row[item.code]
      if (item.code === 'stateId') {
        columnValue = this.handlerStateId(row.stateId)
      } else if (
        item.code === 'planCompletionTime' ||
        item.code === 'expectedCompletionTime' ||
        item.code === 'createTime'
      ) {
        columnValue =
          row[item.code] && this.$moment(row[item.code]).format('yyyy-MM-DD')
      }
      return columnValue
    },
    // 处理需求状态
    handlerStateId (id) {
      let a = ''
      switch (Number(id)) {
        case 1:
        case 2:
          a = '待评审'
          break
        case 3:
        case 4:
          a = '待评估'
          break
        case 5:
          a = '开发中'
          break
        case 6:
          a = '挂起'
          break
        case 7:
          a = '已完成'
          break
        case 9:
          a = '终止开发'
          break
        case 10:
          a = '待接收'
          break
        default:
          break
      }
      return a
    },
    currentPageChangeHandle (val) {
      this.page = val
      this.getProjectInfo()
    },
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.getProjectInfo()
    },
    getProjectInfo () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let list = [...thisvm.dataForm.state]
      list.indexOf('4') !== -1 && list.splice(list.indexOf('4'), 1, '10')
      list.map(item => {
        if (item === '3') {
          list.push('4')
        }
      })
      let params = Object.assign({}, { name: thisvm.dataForm.name })
      params.page = this.page
      params.limit = this.limit
      params.userid = Cookies.get('id')
      let pam = {}
      for (let i in params) {
        if (params[i]) {
          pam[i] = params[i]
        }
      }
      pam.state = list
      thisvm.$http.post('/ctc/demand/getDemandAllByNameOrState', pam).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.projectTableData = res.data.list
          thisvm.total = res.data.totalCount
          // currPage,pageSize--解决数据还未切换成功，索引就改变的问题
          thisvm.currPage = res.data.currPage
          thisvm.pageSize = res.data.pageSize
          thisvm.operateColWidth = 150
        }
      })
        .catch(() => { })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getProjectInfo()
    },
    // 查询开发项目总监和开发经理
    getNextDealUser (flag) {
      let arr = []
      let arr1 = []
      this.$http
        .get(
          `/sys/user/getUserInfoByParams?sectionId=${this.$store.state.sectionId}`
        )
        .then(({ data: res }) => {
          if (res.code === 0) {
            res.data.map(item => {
              if (flag) {
                arr.push(item.id)
              }
              if (item.userDuty === '项目总监') {
                arr1.push(item.id)
              }
            })
            this.jurisdictionList = arr
            this.chiefInspector = arr1[0]
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => { })
    },
    queryDevXmzjId () {
      this.$http.get('/ctc/demand/queryDevXmzjId').then(({ data: res }) => {
        if (res.code === 0) {
          this.$http.post('/sys/user/subadmin/users', [res.data]).then(({ data: res }) => {
            if (res.code === 0) {
              let sectionId = res.data[0].sectionId
              let ascription = [res.data[0].organizeName, res.data[0].deptName, res.data[0].sectionName]
              this.$store.state.sectionId = sectionId
              this.$store.state.ascription = ascription
              this.getNextDealUser(sectionId)
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    queryAdminId () {
      this.$http.get('/ctc/demand/queryAdminId').then(({ data: res }) => {
        if (res.code === 0) {
          this.adminId = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      this.$http.get('/ctc/demand/querySectionId').then(({ data: res }) => {
        if (res.code === 0) {
          this.getNextDealUser(res.data, true)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created () {
    this.queryDevXmzjId()
    this.queryAdminId()
  }
}
</script>
<style lang="scss">
.project-new-mgr-page {
  .el-row {
    line-height: 40px;
  }
  .delete-btn {
    margin-right: 10px;
  }
  .operation {
    display: inline-block;
  }
}
</style>
