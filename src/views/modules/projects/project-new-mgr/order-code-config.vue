<template>
  <el-dialog title="工单配置" :visible.sync="innerVisible" :close-on-click-modal="false" width="50%" class="import-test-phone">
    <el-row>
      <el-col :span="24">
        <el-form :inline="false" label-position="right" label-width="80px" ref="dataForm" :model="dataForm">
          <el-row>
            <el-col :span="16">
              <el-form-item prop="orderName" label="工单名称">
                <el-input v-model="dataForm.orderName" placeholder="请输入工单名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align:right;">
              <el-button size="small" type="primary" @click="getDataInfo">查询</el-button>
              <el-button size="small" @click="doResetDataInfo">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="24" class="split-line" style="text-align:left;">
            工单列表
          </el-col>
        </el-row>
        <el-table ref="leftTableObject" :data="leftTableData" border height="292px">
          <el-table-column type="selection" width="55">
            <template slot-scope="scope">
              <el-radio :label="scope.row.orderCode" v-model="dataForm.orderCode">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="工单编码" prop="orderCode" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="工单名称" prop="orderName" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="联系人" prop="contactName" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination background layout="total, prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @current-change="getDataInfo" style="text-align:left;">
        </el-pagination>
      </el-col>
    </el-row>
    <div :span="24" class="selected">
      <el-button size="small" @click="handleDialogClose">关闭</el-button>
      <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'OrderCodeConfig',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        orderCode: '',
        orderName: '',
        orderStatus: 1,
        page: 1,
        limit: 5
      },
      total: 0,
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
        this.doResetDataInfo()
      })
    },
    doResetDataInfo () {
      this.$refs.dataForm.resetFields()
      this.getDataInfo()
    },
    // 获取左边未选用户数据
    getDataInfo () {
      let params = Object.assign({}, this.dataForm)
      this.$http.get('/ctc/plan/commodityOrderInfo/page', {
        params: params
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.total = res.data.total
          this.leftTableData = res.data.list
        }
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      if (this.dataForm.orderCode) {
        this.$emit('watchChildMethod', { type: 'orderCodeConfig', data: this.dataForm.orderCode })
        this.handleDialogClose()
      } else {
        this.$message.warning('没有选择任何操作记录！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.import-test-phone {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
