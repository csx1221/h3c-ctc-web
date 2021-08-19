<template>
  <el-dialog :title="tagDataMap.title" :visible.sync="innerVisible" :close-on-click-modal="false" width="45%" class="ctc-data-tag">
    <el-row>
      <el-col :span="24">
        <el-tag :key="index" v-for="(item, index) in tagDataMap.tagData">{{item}}</el-tag>
      </el-col>
      <div :span="24" class="selected">
        <el-button @click="handleDialogClose">关闭</el-button>
      </div>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'CtcDataTag',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tagDataMap: {
      type: Object
    }
  },
  data () {
    return {
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
    handleDialogClose () {
      this.innerVisible = false
      this.tagDataMap = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-data-tag {
  .el-tag {
    margin: 15px;
  }
  .selected {
    text-align: right;
  }
}
</style>
