<template>
  <el-dialog title="催单记录" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="reminder-records">
    <el-row class="reminder-records-filter">
      <el-col :span="24">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="20">
              <el-form-item prop="realName" label="用户姓名">
                <el-input v-model="dataForm.realName" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align:right;">
              <el-button size="small" type="primary" @click="getLeftUserInfo">查询</el-button>
              <el-button size="small" @click="doResetLeftUserInfo">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-table ref="leftTableObject" :data="leftTableData" border height="440">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="催办人名" prop="realName" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="催办地址" prop="mailReceiver" width="250" header-align="left" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="催办内容" prop="mailContent" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="催办状态" prop="mailStatus" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.mailStatus == 1" size="small" type="success">催办成功</el-tag>
          <el-tag v-else size="small" type="danger">催办失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="催办日期" prop="mailSendDate" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="催办日志" prop="mailMessage" header-align="center" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  name: 'ReminderRecords',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        realName: ''
      },
      orderId: '',
      orderDealId: '',
      leftTableData: []
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
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.dataForm.page = 1
        this.getLeftUserInfo()
      })
    },
    doResetLeftUserInfo () {
      this.$refs.dataForm.resetFields()
      this.getLeftUserInfo()
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let thisvm = this
      let params = thisvm.dataForm
      params.orderId = this.orderId
      params.orderDealId = this.orderDealId
      thisvm.$http.get('/ctc/task/send/list', {
        params: params
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.leftTableData = res.data
        }
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    }
  }
}
</script>
<style lang="scss">
.reminder-records {
}
</style>
