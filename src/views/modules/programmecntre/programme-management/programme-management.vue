<template>
  <el-row class="project-mgr-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm" label-width="100px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="方案设计编号" prop="analyzeCode">
                <el-input v-model="dataForm.analyzeCode" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="方案设计人" prop="userId">
                <ctc-demand-analysis v-model="dataForm.userId" placeholder="请选择分析人"></ctc-demand-analysis>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="所属项目" prop="parentProjectId">
                <ctc-project-info-table v-model="dataForm.parentProjectId" :projectId="dataForm.parentProjectId" placeholder="请选择项目"></ctc-project-info-table>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="子项目" prop="projectId">
                <ctc-child-project-info-table v-model="dataForm.projectId" placeholder="请选择子项目" :projectId.sync="dataForm.projectId" :parentId.sync="dataForm.parentProjectId"></ctc-child-project-info-table>
              </el-form-item>
            </el-col>
            <el-col :span="4" align="right">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
              <el-button type="primary" size="small" @click="getProjectInfo(1)">查询</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="5">
              <el-form-item label="状态" prop="reviewStatus">
                <ctc-select v-model="dataForm.reviewStatus" dict-type="demandStatus" placeholder="请选择"></ctc-select>
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
            列表展示
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" size="small" @click="createConfig">新 建</el-button>
          </el-col>
        </el-row>

        <el-table stripe v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
          <!--            <el-table-column type="selection" width="50" align="center"></el-table-column>-->
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <template v-for="(item, index) in titleDataList">
            <el-table-column v-if="item.code==='planDesignCode'" :key="index" :label="item.name" align="center">
              <template slot-scope="scope">
                <el-button @click="viewDetails(scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item)}}</el-button>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.code==='attachementId'" :key="index" :label="item.name" align="center">
              <template slot-scope="scope">
                <ctc-download-table :id="scope.row.attachementId"></ctc-download-table>
              </template>
            </el-table-column>
            <el-table-column v-else :key="index" :label="item.name" align="center">
              <template slot-scope="scope">
                <span v-html="getTableColumnData(scope.row,item)"></span>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button @click="doTableOperate(2,scope.row)" type="text" size="small">案例轨迹</el-button>
              <el-button v-if="scope.row.upFlag===1" @click="doTableOperate(0,scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="scope.row.deleteFlag===1" @click="doTableOperate(1,scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
        <add-or-updata-or-look v-if="addOrUpdataOrLookVisible" ref="addOrUpdataOrLook" @refresh="getProjectInfo(1)" @init="addOrUpdataOrLookVisible = false"></add-or-updata-or-look>
        <!--引入案例轨迹页面-->
        <case-trajectory ref="caseTrajectory" :visible.sync="caseTrajectory"></case-trajectory>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import addOrUpdataOrLook from '@/components/programmecntre/add-or-updata-or-look'
import ctcDemandAnalysis from '@/components/programmecntre/ctc-demand-analysis'
import CaseTrajectory from '@/components/programmecntre/locus'
export default {
  mixins: [mixinViewModule],
  name: 'programme-management',
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      addOrUpdataOrLookVisible: false,
      caseTrajectory: false,
      dataForm: {
        analyzeCode: '', // 需求分析编号
        userId: [],
        parentProjectId: '', // 父项目
        projectId: '', // 子项目
        reviewStatus: ''
      },
      titleDataList: [],
      dataList: []
    }
  },
  computed: {},
  mounted () {
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
      this.getProjectInfo(1)
    },
    getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.dataListLoading = true
      this.dataList = []
      const { userId, ...newData } = this.dataForm
      let params = { page: this.page, limit: this.limit, userId: this.dataForm.userId.join(','), ...newData }
      this.$http.get('/ctc/plan/planDesign/list', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.titleDataList = res.data.head
          this.dataList = res.data.data.list
          this.total = res.data.data.total
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'reviewStatus') {
        columnValue = this.$getDictLabel('demandStatus', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    viewDetails (row) {
      this.addOrUpdataOrLookVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdataOrLook.init('programmeManagement', 'look', row)
      })
    },
    doTableOperate (type, row) {
      if (type === 0) { // 编辑
        this.addOrUpdataOrLookVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdataOrLook.init('programmeManagement', 'update', row)
        })
      } else if (type === 1) { // 删除
        this.dels(row.planDesignId)
      } else if (type === 2) {
        this.locus(row.planDesignId)
      }
    },
    createConfig () {
      // let list = this.dataListSelections
      // console.log(list)
      this.addOrUpdataOrLookVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdataOrLook.init('programmeManagement', 'create')
      })
    },
    delConfig () {
      if (this.dataListSelections.length !== 0) {
        let id = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          id.push(this.dataListSelections[i].configId)
        }
        this.dels(id)
      } else {
        this.$message.warning('请选择需要删除项！！！')
      }
    },
    dels (id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$ctcLoading.open()
        this.$http.delete('/ctc/plan/planDesign/' + id, {}).then(({ data: res }) => {
          this.$ctcLoading.close()
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.getProjectInfo(1)
          }
        }).catch(() => {
          this.$ctcLoading.close()
        })
      }).catch(() => {
      })
    },
    locus (id) {
      this.$refs.caseTrajectory.init('/ctc/plan/planDesign/')
      this.$refs.caseTrajectory.caseId = id
    }
  },
  components: {
    addOrUpdataOrLook,
    ctcDemandAnalysis,
    CaseTrajectory
  }
}
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
