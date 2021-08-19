<template>
  <el-row class="recycle-bin-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill project-task-mgr">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="用例名称" prop="caseName">
                <el-input v-model="dataForm.caseName" placeholder="请输入用例名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属项目" prop="parentProjectId">
                <ctc-project-info-table v-model="dataForm.parentProjectId" :projectId="dataForm.parentProjectId" placeholder="请选择项目"></ctc-project-info-table>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="子项目" prop="projectId">
                <ctc-child-project-info-table v-model="dataForm.projectId" placeholder="请选择子项目" :projectId.sync="dataForm.projectId" :parentId.sync="dataForm.parentProjectId"></ctc-child-project-info-table>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button type="primary" size="small" @click="getProjectCase()">查询</el-button>
              <el-button size="small" @click="resetProjectCase()">重置</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="6">
              <el-form-item label="评审状态" prop="reviewStatus">
                <ctc-select v-model="dataForm.reviewStatus" dict-type="reviewStatus" placeholder="请选择评审状态"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="createDate" label="创建日期">
                <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill  project-mgr-page">
        <el-table stripe highlight-current-row :data="caseTableData" ref="caseTableData" border height="680" style="width:100%;;overflow-y:auto;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="caseName" label="用例名称" header-align="left" align="left" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="doViewCase(scope.row)">{{scope.row.caseName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="testType" label="测试类型" header-align="center" align="center">
            <template slot-scope="scope">
              {{ $getDictLabel('testType', scope.row.testType) }}
            </template>
          </el-table-column>
          <el-table-column prop="caseType" label="引用次数" header-align="center" align="center"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updateDate" label="修改时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="reviewStatus" label="评审状态" header-align="center" align="center">
            <template slot-scope="scope">
              {{ $getDictLabel('reviewStatus', scope.row.reviewStatus) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="doOperation(1,scope.row)">案例轨迹</el-button>
              <el-button type="text" size="small" @click="doOperation(2,scope.row)">还原</el-button>
              <el-button type="text" size="small" @click="doOperation(3,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="dataForm.page" :page-sizes="[10, 20, 50]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
        </el-pagination>
      </el-card>
    </el-col>
    <!--引入案例轨迹页面-->
    <case-trajectory ref="caseTrajectory" :visible.sync="caseTrajectory"></case-trajectory>
    <!--引入新增修改用例页面-->
    <add-or-update-case ref="addOrUpdateCase" :visible.sync="addOrUpdateCase" @watchChildPage="triggerParentMethod"></add-or-update-case>
  </el-row>
</template>
<script>
import CaseTrajectory from '@/components/common/case/case-trajectory'
import AddOrUpdateCase from '@/components/common/case/add-or-update-case'
export default {
  name: 'RecycleBinMgr',
  components: {
    CaseTrajectory, AddOrUpdateCase
  },
  data () {
    return {
      dataForm: {
        caseName: '',
        caseType: '',
        testType: '',
        reviewStatus: '',
        createDate: '',
        updateDate: '',
        parentProjectId: '',
        projectId: '',
        page: 1,
        limit: 10
      },
      isOpen: false,
      total: 0,
      caseTableData: [],
      caseTrajectory: false, // 案例轨迹状态
      addOrUpdateCase: false
    }
  },
  computed: {},
  mounted () {
    this.getProjectCase()
  },
  methods: {
    triggerParentPage (message) {
      if (Object.keys(message.data).length === 0) {
        this.treeParams = {}
      } else {
        this.treeParams = message.data
      }
      this.getProjectCase()
    },
    resetProjectCase () {
      this.$refs.dataForm.resetFields()
      this.getProjectCase()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getProjectCase()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getProjectCase()
    },
    getProjectCase () {
      let params = { ...this.dataForm }
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createDateStart = params.createDate[0]
        params.createDateEnd = params.createDate[1]
        delete params['createDate']
      }
      this.$http.get('ctc/case/recycle/page', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.caseTableData = res.data.list
          this.total = res.data.total
        }
      }).catch(() => {
      })
    },
    doViewCase (row) {
      // 查看用例
      this.$refs.addOrUpdateCase.dataForm.pathPageName = '回收站'
      this.$refs.addOrUpdateCase.dataForm.caseId = row.caseId
      this.$refs.addOrUpdateCase.dataForm.taskId = row.taskId
      this.$refs.addOrUpdateCase.dataForm.readOnly = 1 // 0:编辑模式;1:只读模式
      this.$refs.addOrUpdateCase.init()
    },
    doCaseDelete (row) {
      this.$toggleRowSelectionTable('caseTableData', row)
      this.$confirm('确定删除[用例]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/case/caseInfo/deleteForever', { 'data': [row.caseId] }).then(({ data: res }) => {
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
    // 用例还原
    doCaseRestore (row) {
      this.$confirm('确定还原[用例]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = { 'ids': [row.caseId] }
        this.$http.put('/ctc/case/caseInfo/restore', params).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message.success('用例还原成功')
          this.getProjectCase()
        }).catch(() => { })
      }).catch(() => {
      })
    },
    doOperation (type, row) {
      if (type === 1) {
        // 案例轨迹
        this.$refs.caseTrajectory.init()
        this.$refs.caseTrajectory.caseId = row.caseId
      } else if (type === 2) {
        // 还原用例,判断模块是否存在
        this.doCaseRestore(row)
      } else if (type === 3) {
        this.doCaseDelete(row)
      }
    }
  }
}
</script>
<style lang="scss">
.recycle-bin-page {
  .el-form-item__content .el-date-editor {
    width: 240px;
  }
}
</style>
