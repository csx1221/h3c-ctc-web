<template>
  <el-dialog title="二级工单" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%">
    <el-row>
      <el-col :span="24">
        <el-table stripe highlight-current-row border :data="tableListData" ref="tableListData" height="570" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="orderId" label="工单编号" header-align="left" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="dealStatus" label="工单状态" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ $getDictLabel('dealStatus', scope.row.dealStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="处理人" header-align="center" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column header-align="center" align="center" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="doSingleDeleteData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'SubWorkorderList',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      orderId: '',
      tableListData: []
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    dataRule () {
      return {
      }
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.getSubWorkorderData()
      })
    },
    getSubWorkorderData () {
      let params = { 'page': 1, 'limit': 9999 }
      params.orderId = this.orderId
      params.operateType = 6
      this.$http.get('/ctc/visualization/dataCleaning/queryDataList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.tableListData = res.data.list
        }
      }).catch(() => {
      })
    },
    doSingleDeleteData (row) {
      let orderDealIds = [row.orderDealId]
      this.executeBatchDeleteOperate(orderDealIds)
    },
    executeBatchDeleteOperate (orderDealIds) {
      this.$confirm('确定删除【二级工单】操作，删除不可恢复，请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'confirm-del-tip',
        type: 'warning'
      }).then(() => {
        let params = { 'operateType': 6, 'orderDealIds': orderDealIds }
        this.$http.delete('/ctc/visualization/dataCleaning/deleteDataList', { data: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            this.getSubWorkorderData()
          }
        }).catch(() => { })
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.confirm-del-tip .el-message-box__message {
  color: red;
}
</style>
