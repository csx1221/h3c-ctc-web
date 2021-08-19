<template>
  <el-row class="case-list">
    <el-col :span="24">
      <el-table stripe highlight-current-row border :data="tableListData" ref="tableListData" height="570" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="caseCode" label="用例编号" header-align="left" align="left" width="190" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.caseCode?scope.row.caseCode:scope.row.caseId}}
          </template>
        </el-table-column>
        <el-table-column prop="caseName" label="用例名称" header-align="left" align="left" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="caseType" label="用例类型" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('caseType', scope.row.caseType) }}
          </template>
        </el-table-column>
        <el-table-column prop="caseClass" label="用例类别" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('caseClass', scope.row.caseClass) }}
          </template>
        </el-table-column>
        <el-table-column prop="reviewStatus" label="评审状态" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('reviewStatus', scope.row.reviewStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="issueStatus" label="下发状态" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('issueStatus', scope.row.issueStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="execType" label="执行类型" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('execType', scope.row.execType) }}
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="right" align="right" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateDate" label="修改时间" header-align="right" align="right" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="doSingleDeleteData(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="doGotoNextList(scope.row)">删除缺陷</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :page-sizes="[10,100,500,1000]" layout="total, sizes,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @size-change="pageSizeChangeHandle" @current-change="currentPageChangeHandle">
      </el-pagination>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'CaseList',
  components: {
  },
  data () {
    return {
      dataForm: {
        page: 1,
        limit: 10
      },
      refParams: {
      },
      total: 0,
      // operateType(1:项目;2:任务;3:工单;4:用例;5:缺陷)
      operateType: 4,
      tableListData: []
    }
  },
  computed: {},
  created () {
  },
  mounted () {
  },
  activated () {
  },
  methods: {
    getTableData (params, type) {
      // 判断type(goto:切换执行查询;btn:按钮点击查询)
      if (type === 'goto') {
        this.refParams = params
      } else {
        this.refParams = { ...this.refParams, ...params }
      }
      this.getTableListData()
    },
    currentPageChangeHandle (val) {
      this.getTableListData()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getTableListData()
    },
    doBatchDeleteData () {
      let caseIds = []
      let selectionData = this.$refs.tableListData.selection
      if (selectionData.length > 0) {
        selectionData.forEach((item, index) => {
          caseIds.push(item.caseId)
        })
        this.executeBatchDeleteOperate(caseIds)
      } else {
        this.$message.warning('没有选中【用例】任何操作记录')
      }
    },
    doSingleDeleteData (row) {
      let caseIds = [row.caseId]
      this.executeBatchDeleteOperate(caseIds)
    },
    executeBatchDeleteOperate (caseIds) {
      this.$confirm('确定删除【用例】操作，删除不可恢复，请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'confirm-del-tip',
        type: 'warning'
      }).then(() => {
        let params = { 'operateType': this.operateType, 'caseIds': caseIds }
        this.$http.delete('/ctc/visualization/dataCleaning/deleteDataList', { data: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            this.getTableListData()
          }
        }).catch(() => { })
      }).catch(() => { })
    },
    doGotoNextList (row) {
      let data = {}
      // operateType(1:项目;2:任务;3:工单;4:用例;5:缺陷)
      data.operateType = 5
      data.caseId = row.caseId
      this.$emit('watchChildMethod', { 'type': 'gotoNextList', 'data': data })
      this.$refs.tableListData.toggleRowSelection(row, true)
    },
    getTableListData () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { ...thisvm.dataForm, ...thisvm.refParams }
      params.operateType = this.operateType
      thisvm.$http.get('/ctc/visualization/dataCleaning/queryDataList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.tableListData = res.data.list
          thisvm.total = res.data.total
          thisvm.$ctcLoading.close()
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    }
  }
}
</script>
<style  lang="scss">
.case-list {
}
.confirm-del-tip .el-message-box__message {
  color: red;
}
</style>
