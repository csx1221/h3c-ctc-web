<template>
  <el-dialog title="是否省份自测" :visible.sync="innerVisible" :close-on-click-modal="false" width="30%" class="province-test">
    <el-row>
      <el-col :span="24" style="text-align:center;">
        <el-radio-group v-model="ifProvinceTest" size="small">
          <el-radio label="1" border>是</el-radio>
          <el-radio label="0" border>否</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ProvinceTest',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ifProvinceTest: '1',
      message: {},
      executeParams: {}
    }
  },
  watch: {
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
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.ifProvinceTest = '1'
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.handleDialogClose()
      this.executeParams.ifProvinceTest = this.ifProvinceTest
      this.$emit('watchChildPage', { 'type': 'startExecute', 'message': this.message, 'data': this.executeParams })
    }
  }
}
</script>
<style lang="scss" scoped>
.province-test {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
</style>
