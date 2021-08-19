<template>
    <el-row style='margin: 100px auto;text-align: center;' :gutter="20">
      <el-col :span="12">
        <el-button style='width: 170px;height: 150px;' @click="architecture('0')">项目/任务架构</el-button>
      </el-col>
      <el-col :span="12">
        <el-button style='width: 180px;height: 150px;' @click="architecture('1')">项目/子项目/任务架构</el-button>
      </el-col>
    </el-row>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      type: ''
    }
  },
  methods: {
    architecture (data) {
      this.type = data
      this.$emit('funcarchitecture', this.type)
    }
  }
}
</script>
