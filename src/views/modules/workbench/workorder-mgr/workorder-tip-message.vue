<template>
  <el-dialog title="工单操作提示" :visible.sync="innerVisible" :close-on-click-modal="false" width="50%" class="add-stage">
    <el-row>
      <el-col :span="24">
        <el-table ref="orderSubmitData" :data="orderSubmitData" @select="handleSelectChange" @select-all="handleSelectAllChange" height="500" style="width:100%;">
          <el-table-column type="selection" :selectable="selectable" header-align="center" align="center" width="60"></el-table-column>
          <el-table-column prop="hitMsg" label="操作提示" header-align="left" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="getHitMsgHtml(scope.row.hitMsg)"></span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div :span="24" class="selected">
      <el-button size="small" @click="handleDialogClose">关闭</el-button>
      <el-button type="primary" size="small" @click="handleConfirm" v-if="selectOrderSubData.length>0">继续提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'WorkorderTipMessage',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectOrderSubData: [],
      orderSubmitData: []
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
        this.orderSubmitData.forEach((item, index) => {
          if (item.hitType === 2) {
            this.$toggleRowSelectionTable('orderSubmitData', item)
            this.selectOrderSubData.push(item)
          }
        })
      })
    },
    getHitMsgHtml (hitMsg) {
      let hitMsgData = (hitMsg || '').split('<br/>')
      return hitMsgData.join('<br/>')
    },
    // 判断左侧用户是否禁用
    selectable (row, index) {
      let bool = (row.hitType === 2)
      return bool
    },
    handleSelectAllChange (selection) {
      this.selectOrderSubData = this.$refs.orderSubmitData.selection
    },
    handleSelectChange (selection, item) {
      this.selectOrderSubData = this.$refs.orderSubmitData.selection
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let orderSubmitData = this.selectOrderSubData
      this.$http.post('/ctc/task/orderHandle/orderSubmitListConfirm', orderSubmitData).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message.success('提交成功')
        this.handleDialogClose()
        this.$emit('refreshDataList')
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.add-stage {
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
