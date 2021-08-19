<template>
  <el-dialog title="待办操作选择" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false" width="30%" class="choose-order-mode">
    <el-row>
      <el-col :span="12" class="el-col-type">
        <el-button type="warning" @click="operateTypeChange('1')" style="width:100px;height:100px;" plain>去派单</el-button>
      </el-col>
      <el-col :span="12" class="el-col-type">
        <el-button type="success" @click="operateTypeChange('2')" style="width:100px;height:100px;" plain>去处理</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ChooseOrderMode',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      row: {},
      res: {}
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
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    operateTypeChange (operateType) {
      let data = { 'operateType': operateType, 'row': this.row, 'res': this.res }
      this.$emit('watchChildMethod', { 'type': 'chooseOrderMode', 'data': data })
      this.handleDialogClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-order-mode {
  .el-col-type {
    text-align: center;
  }
}
</style>
