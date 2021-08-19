<template>
  <el-row class="workorder-list">
    <el-col :span="24">
      <el-table stripe highlight-current-row border :data="tableListData" ref="tableListData" height="570" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="orderId" label="工单编号" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderTitle" label="工单标题" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderType" label="工单类型" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel('workOrder.type', scope.row.orderType) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="工单状态" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('dealStatus', scope.row.orderStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="处理时间" label="updateDate" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="doSingleDeleteData(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="doDeleteSubWorkOrder(scope.row)">删除二级工单</el-button>
            <el-button type="text" size="small" @click="doGotoNextList(scope.row)" v-if="[5,7].includes(scope.row.orderType)">删除用例</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :page-sizes="[10,100,500,1000]" layout="total, sizes,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @size-change="pageSizeChangeHandle" @current-change="currentPageChangeHandle">
      </el-pagination>
      <sub-workorder-list :visible.sync="subWorkorderList" ref="subWorkorderList"></sub-workorder-list>
    </el-col>
  </el-row>
</template>
<script>
import SubWorkorderList from './sub-workorder-list'
export default {
  name: 'WorkorderList',
  components: {
    SubWorkorderList
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
      operateType: 3,
      tableListData: [],
      subWorkorderList: false
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
      let orderIds = []
      let selectionData = this.$refs.tableListData.selection
      if (selectionData.length > 0) {
        selectionData.forEach((item, index) => {
          orderIds.push(item.orderId)
        })
        this.executeBatchDeleteOperate(orderIds)
      } else {
        this.$message.warning('没有选中【工单】任何操作记录')
      }
    },
    doDeleteSubWorkOrder (row) {
      this.$refs.subWorkorderList.orderId = row.orderId
      this.$refs.subWorkorderList.init()
    },
    doSingleDeleteData (row) {
      let orderIds = [row.orderId]
      this.executeBatchDeleteOperate(orderIds)
    },
    executeBatchDeleteOperate (orderIds) {
      this.$confirm('确定删除【工单】操作，删除不可恢复，请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'confirm-del-tip',
        type: 'warning'
      }).then(() => {
        let params = { 'operateType': this.operateType, 'orderIds': orderIds }
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
      data.operateType = 4
      data.orderId = row.orderId
      data.orderType = row.orderType
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
.workorder-list {
}
.confirm-del-tip .el-message-box__message {
  color: red;
}
</style>
