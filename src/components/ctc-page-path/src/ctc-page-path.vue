<template>
  <el-row class="ctc-page-path" v-show="pagePathData.length>0">
    <el-col :span="24">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <span style="white-space:nowrap;color:#4190f7;">当前路径：</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item,index) in pagePathData" :key="index">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'CtcPagePath',
  props: {
  },
  data () {
    return {
      pagePathData: []
    }
  },
  watch: {
  },
  methods: {
    init (pagePathParams) {
      // 参数解释说明
      // { 'id': '路径ID', type: '路径类型', 'pageName': '当前跳转页面名称' }
      // type:[task,stage,project]
      if (Object.keys(pagePathParams).length > 0 && pagePathParams.id !== '') {
        this.$http.get('/ctc/project/projectBase/getPagePath', { 'params': pagePathParams }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.pagePathData = res.data
          }
        }).catch(() => { })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-page-path {
}
</style>
