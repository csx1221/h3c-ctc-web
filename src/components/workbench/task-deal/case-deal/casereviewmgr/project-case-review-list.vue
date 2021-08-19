<template>
  <div class="project-case-list">
    <el-row>
      <el-col :span="24">
        <el-card shadow="never" class="aui-card--fill">
          <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm">
            <el-row>
              <el-col :span="5">
                <el-form-item prop="caseName" label="用例名称">
                  <el-input v-model="dataForm.caseName" placeholder="请输入用例名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="reviewStatus" label="评审状态">
                  <ctc-select v-model="dataForm.reviewStatus" dict-type="reviewStatus" placeholder="请选择评审状态"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :span="14" style="text-align:right;">
                <el-button type="primary" size="small" @click="getProjectCase()">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
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
            <el-col :span="12" style="text-align:right;" v-if="inType!='processed'">
              <el-button type="blue" size="small" @click="doBatchReview()">批量评审</el-button>
            </el-col>
          </el-row>
          <el-table stripe highlight-current-row :data="caseTableData" ref="caseTableData" border maxHeight="680" style="width:100%;;overflow-y:auto;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="caseCode" label="用例编号" header-align="left" align="left" width="190" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="doSearchCase(scope.row)">{{scope.row.caseCode?scope.row.caseCode:scope.row.caseId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="caseName" label="用例名称" header-align="left" align="left" width="200" show-overflow-tooltip></el-table-column>
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
            <el-table-column prop="reviewStatus" label="评审状态" header-align="center" align="center">
              <template slot-scope="scope">
                {{ $getDictLabel('reviewStatus', scope.row.reviewStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <template v-for="(item, index) in scope.row.operate">
                  <el-button v-if="['23','24'].includes(item) && inType!='processed'" @click="doOperation(item,scope.row)" :key="index" type="text" size="small">{{ $getDictLabel('operateType',item) }}</el-button>
                  <el-button v-else @click="doOperation(item,scope.row)" :key="index" type="text" size="small">{{ $getDictLabel('operateType',item) }}</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :current-page="dataForm.page" :page-sizes="[10, 20, 50]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
        </el-card>
      </el-col>
      <!--引入案例轨迹页面-->
      <review-case-trajectory ref="reviewCaseTrajectory" :visible.sync="reviewCaseTrajectory"></review-case-trajectory>
      <!--引入用例评审-->
      <case-review ref="caseReview" :visible.sync="caseReview" @watchChildPage="triggerParentMethod"></case-review>
      <!--引入新增修改用例页面-->
      <add-or-update-case ref="addOrUpdateCase" :visible.sync="addOrUpdateCase" @watchChildPage="triggerParentMethod"></add-or-update-case>
    </el-row>
  </div>
</template>
<script>
import { addDynamicRoute } from '@/router'
import AddOrUpdateCase from '@/components/common/case/add-or-update-case'
import ReviewCaseTrajectory from '@/components/common/case/review-case-trajectory'
import CaseReview from '@/components/common/case/case-review'
export default {
  name: 'ProjectCaseReviewList',
  components: {
    ReviewCaseTrajectory, CaseReview, AddOrUpdateCase
  },
  props: {
    projectData: Object,
    inType: [Number, String],
    baseInfo: Object
  },
  data () {
    return {
      dataForm: {
        caseName: '',
        reviewStatus: '',
        limit: 10,
        page: 1
      },
      total: 0,
      caseTableData: [],
      reviewCaseTrajectory: false,
      caseReview: false,
      addOrUpdateCase: false
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
      this.$http.get('ctc/case/review/pageCase', { 'params': params }).then(({ data: res }) => {
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
    doOperation (type, row) {
      if (type === '22') {
        // 案例轨迹
        this.$refs.reviewCaseTrajectory.init()
        this.$refs.reviewCaseTrajectory.caseId = row.caseId
        this.$refs.reviewCaseTrajectory.taskId = row.taskId
      } else if (type === '23') {
        // 用例评审
        this.$refs.caseReview.init()
        this.$refs.caseReview.reviewType = 1
        this.$refs.caseReview.dataForm.reviewstatus = row.reviewstatus || '1'
        this.$refs.caseReview.caseIds = [row.caseId]
      } else if (type === '24') {
        // 修改评审
        this.doCaseReviewResult(row)
      }
    },
    doCaseReviewResult (row) {
      this.$toggleRowSelectionTable('caseTableData', row)
      this.$confirm('确定修改[用例评审结果]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/ctc/case/review/updateReviewStatus ', { 'caseId': row.caseId }, { headers: { 'content-type': 'application/x-www-form-urlencoded' } }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('用例评审结果修改成功')
            this.getProjectCase()
          }
        }).catch(() => {
        })
      }).catch(() => { })
    },
    doBatchReview () {
      // 用例评审
      let selectionData = this.$refs.caseTableData.selection
      if (selectionData.length > 0) {
        let caseIds = []
        let caseNames = []
        selectionData.forEach((item, index) => {
          caseIds.push(item.caseId)
          // 判断是否可以批量评审(23:用例评审)
          if (!item.operate.includes('23')) {
            caseNames.push(item.caseName)
          }
        })
        if (caseNames.length > 0) {
          this.$message.warning('用例评审已提交，不允许重复评审')
        } else {
          // 用例评审
          this.$refs.caseReview.init()
          this.$refs.caseReview.reviewType = 2
          this.$refs.caseReview.caseIds = caseIds
        }
      } else {
        this.$message.warning('没有选中任何操作记录！')
      }
    },
    doSearchCase (row) {
      // 查看用例
      this.$refs.addOrUpdateCase.dataForm.pathPageName = '用例评审管理'
      this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
      this.$refs.addOrUpdateCase.dataForm.taskId = row.caseDesignTaskId
      this.$refs.addOrUpdateCase.dataForm.readOnly = 1 // 0:编辑模式;1:只读模式
      this.$refs.addOrUpdateCase.init()
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
