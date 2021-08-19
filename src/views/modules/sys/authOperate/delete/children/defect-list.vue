<template>
  <el-row class="defect-list">
    <el-col :span="24">
      <el-table stripe highlight-current-row border :data="tableListData" ref="tableListData" height="570" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="defectCode" label="缺陷编号" header-align="left" align="left" width="160" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="name" label="缺陷名称" header-align="left" align="left" width="200" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="defectStatus" label="缺陷状态" header-align="center" align="center" width="160">
          <template slot-scope="scope">
            {{ $getDictLabel('defectStatus', scope.row.defectStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="提出人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="handlerName" label="当前处理人" header-align="center" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="defectLevel" label="缺陷级别" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel('defectLevel', scope.row.defectLevel) }}
          </template>
        </el-table-column>
        <el-table-column prop="defectEnv" label="缺陷环境" header-align="center" align="center" width="160">
          <template slot-scope="scope">
            {{ $getDictLabel('defectEnv', scope.row.defectEnv) }}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="doSingleDeleteData(scope.row)">删除</el-button>
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
  name: 'DefectList',
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
      operateType: 5,
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
      let defectIds = []
      let selectionData = this.$refs.tableListData.selection
      if (selectionData.length > 0) {
        selectionData.forEach((item, index) => {
          defectIds.push(item.defectId)
        })
        this.executeBatchDeleteOperate(defectIds)
      } else {
        this.$message.warning('没有选中【缺陷】任何操作记录')
      }
    },
    doSingleDeleteData (row) {
      let defectIds = [row.defectId]
      this.executeBatchDeleteOperate(defectIds)
    },
    executeBatchDeleteOperate (defectIds) {
      this.$confirm('确定删除【缺陷】操作，删除不可恢复，请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'confirm-del-tip',
        type: 'warning'
      }).then(() => {
        let params = { 'operateType': this.operateType, 'defectIds': defectIds }
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
      data.operateType = 6
      data.defectId = row.defectId
      this.$emit('watchChildMethod', { 'type': 'gotoNextList', 'data': data })
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
.defect-list {
}
.confirm-del-tip .el-message-box__message {
  color: red;
}
</style>
