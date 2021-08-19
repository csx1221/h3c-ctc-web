<template>
  <el-row class="task-list">
    <el-col :span="24">
      <el-table stripe highlight-current-row border :data="tableListData" ref="tableListData" height="570" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="taskName" label="任务名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="taskStatus" label="任务状态" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel('taskStatus', scope.row.taskStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="taskType" :label="$t('task.type')" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel('stageType', scope.row.taskType) }}
          </template>
        </el-table-column>
        <el-table-column prop="planStartTime" label="实际日期" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            {{scope.row.actStartTime}}- {{scope.row.actEndTime}}
          </template>
        </el-table-column>
        <el-table-column prop="planStartTime" label="计划日期" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            {{scope.row.planStartTime}}- {{scope.row.planEndTime}}
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="doSingleDeleteData(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="doGotoNextList(scope.row)">删除工单</el-button>
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
  name: 'TaskList',
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
      operateType: 2,
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
      let taskIds = []
      let selectionData = this.$refs.tableListData.selection
      if (selectionData.length > 0) {
        selectionData.forEach((item, index) => {
          taskIds.push(item.taskId)
        })
        this.executeBatchDeleteOperate(taskIds)
      } else {
        this.$message.warning('没有选中【任務】任何操作记录')
      }
    },
    doSingleDeleteData (row) {
      let taskIds = [row.taskId]
      this.executeBatchDeleteOperate(taskIds)
    },
    executeBatchDeleteOperate (taskIds) {
      this.$confirm('确定删除【任务】操作，删除不可恢复，请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'confirm-del-tip',
        type: 'warning'
      }).then(() => {
        let params = { 'operateType': this.operateType, 'taskIds': taskIds }
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
      data.operateType = 3
      data.taskId = row.taskId
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
.task-list {
}
.confirm-del-tip .el-message-box__message {
  color: red;
}
</style>
